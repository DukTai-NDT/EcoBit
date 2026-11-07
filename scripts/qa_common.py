"""Tiện ích chung cho bộ test QA (M6): server tĩnh, trình duyệt, đo bố cục, giải trò chơi.
Không chạy trực tiếp; được qa_screens.py, qa_play.py, qa_audit.py nhập vào.
Cần: pip install playwright && playwright install chromium (hoặc đặt CHROME_PATH).
"""
import json
import os
import socket
import subprocess
import sys
import time
from contextlib import contextmanager

from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):  # Windows mặc định cp1252, in tiếng Việt sẽ lỗi
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = os.path.join(ROOT, 'qa-shots')
SERVE_ROOT = os.path.join(ROOT, os.environ['QA_ROOT']) if os.environ.get('QA_ROOT') else ROOT
KEY = 'ecobit.v1'

VIEWPORTS = {
    '360x740': (360, 740, True),
    '375x667': (375, 667, True),
    '390x844': (390, 844, True),
    '768x1024': (768, 1024, True),
    '1366x768': (1366, 768, False),
    '1920x1080': (1920, 1080, False),
}
# Ngoài yêu cầu M6, chỉ soi nhanh: máy nhỏ đời cũ và điện thoại xoay ngang (thấp < 640px được phép cuộn nhẹ).
EXTRA_VIEWPORTS = {
    '320x568': (320, 568, True),
    '740x360': (740, 360, True),
    '667x375': (667, 375, True),
    '844x390': (844, 390, True),
}
# Điện thoại xoay ngang (M7, B03): được cuộn sân khấu nhưng mọi nút chính phải bấm được.
LANDSCAPE = ('740x360', '667x375', '844x390')

# Trạng thái đã mở khoá hết – để xem các màn Passport/Journey khi đầy đủ.
FULL_STATE = {
    'v': 1, 'profile': {'name': 'Nguyễn Thị Hồng Ánh', 'avatar': 'earth'}, 'points': 310,
    'activities': {k: {'done': True, 'perfect': True, 'plays': 1, 'best': {'correct': 1, 'total': 1}} for k in [
        'play:sort', 'play:match', 'play:puzzle', 'play:quiz', 'play:detective', 'discover:identify', 'lab:recycle']},
    'journey': [True] * 5, 'journeyDone': True,
    'codesViewed': ['pet', 'hdpe', 'pvc', 'ldpe', 'pp', 'ps', 'other'],
    'badges': {b: 1762473600000 for b in ['beginner', 'detective', 'scientist', 'explorer', 'master']},
    'createdAt': 1762473600000,
}


def free_port():
    s = socket.socket()
    s.bind(('127.0.0.1', 0))
    port = s.getsockname()[1]
    s.close()
    return port


@contextmanager
def server():
    port = free_port()
    # QA_ROOT (tuỳ chọn): phục vụ thư mục khác, VD gói deploy/ecobit-hub. Đường dẫn tương đối tính từ gốc repo.
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(port), '--bind', '127.0.0.1'], cwd=SERVE_ROOT,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(50):
        try:
            socket.create_connection(('127.0.0.1', port), 0.2).close()
            break
        except OSError:
            time.sleep(0.1)
    try:
        yield f'http://127.0.0.1:{port}/index.html'
    finally:
        srv.terminate()


@contextmanager
def browser():
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get('CHROME_PATH') or None, args=['--no-sandbox'])
        try:
            yield b
        finally:
            b.close()


def new_ctx(b, vp='360x740', touch=None, state=None, **kw):
    w, hh, t = VIEWPORTS[vp] if isinstance(vp, str) else vp
    ctx = b.new_context(viewport={'width': w, 'height': hh}, device_scale_factor=1,
                        has_touch=t if touch is None else touch, locale='vi-VN', accept_downloads=True, **kw)
    if state is not None:
        # Chỉ gieo một lần: tải lại trang phải giữ tiến độ thật, không bị gieo đè.
        ctx.add_init_script(
            f"if(!sessionStorage.getItem('qa-seed')){{sessionStorage.setItem('qa-seed','1');"
            f"localStorage.setItem({json.dumps(KEY)},{json.dumps(json.dumps(state))});}}")
    return ctx


class Log:
    """Gom lỗi console / pageerror / request hỏng của một trang."""

    def __init__(self, page, tag=''):
        self.items = []
        self.tag = tag
        page.on('console', lambda m: self.items.append(f'{tag} console.{m.type}: {m.text}')
                if m.type in ('error', 'warning') else None)
        page.on('pageerror', lambda e: self.items.append(f'{tag} pageerror: {e}'))
        page.on('response', lambda r: self.items.append(f'{tag} HTTP {r.status}: {r.url}') if r.status >= 400 else None)
        page.on('requestfailed', lambda r: self.items.append(f'{tag} request failed: {r.url} {r.failure}'))


def goto(page, base, route, wait=650):
    url = f'{base}#/{route}' if route else base
    same = page.url == url
    page.goto(url)
    if same:          # cùng hash thì goto không làm gì: tải lại để về trạng thái đầu của màn
        page.reload()
    page.wait_for_timeout(wait)


def state(page):
    return page.evaluate(f"JSON.parse(localStorage.getItem('{KEY}')||'null')")


def data(page, name):
    """Đọc thẳng module dữ liệu trong trang (đáp án để bot giải trò chơi)."""
    return page.evaluate(f"import('/src/data/{name}.js').then(m=>JSON.parse(JSON.stringify(m.default)))")


# ------------------------------- đo bố cục -------------------------------
AUDIT_JS = r"""
() => {
  const vw = innerWidth, vh = innerHeight, out = {};
  const se = document.scrollingElement;
  out.docV = se.scrollHeight - se.clientHeight;
  out.docH = se.scrollWidth - se.clientWidth;
  const sc = [...document.querySelectorAll('.screen')].filter(s => !s.classList.contains('leaving')).pop();
  if (!sc) return { error: 'no .screen' };
  out.screenV = sc.scrollHeight - sc.clientHeight;
  out.screenH = sc.scrollWidth - sc.clientWidth;
  const stage = document.getElementById('stage').getBoundingClientRect();
  const hiddenDeep = (e) => { for (let n = e; n && n !== document.body; n = n.parentElement) {
    const c = getComputedStyle(n);
    if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity === 0) return true; } return false; };
  const short = (e) => {
    const cls = typeof e.className === 'string' ? e.className.split(/\s+/).filter(Boolean)[0] : '';
    return `${e.tagName.toLowerCase()}${cls ? '.' + cls : ''}` + (e.children.length ? '' : `"${(e.textContent || '').trim().slice(0, 28)}"`);
  };
  // phần tử tràn khỏi màn hình (ngang), bỏ phần trang trí aria-hidden
  const offH = [], cut = [], inner = [], clip = [];
  for (const e of sc.querySelectorAll('*')) {
    if (e.closest('svg') && e.tagName.toLowerCase() !== 'svg') continue;
    if (e.closest('[aria-hidden="true"]')) continue;
    if (hiddenDeep(e)) continue;
    const r = e.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (r.right > vw + 1 || r.left < -1) offH.push(short(e));
    const interactive = e.matches('a,button,input,[role=slider],[role=tab]');
    const textLeaf = !e.children.length && (e.textContent || '').trim();
    if ((interactive || textLeaf) && (r.bottom > stage.bottom + 1 || r.top < stage.top - 1)) cut.push(short(e));
    const c = getComputedStyle(e);
    const ov = /(auto|scroll)/.test(c.overflowY);
    if (ov && e.scrollHeight > e.clientHeight + 1) inner.push(short(e) + ` +${e.scrollHeight - e.clientHeight}px`);
    if (/(hidden|clip)/.test(c.overflowY + c.overflowX) && (e.textContent || '').trim()
        && (e.scrollHeight > e.clientHeight + 2 || e.scrollWidth > e.clientWidth + 2)) clip.push(short(e) + ` ${e.scrollWidth - e.clientWidth}x${e.scrollHeight - e.clientHeight}`);
    // chữ bị cắt -webkit-line-clamp / ellipsis
    if (textLeaf && c.textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth + 1) clip.push(short(e) + ' (…)');
  }
  // chồng lấn: nút bị che bởi phần tử khác (thanh tab cố định, Ebi…)
  const covered = [];
  for (const e of sc.querySelectorAll('a,button,input,[role=slider]')) {
    if (hiddenDeep(e) || e.disabled) continue;
    const r = e.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (x < 0 || y < 0 || x > vw || y > vh) { covered.push(short(e) + ' (ngoài khung)'); continue; }
    const t = document.elementFromPoint(x, y);
    if (t && !e.contains(t) && !t.contains(e) && !t.closest('.toasts,.confetti')) covered.push(short(e) + ' ⟵ ' + short(t));
  }
  // chữ tràn ra ngoài khung của nút/thẻ chứa nó (overflow: visible nên không bị đo ở trên)
  const spill = [];
  for (const box of sc.querySelectorAll('button,a,.bubble,.card,.order-slot')) {
    if (hiddenDeep(box)) continue;
    const r = box.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
    let top = Infinity, bot = -Infinity, left = Infinity, right = -Infinity;
    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      if (!t.textContent.trim() || t.parentElement.closest('[aria-hidden="true"],.sr-only')) continue;
      const rg = document.createRange(); rg.selectNodeContents(t);
      for (const q of rg.getClientRects()) { top = Math.min(top, q.top); bot = Math.max(bot, q.bottom); left = Math.min(left, q.left); right = Math.max(right, q.right); }
    }
    if (top === Infinity) continue;
    const over = Math.max(r.top - top, bot - r.bottom, r.left - left, right - r.right);
    if (over > 1.5) spill.push(`${short(box)} tràn ${Math.round(over)}px "${(box.textContent || '').trim().slice(0, 26)}"`);
  }
  out.spill = [...new Set(spill)].slice(0, 8);
  out.offH = [...new Set(offH)].slice(0, 6);
  out.cut = [...new Set(cut)].slice(0, 8);
  out.inner = [...new Set(inner)].slice(0, 6);
  out.clip = [...new Set(clip)].slice(0, 6);
  out.covered = [...new Set(covered)].slice(0, 6);
  return out;
}
"""


# Nút chính bấm được: cuộn tới nút rồi elementFromPoint ở tâm phải trả về chính nút (M7, B03).
HIT_JS = r"""
() => {
  const sc = [...document.querySelectorAll('.screen')].filter(s => !s.classList.contains('leaving')).pop();
  if (!sc) return ['no .screen'];
  const hiddenDeep = (e) => { for (let n = e; n && n !== document.body; n = n.parentElement) {
    const c = getComputedStyle(n);
    if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity === 0) return true; } return false; };
  const name = (e) => `${e.tagName.toLowerCase()}.${String(e.className).split(/\s+/)[0]} "${(e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 24)}"`;
  const bad = [];
  for (const e of sc.querySelectorAll('a,button,input,[role=slider],[role=tab]')) {
    if (hiddenDeep(e) || e.disabled) continue;
    const box = e.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) continue;
    // chỉ cuộn những vùng người dùng cuộn được (.stage bị khoá nên không dùng scrollIntoView)
    for (let n = e.parentElement; n && sc.contains(n); n = n.parentElement) {
      if (!/(auto|scroll)/.test(getComputedStyle(n).overflowY)) continue;
      const r = e.getBoundingClientRect(), v = n.getBoundingClientRect();
      n.scrollTop += r.top + r.height / 2 - (v.top + v.height / 2);
    }
    const r = e.getBoundingClientRect();
    const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    if (!t || (!e.contains(t) && !t.contains(e) && !t.closest('.toasts,.confetti'))) bad.push(`${name(e)} ⟵ ${t ? name(t) : 'ngoài khung'}`);
  }
  sc.scrollTop = 0;
  return [...new Set(bad)].slice(0, 8);
}
"""

# Puzzle: số chỗ hai ô chồng nhau, ô thấp hơn 44px, chữ tràn ô (M7, B01).
ORDER_JS = r"""
() => {
  const rs = [...document.querySelectorAll('.order-slot')].map(e => ({ e, r: e.getBoundingClientRect() }));
  let overlaps = 0, low = 0, spill = 0;
  rs.forEach(({ e, r }, i) => {
    if (i && r.top < rs[i - 1].r.bottom - 0.5) overlaps++;
    if (e.classList.contains('is-filled') && r.height < 43.5) low++;
    const l = e.querySelector('.order-label');
    if (l) { const b = l.getBoundingClientRect(); if (b.bottom > r.bottom + 0.5 || b.top < r.top - 0.5) spill++; }
  });
  const stock = document.querySelector('.order-stock')?.getBoundingClientRect();
  const last = rs.length ? rs[rs.length - 1].r : null;
  if (stock && last && last.bottom > stock.top + 0.5) overlaps++;
  return { overlaps, low, spill, n: rs.length };
}
"""


def problems(a, vh):
    """Rút gọn kết quả đo thành danh sách vấn đề. Dưới 640px cao được phép cuộn nhẹ trong màn."""
    p = []
    if 'error' in a:
        return [a['error']]
    if a['docH'] > 0 or a['screenH'] > 0:
        p.append(f"CUỘN NGANG doc={a['docH']} screen={a['screenH']}")
    if a['docV'] > 0:
        p.append(f"CUỘN DOC trang +{a['docV']}px")
    if a['screenV'] > 0:
        p.append(f"cuộn trong màn +{a['screenV']}px")
    for k, label in (('offH', 'tràn ngang'), ('cut', 'bị cắt'), ('inner', 'vùng cuộn con'), ('clip', 'chữ bị xén'), ('spill', 'chữ tràn khung'), ('covered', 'bị che')):
        if a.get(k):
            p.append(f"{label}: {', '.join(a[k])}")
    return p


# ------------------------------- bot giải trò chơi -------------------------------
def tap(page, loc, mode):
    """Bấm bằng chạm thật hoặc chuột."""
    if mode == 'touch':
        # Chạm theo toạ độ: nút có hoạt ảnh liên tục làm kiểm tra "đứng yên" của Playwright hết giờ.
        loc.wait_for(state='visible', timeout=4000)
        for _ in range(40):
            if loc.is_enabled():
                break
            page.wait_for_timeout(50)
        loc.evaluate("e => e.scrollIntoView({ block: 'nearest' })")   # xoay ngang: nút có thể nằm dưới nếp gấp (nút có hoạt ảnh không 'đứng yên')
        r = loc.bounding_box()
        page.touchscreen.tap(r['x'] + r['width'] / 2, r['y'] + r['height'] / 2)
    else:
        loc.click(timeout=3000)


def tap_until(page, loc, mode, done, tries=3):
    """Bấm cho tới khi done() đúng. Chỉ dùng cho cú chạm ngay sau kéo: xem chú thích trong touch_drag."""
    for _ in range(tries):
        tap(page, loc, mode)
        page.wait_for_timeout(350)
        if done():
            return True
    return False


def touch_drag(page, cdp, src, dst, steps=8):
    """Kéo bằng sự kiện cảm ứng thật qua CDP (Input.dispatchTouchEvent)."""
    a = src.bounding_box()
    b = dst.bounding_box()
    x0, y0 = a['x'] + a['width'] / 2, a['y'] + a['height'] / 2
    x1, y1 = b['x'] + b['width'] / 2, b['y'] + b['height'] / 2
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x0, 'y': y0}]})
    for i in range(1, steps + 1):
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [
            {'x': x0 + (x1 - x0) * i / steps, 'y': y0 + (y1 - y0) * i / steps}]})
        page.wait_for_timeout(16)
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
    # Chromium giả lập cảm ứng qua CDP: sau một cú kéo, cú chạm kế tiếp hay mất click (lặp lại được cả trên trang
    # trắng không có mã của app, nên không phải lỗi app). Chạm vào góc trống để xả trạng thái.
    page.wait_for_timeout(350)
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': 2, 'y': 2}]})
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})


def mouse_drag(page, src, dst):
    a = src.bounding_box()
    b = dst.bounding_box()
    page.mouse.move(a['x'] + a['width'] / 2, a['y'] + a['height'] / 2)
    page.mouse.down()
    page.mouse.move(b['x'] + b['width'] / 2, b['y'] + b['height'] / 2, steps=8)
    page.mouse.up()


def solve_sort(page, items, mode, how='tap', wrong_first=False, cdp=None, scope='body'):
    """how: tap (chạm vật rồi chạm ô) | drag (kéo). Trả về số vật đã xếp."""
    n = 0
    by_label = {i['label']: i for i in items}
    for _ in range(len(items)):
        card = page.locator(f'{scope} .sort-card')
        card.wait_for(timeout=4000)
        label = card.locator('.sort-card-label').inner_text().strip()
        item = by_label[label]
        target = page.locator(f'{scope} .sort-bin[data-bin="{item["bin"]}"]')
        if wrong_first and n == 0:
            bad = page.locator(f'{scope} .sort-bin:not([data-bin="{item["bin"]}"])').first
            if how == 'drag' and mode == 'touch':
                touch_drag(page, cdp, card, bad)
            elif how == 'drag':
                mouse_drag(page, card, bad)
            else:
                tap(page, card, mode)
                tap(page, bad, mode)
            page.wait_for_timeout(320)
        if how == 'drag' and mode == 'touch':
            touch_drag(page, cdp, card, target)
        elif how == 'drag':
            mouse_drag(page, card, target)
        else:
            tap(page, card, mode)
            tap(page, target, mode)
        n += 1
        page.wait_for_timeout(330)
    return n


def solve_match(page, pairs, mode, wrong_first=False):
    if wrong_first:
        tap(page, page.locator('.match-cell.left').first, mode)
        wrong = [p for p in pairs if p['left']['label'] != page.locator('.match-cell.left').first.inner_text().strip()][0]
        tap(page, page.locator('.match-cell.right').filter(has_text=wrong['right']['label']), mode)
        page.wait_for_timeout(480)
    for p in pairs:
        tap(page, page.locator('.match-cell.left').filter(has_text=p['left']['label']), mode)
        tap(page, page.locator('.match-cell.right').filter(has_text=p['right']['label']), mode)
        page.wait_for_timeout(60)


def solve_order(page, items, mode, wrong_first=False):
    order = list(items)
    if wrong_first:
        order = [order[1], order[0]] + order[2:]
    for it in order:
        tap(page, page.locator('.order-card').filter(has_text=it['label']), mode)
    tap(page, page.locator('.order-check'), mode)
    if wrong_first:
        page.wait_for_timeout(200)
        # trả 2 thẻ đỏ rồi xếp lại đúng
        for _ in range(2):
            tap(page, page.locator('.order-slot.is-bad').first, mode)
        for it in items[:2]:
            tap(page, page.locator('.order-card').filter(has_text=it['label']), mode)
        tap(page, page.locator('.order-check'), mode)


def quiz_opt(page, q, n):
    """Phương án có chỉ số gốc n: engine trộn thứ tự hiển thị nên phải tìm theo chữ (M7, B11)."""
    return page.locator('.quiz-opt').filter(has_text=q['options'][n])


def solve_quiz(page, questions, mode, wrong=(), timeout_at=(), timer=0, shot=None):
    for i, q in enumerate(questions):
        if i in timeout_at:
            page.wait_for_timeout(int((timer + 0.6) * 1000))
        else:
            n = q['answer'] if i not in wrong else (q['answer'] + 1) % len(q['options'])
            tap(page, quiz_opt(page, q, n), mode)
        page.wait_for_timeout(120)
        if shot:
            shot(i)
        tap(page, page.locator('.quiz-next'), mode)
        page.wait_for_timeout(120)
