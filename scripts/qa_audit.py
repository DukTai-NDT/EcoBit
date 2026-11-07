"""Soát khả năng truy cập & hiệu năng (M6, mục 7, 8).

Dùng: python3 scripts/qa_audit.py
Đo: alt ảnh, nhãn nút, tương phản chữ, cỡ chữ < 16px, vùng chạm < 44px, dung lượng tải lần đầu, 404, ảnh lazy.
Kết quả: in tóm tắt, ghi qa-shots/audit.json.
"""
import gzip
import json
import os
import sys
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qa_common import FULL_STATE, ROOT, SHOTS, Log, browser, data, goto, new_ctx, server
from qa_screens import ROUTES

A11Y_JS = r"""
() => {
  const parse = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] == null ? 1 : p[3] }; };
  const lin = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
  const lum = (c) => .2126 * lin(c.r) + .7152 * lin(c.g) + .0722 * lin(c.b);
  const over = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
  const bgOf = (el) => { // trộn nền các lớp; gặp ảnh nền thì đánh dấu không chắc chắn
    const stack = []; let img = false;
    for (let n = el; n; n = n.parentElement) { const c = getComputedStyle(n); const b = parse(c.backgroundColor);
      if (c.backgroundImage !== 'none') img = true;
      if (b && b.a > 0) { stack.push(b); if (b.a === 1) break; } }
    let col = { r: 254, g: 248, b: 228, a: 1 };
    for (const b of stack.reverse()) col = over(b, col);
    return { col, img };
  };
  const hidden = (e) => { for (let n = e; n && n !== document.body; n = n.parentElement) { const c = getComputedStyle(n); if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity === 0) return true; } return false; };
  const name = (e) => (e.getAttribute('aria-label') || e.getAttribute('title') || e.innerText || e.value || [...e.querySelectorAll('img[alt]')].map(i => i.alt).join(' ') || '').trim();
  const short = (e) => { const cls = typeof e.className === 'string' ? e.className.split(/\s+/).filter(Boolean)[0] : ''; return `${e.tagName.toLowerCase()}${cls ? '.' + cls : ''}`; };
  const out = { noAlt: [], noName: [], small: [], lowC: [], smallT: [], decorative: 0 };
  const root = document.querySelector('.screen:not(.leaving)') ? document.body : document.body;
  for (const i of root.querySelectorAll('img')) {
    if (!i.hasAttribute('alt')) out.noAlt.push(i.src.split('/').pop());
    else if (i.alt === '') out.decorative++;
  }
  for (const e of root.querySelectorAll('a,button,input,[role=slider],[role=tab]')) {
    if (hidden(e)) continue;
    if (!name(e)) out.noName.push(short(e));
    const r = e.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (e.matches('input')) { if (r.height < 44) out.smallT.push(`${short(e)} ${Math.round(r.width)}×${Math.round(r.height)}`); continue; }
    if (!e.disabled && (r.width < 44 || r.height < 44)) out.smallT.push(`${short(e)} ${Math.round(r.width)}×${Math.round(r.height)}`);
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    const s = t.textContent.trim(); if (!s) continue;
    const e = t.parentElement; if (!e || seen.has(e) || e.closest('noscript,script,style,.sr-only')) continue;
    seen.add(e);
    if (hidden(e)) continue;
    const c = getComputedStyle(e); const fs = parseFloat(c.fontSize); const fw = +c.fontWeight;
    if (/^[\u{1F300}-\u{1FAFF}☀-➿←→↔✕‹›★\s]+$/u.test(s)) continue;
    if (fs < 16) out.small.push(`${short(e)} ${fs.toFixed(1)}px "${s.slice(0, 18)}"`);
    const fg = parse(c.color); if (!fg) continue;
    const { col, img } = bgOf(e);
    const a = lum(over(fg, col)), b = lum(col);
    const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
    const need = (fs >= 24 || (fs >= 18.66 && fw >= 700)) ? 3 : 4.5;
    if (ratio < need) out.lowC.push(`${short(e)} ${ratio.toFixed(2)}:1 ${img ? '(có nền ảnh) ' : ''}${fs.toFixed(0)}px "${s.slice(0, 18)}"`);
  }
  for (const k of ['noAlt', 'noName', 'small', 'lowC', 'smallT']) out[k] = [...new Set(out[k])];
  return out;
}
"""


def main():
    result = {}
    with server() as base, browser() as b:
        # --- a11y theo route ---
        agg = {k: {} for k in ['noAlt', 'noName', 'small', 'lowC', 'smallT']}
        for vp in ('360x740', '1366x768'):
            ctx = new_ctx(b, vp, state=FULL_STATE)
            page = ctx.new_page()
            Log(page)
            for r in ROUTES:
                goto(page, base, r, 700)
                a = page.evaluate(A11Y_JS)
                for k in agg:
                    for item in a[k]:
                        agg[k].setdefault(item, set()).add(f'{vp}:{r}')
            ctx.close()
        result['a11y'] = {k: {i: sorted(v)[:6] + ([f'…{len(v)} route'] if len(v) > 6 else []) for i, v in d.items()} for k, d in agg.items()}
        for k, d in agg.items():
            print(f'\n[{k}] {len(d)} mục')
            for i, v in sorted(d.items(), key=lambda x: -len(x[1]))[:40]:
                print(f'  {i}  ×{len(v)}  {sorted(v)[0]}')

        # --- dung lượng tải lần đầu: mỗi điểm vào, cache trống ---
        perf = {}
        for entry in ('home', 'play', 'discover'):
            for vp in ('360x740', '1366x768'):
                ctx = new_ctx(b, vp)
                page = ctx.new_page()
                log = Log(page, 'perf')
                reqs = []

                def on_resp(resp, reqs=reqs):
                    try:
                        body = resp.body()
                    except Exception:
                        body = b''
                    reqs.append((resp.url, len(body), resp.status, resp.headers.get('content-encoding', '')))
                page.on('response', on_resp)
                page.goto(f'{base}#/{entry}', wait_until='networkidle')
                page.wait_for_timeout(1200)
                local = [r for r in reqs if '127.0.0.1' in r[0]]
                remote = [r for r in reqs if '127.0.0.1' not in r[0]]
                raw_local = sum(r[1] for r in local)
                gz_local = 0
                for url, size, st, _ in local:
                    path = url.split('?')[0].split('#')[0].split('/', 3)[3]
                    p = os.path.join(ROOT, path)
                    if os.path.isfile(p):
                        blob = open(p, 'rb').read()
                        gz_local += len(gzip.compress(blob)) if p.endswith(('.js', '.css', '.html')) else len(blob)
                kinds = Counter()
                for u, s, _, _ in reqs:
                    ext = u.split('?')[0].rsplit('.', 1)[-1][:6]
                    kinds['font' if 'gstatic' in u else 'css-font' if 'googleapis' in u else ext] += s
                key = f'{entry}@{vp}'
                perf[key] = {'requests': len(reqs), 'local_raw': raw_local, 'local_gz_est': gz_local, 'remote': sum(r[1] for r in remote),
                             'total_raw': raw_local + sum(r[1] for r in remote), 'total_gz_est': gz_local + sum(r[1] for r in remote),
                             'by_kind': dict(kinds), 'img_files': sum(1 for r in reqs if r[0].endswith('.webp')),
                             'errors': log.items}
                print(key, json.dumps(perf[key], ensure_ascii=False))
                ctx.close()
        result['perf'] = perf

        # --- tổng tải nếu đi hết 33 route ---
        ctx = new_ctx(b, '360x740', state=FULL_STATE)
        page = ctx.new_page()
        log = Log(page, 'full')
        sizes = {}

        def rec(resp):
            try:
                sizes[resp.url] = len(resp.body())
            except Exception:
                pass
        page.on('response', rec)
        for r in ROUTES:
            goto(page, base, r, 500)
        result['all_routes_bytes'] = sum(sizes.values())
        result['all_routes_files'] = len(sizes)
        print('tải hết mọi route:', result['all_routes_bytes'], 'bytes', len(sizes), 'tệp; lỗi:', log.items)
        ctx.close()

        # --- ảnh được khai báo trong data có tồn tại không ---
        ctx = new_ctx(b, '360x740')
        page = ctx.new_page()
        goto(page, base, 'home')
        names = page.evaluate(r"""async () => {
          const out = new Set();
          for (const f of ['codes','facts','journey','lab','match','puzzle','quiz','detective','sort']) {
            const m = await import(`/src/data/${f}.js`);
            JSON.stringify(m.default, (k, v) => { if (['img','scene','pieceImg','from','to'].includes(k) && typeof v === 'string') out.add(v); return v; });
          }
          return [...out];
        }""")
        missing = [n for n in names if not os.path.isfile(os.path.join(ROOT, 'public', 'img', n + '.webp'))]
        have = {f[:-5] for f in os.listdir(os.path.join(ROOT, 'public', 'img')) if f.endswith('.webp')}
        result['img_missing'] = missing
        print('ảnh thiếu:', missing)
        print('ảnh dư (không có trong data, có thể dùng trong code):', sorted(have - set(names)))
        ctx.close()

    with open(os.path.join(SHOTS, 'audit.json'), 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
