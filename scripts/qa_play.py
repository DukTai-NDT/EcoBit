"""Kiểm thử hành vi đầu-cuối (M6, mục 1, 3, 4, 5).

Dùng: python3 scripts/qa_play.py [nav play points card]   (mặc định: tất cả)
Kết quả: in PASS/FAIL từng ca; qa-shots/behaviour.json; PNG thẻ/hình nền tải về ở qa-shots/downloads/.
"""
import json
import os
import struct
import sys
import time
import traceback

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qa_common import (FULL_STATE, KEY, SHOTS, Log, browser, data, goto, new_ctx, server, solve_match, solve_order,
                       solve_quiz, solve_sort, state, tap, tap_until)

results = []
all_logs = []
DL = os.path.join(SHOTS, 'downloads')
os.makedirs(DL, exist_ok=True)


def check(name, ok, detail=''):
    results.append({'name': name, 'ok': bool(ok), 'detail': str(detail)})
    print(('PASS ' if ok else 'FAIL ') + name + (f'  [{detail}]' if detail != '' else ''), flush=True)


def guarded(name, fn):
    try:
        fn()
    except Exception as e:
        where = [f'{os.path.basename(f.filename)}:{f.lineno}' for f in traceback.extract_tb(e.__traceback__)
                 if os.path.basename(f.filename) in ('qa_play.py', 'qa_common.py')]
        check(f'{name}: CRASH', False, f"{' > '.join(where[-3:])} {str(e).splitlines()[0][:200]}")


def hash_of(page):
    return page.evaluate('location.hash')


def pts(page):
    s = state(page)
    return s['points'] if s else 0


# ---------------------------------- 1. Điều hướng ----------------------------------
def t_nav(b, base):
    ctx = new_ctx(b, '1366x768')
    page = ctx.new_page()
    log = Log(page, 'nav')
    goto(page, base, '')
    page.evaluate('window.__mark = 1')
    tabs = ['home', 'discover', 'journey', 'lab', 'play', 'passport', 'connect']
    for z in tabs:
        page.locator(f'.tab[data-zone="{z}"]').click()
        page.wait_for_timeout(350)
        cur = page.locator('.tab[aria-current="page"]').get_attribute('data-zone')
        check(f'nav: tab {z}', hash_of(page) == f'#/{z}' and cur == z, f'{hash_of(page)} cur={cur}')
    check('nav: 7 tab không tải lại trang', page.evaluate('window.__mark') == 1)
    check('nav: chỉ còn 1 .screen sau khi đổi tab', page.locator('.screen:not(.leaving)').count() == 1)

    page.go_back(); page.wait_for_timeout(350)
    check('nav: Back về passport', hash_of(page) == '#/passport' and page.locator('.screen[data-zone="passport"]').count() >= 1, hash_of(page))
    page.go_back(); page.wait_for_timeout(350)
    check('nav: Back về play', hash_of(page) == '#/play', hash_of(page))
    page.go_forward(); page.wait_for_timeout(350)
    check('nav: Forward', hash_of(page) == '#/passport', hash_of(page))
    check('nav: Back/Forward vẫn không tải lại', page.evaluate('window.__mark') == 1)

    for r, sel in [('play/quiz', '.quiz-opt'), ('discover/pvc', '.dv-hero-abbr'), ('journey/3', '.jr-stage'),
                   ('lab/recycle', '.lab-choice'), ('passport/card', '.pp-card-canvas'), ('play/sort', '.sort-card'),
                   ('play/match', '.match-cell'), ('play/puzzle', '.order-card'), ('play/detective', '.quiz-opt'),
                   ('discover/identify', '.dv-obj'), ('discover/facts', '.dv-flip'), ('lab/slider', '.lab-grip'),
                   ('passport/wallpapers', '.pp-wall-canvas'), ('connect/stats', '.cn-table'), ('home/map', '.hm-place')]:
        p2 = ctx.new_page()
        p2log = Log(p2, r)
        goto(p2, base, r)
        ok = p2.locator(sel).count() > 0 and hash_of(p2) == f'#/{r}'
        check(f'nav: link sâu #/{r}', ok, hash_of(p2))
        all_logs.extend(p2log.items)
        p2.close()

    if True:
        p2 = ctx.new_page()
        goto(p2, base, 'discover/pvc')
        check('nav: #/discover/pvc đúng mã', p2.locator('.dv-hero-abbr').inner_text() == 'PVC')
        goto(p2, base, 'journey/3')
        check('nav: #/journey/3 đúng chặng', 'Chặng 3' in p2.locator('.jr-title').inner_text())
        p2.close()

    bad = [('xyz', '#/home', '.hm-welcome'), ('', None, '.hm-welcome'), ('play/xyz', '#/play', '.play-hub'),
           ('discover/xyz', '#/discover', '.dv-home'), ('journey/9', '#/journey', '.jr-map'), ('journey/0', '#/journey', '.jr-map'),
           ('journey/abc', '#/journey', '.jr-map'), ('lab/xyz', '#/lab', '.lab-hub'), ('passport/xyz', '#/passport', '.pp-main'),
           ('connect/gallery', '#/connect', '.cn-about'), ('connect/partners', '#/connect', '.cn-about'),
           ('home/xyz', '#/home', '.hm-welcome'), ('journey/finale', '#/journey', '.jr-map'),
           ('constructor', '#/home', '.hm-welcome'), ('__proto__', '#/home', '.hm-welcome'),
           ('%', '#/home', '.hm-welcome'), ('%E0%A4%A', '#/home', '.hm-welcome'), ('play/%ZZ', '#/play', '.play-hub')]
    for r, want, sel in bad:
        p2 = ctx.new_page()
        p2log = Log(p2, f'bad-link {r}')
        goto(p2, base, r, 700)
        got = hash_of(p2)
        ok = p2.locator(sel).count() > 0 and (want is None or got == want)
        check(f'nav: link sai #/{r} → {want or "Home"}', ok, f'hash={got} screens={p2.locator(".screen").count()} {"; ".join(p2log.items[:1])}')
        all_logs.extend(p2log.items)
        p2.close()

    # link sai rồi nhảy qua link trong app: bẫy nút Back?
    p2 = ctx.new_page()
    goto(p2, base, 'home')
    p2.evaluate("location.hash = '#/play/xyz'")
    p2.wait_for_timeout(500)
    p2.go_back(); p2.wait_for_timeout(500)
    check('nav: link con sai không tạo bẫy Back (về lại được #/home)', hash_of(p2) == '#/home', hash_of(p2))
    p2.close()

    # đổi link ngay lúc đang chơi quiz: timer đã dọn?
    p2 = ctx.new_page()
    p2log = Log(p2, 'quiz-leave')
    goto(p2, base, 'play/quiz')
    p2.evaluate("location.hash = '#/home'")
    p2.wait_for_timeout(700)
    check('nav: rời quiz đang chạy không lỗi', not p2log.items, p2log.items[:1])
    p2.close()

    # hộp thoại mở + Back
    p2 = ctx.new_page()
    goto(p2, base, 'play')
    p2.evaluate("location.hash = '#/passport'")
    p2.wait_for_timeout(500)
    p2.locator('.pp-reset').click()
    p2.wait_for_timeout(300)
    p2.go_back(); p2.wait_for_timeout(450)
    n = p2.locator('.modal-backdrop').count()
    check('nav: hộp thoại đóng khi Back sang màn khác', n == 0, f'hash={hash_of(p2)} modal còn={n}')
    if n:
        p2.screenshot(path=os.path.join(SHOTS, 'bug-modal-after-back.png'))
    p2.close()
    all_logs.extend(log.items)
    ctx.close()


# ---------------------------------- 3 + 4. Chơi trọn & điểm ----------------------------------
def play_journey(page, base, mode, wrong_first=False, cdp=None, how='tap'):
    j = data(page, 'journey')
    expected_pts = pts(page)
    for s in j['stages']:
        sid = s['id']
        goto(page, base, f'journey/{sid}', 450)
        while page.locator('.jr-nav .btn', has_text='Nhiệm vụ').count() == 0:
            tap(page, page.locator('.jr-nav .btn').last, mode)
            page.wait_for_timeout(70)
        tap(page, page.locator('.jr-nav .btn', has_text='Nhiệm vụ'), mode)
        page.wait_for_timeout(250)
        cfg, eng = s['task']['config'], s['task']['engine']
        if eng == 'quiz':
            solve_quiz(page, cfg['questions'], mode, wrong=(0,) if wrong_first else ())
        elif eng == 'sort':
            solve_sort(page, cfg['items'], mode, how=how, wrong_first=wrong_first, cdp=cdp)
        elif eng == 'order':
            solve_order(page, cfg['items'], mode, wrong_first=wrong_first)
        elif eng == 'match':
            solve_match(page, cfg['pairs'], mode, wrong_first=wrong_first)
        page.locator('.jr-reward').wait_for(timeout=4000)
        page.locator('.jr-nav .btn-primary:not([disabled])').wait_for(timeout=4000)
        st = state(page)
        check(f'[{mode}] journey chặng {sid}: nhận mảnh', st['journey'][sid - 1] is True)
        before_hash = hash_of(page)
        tap_until(page, page.locator('.jr-nav .btn-primary:not([disabled])'), mode, lambda: hash_of(page) != before_hash)
        page.wait_for_timeout(200)
        next_hash = f'#/journey/{sid + 1}' if sid < 5 else '#/journey/finale'
        check(f'[{mode}] journey chặng {sid}: nút tiếp tới {next_hash}', hash_of(page) == next_hash, hash_of(page))
    check(f'[{mode}] journey: đủ 5 mảnh, +100', state(page)['journeyDone'] and pts(page) == expected_pts + 100, pts(page))


def play_lab(page, base, mode, how='tap', cdp=None, wrong=True):
    goto(page, base, 'lab/recycle', 450)
    lab = data(page, 'lab')
    choices = lab['steps'][0]['choices']
    for k, c in enumerate(choices):
        if c['isPet'] or wrong:
            tap(page, page.locator('.lab-choice').nth(k), mode)
    tap(page, page.locator('.lab-nav .btn').last, mode)
    page.wait_for_timeout(300)
    solve_sort(page, [{'label': c['label'], 'bin': 'pet' if c['isPet'] else 'other'} for c in choices], mode, how=how, cdp=cdp)
    page.wait_for_timeout(950)
    for _ in range(2):
        tap_until(page, page.locator('.lab-nav .btn').last, mode, lambda: page.locator('.lab-run').count() == 1)
        tap(page, page.locator('.lab-run'), mode)
        page.locator('.lab-nav .btn-primary').wait_for(timeout=8000)
    tap(page, page.locator('.lab-nav .btn').last, mode)
    page.wait_for_timeout(250)
    tap(page, page.locator('.lab-product').nth(2), mode)
    page.wait_for_timeout(100)
    tap(page, page.locator('.lab-nav .btn').last, mode)
    page.wait_for_timeout(350)


def run_all_games(b, base, vp, mode):
    ctx = new_ctx(b, vp, touch=(mode == 'touch'))
    page = ctx.new_page()
    log = Log(page, f'play-{mode}')
    cdp = ctx.new_cdp_session(page) if mode == 'touch' else None
    goto(page, base, 'play')

    # SORT – kéo thả thật, có thả sai rồi mới đúng
    goto(page, base, 'play/sort', 500)
    sort = data(page, 'sort')
    solve_sort(page, sort['items'], mode, how='drag', wrong_first=True, cdp=cdp)
    page.locator('.eng-result').wait_for(timeout=4000)
    txt = page.locator('.res-score').inner_text()
    check(f'[{mode}] sort kéo thả xong, thả sai vẫn tính đúng 11/12', txt == 'Đúng 11/12', txt)
    check(f'[{mode}] sort +20 (không đúng hết)', pts(page) == 20, pts(page))
    check(f'[{mode}] huy hiệu beginner sau trò đầu', 'beginner' in state(page)['badges'])
    # chơi lại: đúng hết → +10 đúng 1 lần
    page.locator('.res-actions .btn', has_text='Chơi lại').click()
    page.wait_for_timeout(350)
    solve_sort(page, sort['items'], mode, how='tap')
    page.locator('.eng-result').wait_for(timeout=4000)
    check(f'[{mode}] sort chơi lại đúng hết +10', pts(page) == 30, pts(page))
    page.locator('.res-actions .btn', has_text='Chơi lại').click()
    page.wait_for_timeout(350)
    solve_sort(page, sort['items'], mode, how='tap')
    page.locator('.eng-result').wait_for(timeout=4000)
    check(f'[{mode}] sort chơi lại lần 3 không cộng', pts(page) == 30, pts(page))
    check(f'[{mode}] màn kết quả báo đã nhận điểm', 'đã nhận' in page.locator('.res-points').inner_text(), page.locator('.res-points').inner_text())

    # MATCH – ghép sai 1 lần
    goto(page, base, 'play/match', 500)
    match = data(page, 'match')
    solve_match(page, match['pairs'], mode, wrong_first=True)
    page.locator('.eng-result').wait_for(timeout=4000)
    check(f'[{mode}] match ghép sai vẫn xong, 6/7', page.locator('.res-score').inner_text() == 'Đúng 6/7', page.locator('.res-score').inner_text())
    check(f'[{mode}] match +20', pts(page) == 50, pts(page))

    # PUZZLE – xếp sai, sửa
    goto(page, base, 'play/puzzle', 500)
    puz = data(page, 'puzzle')
    solve_order(page, puz['items'], mode, wrong_first=True)
    page.locator('.eng-result').wait_for(timeout=4000)
    check(f'[{mode}] puzzle sửa rồi xong, 4/6', page.locator('.res-score').inner_text() == 'Đúng 4/6', page.locator('.res-score').inner_text())
    check(f'[{mode}] puzzle +20', pts(page) == 70, pts(page))

    # QUIZ – có câu sai, có câu hết giờ thật (20 giây)
    goto(page, base, 'play/quiz', 500)
    quiz = data(page, 'quiz')
    def on_q(i):
        if i == 2:
            check(f'[{mode}] quiz hết giờ báo "Hết giờ rồi!"', 'Hết giờ' in page.locator('.quiz-verdict').inner_text(), page.locator('.quiz-verdict').inner_text())
            check(f'[{mode}] quiz hết giờ khoá phương án, hiện đáp án đúng', page.locator('.quiz-opt.is-ok').count() == 1 and page.locator('.quiz-opt[disabled]').count() == 4)
    solve_quiz(page, quiz['questions'], mode, wrong=(0,), timeout_at=(2,), timer=quiz['timer'], shot=on_q)
    page.locator('.eng-result').wait_for(timeout=4000)
    check(f'[{mode}] quiz 8/10', page.locator('.res-score').inner_text() == 'Đúng 8/10', page.locator('.res-score').inner_text())
    check(f'[{mode}] quiz +20', pts(page) == 90, pts(page))

    # DETECTIVE – đúng hết
    goto(page, base, 'play/detective', 500)
    det = data(page, 'detective')
    solve_quiz(page, det['questions'], mode)
    page.locator('.eng-result').wait_for(timeout=4000)
    check(f'[{mode}] detective đúng hết +30', pts(page) == 120, pts(page))

    # IDENTIFY – sai 1 rồi đúng: chưa có huy hiệu; chơi lại đúng hết: có
    codes = data(page, 'codes')
    def identify(wrong_one):
        objs = page.locator('.dv-obj')
        for i in range(objs.count()):
            tap(page, objs.nth(i), mode)
            label = objs.nth(i).get_attribute('aria-label').split(': ', 1)[1]
            code = next(c for c in codes if c['object'] == label)
            if wrong_one and i == 0:
                bad = next(c for c in codes if c['id'] != code['id'])
                tap(page, page.locator('.dv-choice').nth(codes.index(bad)), mode)
                page.wait_for_timeout(80)
            tap(page, page.locator('.dv-choice').nth(codes.index(code)), mode)
            page.wait_for_timeout(60)
        tap(page, page.locator('.dv-finish'), mode)
        page.locator('.eng-result').wait_for(timeout=3000)
    goto(page, base, 'discover/identify', 500)
    identify(True)
    check(f'[{mode}] identify +20, chưa có huy hiệu detective', pts(page) == 140 and 'detective' not in state(page)['badges'], pts(page))
    page.locator('.res-actions .btn', has_text='Chơi lại').click()
    page.wait_for_timeout(300)
    identify(False)
    check(f'[{mode}] identify đúng hết +10, mở huy hiệu detective', pts(page) == 150 and 'detective' in state(page)['badges'], pts(page))

    # LAB
    play_lab(page, base, mode, how='drag', cdp=cdp, wrong=True)
    page.locator('.eng-result').wait_for(timeout=3000)
    check(f'[{mode}] lab +30, huy hiệu scientist', pts(page) == 180 and 'scientist' in state(page)['badges'], pts(page))
    check(f'[{mode}] lab có ghi chú mô phỏng ở màn kết quả', page.locator('.lab-note').count() == 1)
    page.locator('.res-actions .btn', has_text='Chơi lại').click()
    page.wait_for_timeout(300)
    check(f'[{mode}] lab chơi lại về bước 1', page.locator('.lab-choice').count() == 6)
    play_lab(page, base, mode, wrong=False)
    page.locator('.eng-result').wait_for(timeout=3000)
    check(f'[{mode}] lab chơi lại không cộng thêm', pts(page) == 180, pts(page))

    # JOURNEY
    play_journey(page, base, mode, wrong_first=True, cdp=cdp, how='drag')
    s = state(page)
    check(f'[{mode}] journey: 280 điểm, huy hiệu explorer + master', s['points'] == 280 and 'explorer' in s['badges'] and 'master' in s['badges'], s['points'])
    goto(page, base, 'journey/finale', 700)
    check(f'[{mode}] tranh vòng đời mở khi đủ mảnh', page.locator('.jr-finale').count() == 1)
    goto(page, base, 'journey', 500)
    check(f'[{mode}] bản đồ có nút Xem bức tranh', page.locator('.jr-see').count() == 1)
    # chơi lại một chặng: không cộng, không mất mảnh
    before = pts(page)
    play_journey_one(page, base, mode, 3)
    check(f'[{mode}] journey làm lại chặng 3 không cộng', pts(page) == before, pts(page))

    # còn nguyên sau tải lại
    before_state = state(page)
    page.reload(); page.wait_for_timeout(600)
    shown = page.locator('#pointsVal').inner_text()
    check(f'[{mode}] tải lại: điểm & huy hiệu còn nguyên', state(page)['points'] == before_state['points'] and shown == str(before_state['points'])
          and len(state(page)['badges']) == len(before_state['badges']), shown)
    # Làm lại từ đầu
    goto(page, base, 'passport', 500)
    page.locator('.pp-name, #pp-name').fill('Bạn Thử')
    page.locator('.pp-reset').click()
    page.wait_for_timeout(250)
    page.locator('.pp-confirm-btns .btn', has_text='Giữ lại').click()
    page.wait_for_timeout(200)
    check(f'[{mode}] "Giữ lại" không xoá gì', pts(page) == before_state['points'])
    page.locator('.pp-reset').click()
    page.wait_for_timeout(250)
    page.locator('.pp-danger').click()
    page.wait_for_timeout(350)
    s = state(page)
    check(f'[{mode}] Làm lại từ đầu xoá sạch', s['points'] == 0 and not s['badges'] and not s['activities'] and not any(s['journey'])
          and not s['journeyDone'] and s['profile']['name'] == '' and not s['codesViewed'], json.dumps(s)[:160])
    check(f'[{mode}] chip điểm về 0', page.locator('#pointsVal').inner_text() == '0')
    page.reload(); page.wait_for_timeout(500)
    check(f'[{mode}] sau reset + tải lại vẫn sạch', pts(page) == 0 and page.locator('#pp-name').input_value() == '')
    all_logs.extend(log.items)
    check(f'[{mode}] không lỗi console suốt phiên chơi', not log.items, log.items[:3])
    ctx.close()


def play_journey_one(page, base, mode, sid):
    j = data(page, 'journey')
    s = j['stages'][sid - 1]
    goto(page, base, f'journey/{sid}', 450)
    while page.locator('.jr-nav .btn', has_text='Nhiệm vụ').count() == 0:
        tap(page, page.locator('.jr-nav .btn').last, mode)
        page.wait_for_timeout(70)
    tap(page, page.locator('.jr-nav .btn', has_text='Nhiệm vụ'), mode)
    page.wait_for_timeout(250)
    solve_order(page, s['task']['config']['items'], mode)
    page.locator('.jr-reward').wait_for(timeout=4000)


def t_points_extra(b, base):
    # Bốn con đường huy hiệu độc lập + các trường hợp biên
    ctx = new_ctx(b, '360x740')
    page = ctx.new_page()
    goto(page, base, 'journey/1', 450)
    mode = 'touch'
    j = data(page, 'journey')
    s = j['stages'][0]
    while page.locator('.jr-nav .btn', has_text='Nhiệm vụ').count() == 0:
        tap(page, page.locator('.jr-nav .btn').last, mode); page.wait_for_timeout(60)
    tap(page, page.locator('.jr-nav .btn', has_text='Nhiệm vụ'), mode)
    solve_quiz(page, s['task']['config']['questions'], mode)
    page.locator('.jr-reward').wait_for()
    # rời màn khi mảnh đang bay: theo mã nguồn vẫn nhận
    page.evaluate("location.hash='#/journey'")
    page.wait_for_timeout(500)
    st = state(page)
    check('journey: rời màn lúc mảnh đang bay vẫn nhận mảnh', st['journey'][0] is True, st['journey'])
    check('journey: mảnh đầu tiên mở huy hiệu beginner', 'beginner' in st['badges'])
    check('journey: 1 chặng chưa cộng điểm', st['points'] == 0, st['points'])
    # tải lại giữa lúc mảnh bay
    goto(page, base, 'journey/2', 450)
    ctx.close()

    # Tải lại giữa chừng: tải lại ngay sau khi xong nhiệm vụ thì mất mảnh?
    ctx = new_ctx(b, '360x740')
    page = ctx.new_page()
    goto(page, base, 'journey/1', 450)
    while page.locator('.jr-nav .btn', has_text='Nhiệm vụ').count() == 0:
        tap(page, page.locator('.jr-nav .btn').last, mode); page.wait_for_timeout(60)
    tap(page, page.locator('.jr-nav .btn', has_text='Nhiệm vụ'), mode)
    solve_quiz(page, s['task']['config']['questions'], mode)
    page.locator('.jr-reward').wait_for()
    page.reload(); page.wait_for_timeout(500)
    st = state(page)
    check('journey: tải lại lúc mảnh đang bay không mất công (mảnh đã ghi)', bool(st) and st['journey'][0] is True, (st or {}).get('journey'))
    ctx.close()

    # dữ liệu hỏng trong localStorage
    for raw, label in [('{hỏng', 'JSON hỏng'), ('null', 'null'), ('{"journey":5,"points":"a"}', 'sai kiểu'), ('[]', 'mảng')]:
        ctx = new_ctx(b, '360x740')
        page = ctx.new_page()
        log = Log(page, f'corrupt {label}')
        ctx.add_init_script(f"localStorage.setItem('{KEY}', {json.dumps(raw)})")
        goto(page, base, 'passport', 600)
        ok = page.locator('.pp-main').count() == 1 and not log.items
        check(f'store: chịu được localStorage {label}', ok, log.items[:1])
        ctx.close()

    # localStorage bị chặn hoàn toàn (Safari riêng tư kiểu cũ / chính sách)
    ctx = new_ctx(b, '360x740')
    ctx.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})")
    page = ctx.new_page()
    log = Log(page, 'ls-blocked')
    goto(page, base, 'play', 600)
    check('store: chạy được khi localStorage bị chặn', page.locator('.play-card').count() == 5 and not log.items, log.items[:1])
    ctx.close()

    # Hai tab cùng lúc: tab cũ ghi đè tiến độ tab mới?
    ctx = new_ctx(b, '360x740')
    a = ctx.new_page(); c = ctx.new_page()
    goto(a, base, 'play', 500); goto(c, base, 'play', 500)
    goto_sort = data(a, 'sort')
    a.evaluate("location.hash='#/play/sort'"); a.wait_for_timeout(450)
    solve_sort(a, goto_sort['items'], 'touch', 'tap')
    a.locator('.eng-result').wait_for()
    pa = pts(a)
    c.evaluate("location.hash='#/passport'"); c.wait_for_timeout(450)
    c.locator('#pp-name').fill('Tab hai')
    c.wait_for_timeout(100)
    check('store: tab thứ hai không ghi đè điểm của tab đầu', pts(c) == pa, f'trước {pa}, sau {pts(c)}')
    ctx.close()


# ---------------------------------- bàn phím chơi trọn ----------------------------------
def t_keyboard(b, base):
    ctx = new_ctx(b, '1366x768', touch=False)
    page = ctx.new_page()
    log = Log(page, 'kb')

    # Sort bằng phím: Enter trên vật → Tab tới ô → Enter
    goto(page, base, 'play/sort', 500)
    sort = data(page, 'sort')
    bins = [x['id'] for x in sort['bins']]
    by = {i['label']: i for i in sort['items']}
    page.locator('.sort-card').focus()
    done = 0
    for _ in range(12):
        label = page.locator('.sort-card .sort-card-label').inner_text().strip()
        page.locator('.sort-card').focus()
        page.keyboard.press('Enter')
        for _ in range(bins.index(by[label]['bin'])):
            page.keyboard.press('Tab')
        page.keyboard.press('Enter')
        page.wait_for_timeout(330)
        done += 1
    page.wait_for_timeout(800)
    check('kb: Sort chơi trọn bằng phím', page.locator('.eng-result').count() == 1)

    # Esc huỷ chọn
    goto(page, base, 'play/sort', 500)
    page.locator('.sort-card').focus()
    page.keyboard.press('Enter')
    page.wait_for_timeout(80)
    page.keyboard.press('Escape')
    page.wait_for_timeout(80)
    check('kb: Esc huỷ chọn vật', page.locator('.sort-card.is-picked').count() == 0)

    # Quiz bằng phím
    goto(page, base, 'play/quiz', 500)
    q = data(page, 'quiz')['questions']
    for i in range(len(q)):
        page.locator('.quiz-opt').nth(q[i]['answer']).focus()
        page.keyboard.press('Enter')
        page.wait_for_timeout(80)
        foc = page.evaluate("document.activeElement.className")
        if i == 0:
            check('kb: sau khi trả lời tiêu điểm nhảy tới nút Tiếp', 'quiz-next' in foc, foc)
        page.keyboard.press('Enter')
        page.wait_for_timeout(100)
    check('kb: Quiz chơi trọn bằng phím', page.locator('.eng-result').count() == 1)

    # Match, Puzzle bằng phím
    goto(page, base, 'play/match', 500)
    for p in data(page, 'match')['pairs']:
        page.locator('.match-cell.left').filter(has_text=p['left']['label']).focus()
        page.keyboard.press('Space')
        page.locator('.match-cell.right').filter(has_text=p['right']['label']).focus()
        page.keyboard.press('Space')
        page.wait_for_timeout(50)
    page.wait_for_timeout(1000)
    check('kb: Match chơi trọn bằng phím', page.locator('.eng-result').count() == 1)

    goto(page, base, 'play/puzzle', 500)
    for it in data(page, 'puzzle')['items']:
        page.locator('.order-card').filter(has_text=it['label']).focus()
        page.keyboard.press('Enter')
        page.wait_for_timeout(40)
    page.wait_for_timeout(100)
    foc = page.evaluate("document.activeElement.textContent")
    check('kb: Puzzle: xếp đủ thì tiêu điểm ở nút Kiểm tra', 'Kiểm tra' in foc, foc[:40])
    page.keyboard.press('Enter')
    page.wait_for_timeout(1200)
    check('kb: Puzzle chơi trọn bằng phím', page.locator('.eng-result').count() == 1)

    # Lab bằng phím (máy chạy bằng Enter)
    goto(page, base, 'lab/recycle', 500)
    lab = data(page, 'lab')
    choices = lab['steps'][0]['choices']
    for k, c in enumerate(choices):
        if c['isPet']:
            page.locator('.lab-choice').nth(k).focus()
            page.keyboard.press('Enter')
    foc = page.evaluate("document.activeElement.textContent")
    check('kb: Lab bước 1 xong thì tiêu điểm ở nút Tiếp', 'Tiếp' in foc, foc[:30])
    page.keyboard.press('Enter')
    page.wait_for_timeout(300)
    by = {c['label']: c for c in choices}
    for _ in range(len(choices)):
        label = page.locator('.sort-card .sort-card-label').inner_text().strip()
        page.locator('.sort-card').focus()
        page.keyboard.press('Enter')
        if not by[label]['isPet']:
            page.keyboard.press('Tab')
        page.keyboard.press('Enter')
        page.wait_for_timeout(320)
    page.wait_for_timeout(800)
    for _ in range(2):
        foc = page.evaluate("document.activeElement.textContent")
        page.keyboard.press('Enter')       # Tiếp
        page.wait_for_timeout(250)
        foc2 = page.evaluate("document.activeElement.className")
        page.locator('.lab-run').focus()
        page.keyboard.press('Enter')
        page.locator('.lab-nav .btn-primary').wait_for(timeout=7000)
        page.wait_for_timeout(100)
    page.keyboard.press('Enter')
    page.wait_for_timeout(250)
    page.locator('.lab-product').nth(0).focus()
    page.keyboard.press('Enter')
    page.wait_for_timeout(100)
    page.keyboard.press('Enter')
    page.wait_for_timeout(350)
    check('kb: Lab chơi trọn bằng phím', page.locator('.eng-result').count() == 1)

    # Slider
    goto(page, base, 'lab/slider', 500)
    page.locator('.lab-grip').focus()
    page.keyboard.press('End')
    v = page.locator('.lab-grip').get_attribute('aria-valuenow')
    check('kb: thanh trượt End tới cuối', float(v) == 3.0, v)
    page.keyboard.press('PageDown')
    page.keyboard.press('ArrowLeft')
    v = page.locator('.lab-grip').get_attribute('aria-valuenow')
    check('kb: thanh trượt PageDown + ←', float(v) == 1.75, v)

    # Tab có hiện viền focus?
    goto(page, base, 'home', 500)
    page.keyboard.press('Tab')
    r = page.evaluate("(()=>{const e=document.activeElement,c=getComputedStyle(e);return {t:e.className,o:c.outlineStyle,w:c.outlineWidth,s:c.boxShadow}})()")
    check('kb: phần tử nhận tiêu điểm có viền nhìn thấy', r['o'] != 'none' and r['w'] != '0px', r)

    # Tab nhảy qua hộp thoại (bẫy tiêu điểm)
    goto(page, base, 'passport', 500)
    page.locator('.pp-reset').click()
    page.wait_for_timeout(300)
    inside = []
    for _ in range(6):
        page.keyboard.press('Tab')
        inside.append(page.evaluate("!!document.activeElement.closest('.modal')"))
    check('kb: tiêu điểm không rời hộp thoại khi nhấn Tab', all(inside), inside)
    page.keyboard.press('Escape')
    page.wait_for_timeout(100)
    check('kb: Esc đóng hộp thoại, tiêu điểm trả về nút', page.locator('.modal').count() == 0 and 'pp-reset' in page.evaluate('document.activeElement.className'))

    # Đổi màn: tiêu điểm đi đâu?
    goto(page, base, 'play', 500)
    page.locator('.play-card').first.focus()
    page.keyboard.press('Enter')
    page.wait_for_timeout(500)
    tag = page.evaluate("document.activeElement.tagName + '.' + document.activeElement.className")
    check('kb: đổi màn chuyển tiêu điểm vào màn mới', 'BODY' not in tag, tag)
    all_logs.extend(log.items)
    ctx.close()


# ---------------------------------- reduced motion ----------------------------------
def t_reduced(b, base):
    ctx = new_ctx(b, '360x740', reduced_motion='reduce')
    page = ctx.new_page()
    log = Log(page, 'reduced')
    goto(page, base, 'home', 500)
    a = page.locator('.hm-strip-num').inner_text()
    page.wait_for_timeout(3200)
    check('reduced: dải biến đổi không tự chạy', page.locator('.hm-strip-num').inner_text() == a)
    n = page.evaluate("""(()=>{let bad=[];for(const e of document.querySelectorAll('*')){const c=getComputedStyle(e);
      const d=parseFloat(c.animationDuration)||0, it=c.animationIterationCount;
      if(c.animationName!=='none' && (d>0.02 || it==='infinite') && !(d<=0.02)) bad.push(e.className.baseVal||e.className)}return bad.slice(0,6)})()""")
    check('reduced: không còn animation dài', not n, n)
    play_lab(page, base, 'touch', wrong=False)
    page.locator('.eng-result').wait_for(timeout=3000)
    check('reduced: Lab máy chạy tức thì, chơi trọn được', pts(page) == 30, pts(page))
    goto(page, base, 'journey/1', 450)
    j = data(page, 'journey')
    while page.locator('.jr-nav .btn', has_text='Nhiệm vụ').count() == 0:
        tap(page, page.locator('.jr-nav .btn').last, 'touch'); page.wait_for_timeout(60)
    tap(page, page.locator('.jr-nav .btn', has_text='Nhiệm vụ'), 'touch')
    solve_quiz(page, j['stages'][0]['task']['config']['questions'], 'touch')
    page.wait_for_timeout(250)
    check('reduced: Journey nhận mảnh ngay, không bay', state(page)['journey'][0] is True)
    check('reduced: không lỗi console', not log.items, log.items[:2])
    ctx.close()



# ---------------------------------- ca biên ----------------------------------
def t_edge(b, base):
    ctx = new_ctx(b, '360x740')
    page = ctx.new_page()
    log = Log(page, 'edge')
    cdp = ctx.new_cdp_session(page)

    # thả ra ngoài ô: vật quay về, không tính sai, không kẹt bóng
    goto(page, base, 'play/sort', 500)
    card = page.locator('.sort-card')
    a = card.bounding_box()
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': a['x'] + 40, 'y': a['y'] + 40}]})
    for i in range(1, 7):
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': a['x'] + 40 + i * 8, 'y': a['y'] + 40 - i * 12}]})
        page.wait_for_timeout(16)
    during = page.locator('.eng-ghost').count()
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
    page.wait_for_timeout(350)
    check('sort: có bóng khi kéo', during == 1, during)
    check('sort: thả ra ngoài ô vật quay về, không kẹt bóng', page.locator('.eng-ghost').count() == 0 and card.count() == 1
          and page.locator('.sort-card.is-dragging').count() == 0)
    # huỷ cảm ứng giữa chừng
    a = card.bounding_box()
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': a['x'] + 40, 'y': a['y'] + 40}]})
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': a['x'] + 60, 'y': a['y'] + 90}]})
    page.wait_for_timeout(30)
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchCancel', 'touchPoints': []})
    page.wait_for_timeout(350)
    check('sort: touchcancel không kẹt', page.locator('.eng-ghost').count() == 0 and page.locator('.sort-card.is-dragging').count() == 0)
    # rời màn khi đang kéo
    a = card.bounding_box()
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': a['x'] + 40, 'y': a['y'] + 40}]})
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': a['x'] + 60, 'y': a['y'] + 90}]})
    page.evaluate("location.hash='#/play'")
    page.wait_for_timeout(450)
    check('sort: rời màn khi đang kéo không để lại bóng', page.locator('.eng-ghost').count() == 0, page.locator('.eng-ghost').count())
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})

    # sảnh Play cập nhật trạng thái
    ctx2 = new_ctx(b, '360x740', state={**FULL_STATE, 'activities': {'play:quiz': {'done': True, 'perfect': False, 'plays': 1, 'best': None}}})
    p2 = ctx2.new_page()
    goto(p2, base, 'play', 500)
    txt = p2.locator('.play-card').nth(3).inner_text()
    check('play: trò đã xong chưa đúng hết hiện +10đ', '+10đ' in txt, txt.replace('\n', ' '))
    ctx2.close()

    # Discover: tab bằng phím & giữ tab khi sang mã khác; thẻ đã xem
    goto(page, base, 'discover/pet', 500)
    page.locator('.dv-tab').first.focus()
    page.keyboard.press('ArrowRight')
    check('discover: phím → đổi tab', page.locator('.dv-panel-title').inner_text() == 'Sản phẩm thường gặp')
    page.locator('.dv-nav-next').click()
    page.wait_for_timeout(450)
    check('discover: sang mã sau giữ tab', hash_of(page) == '#/discover/hdpe' and page.locator('.dv-panel-title').inner_text() == 'Sản phẩm thường gặp')
    goto(page, base, 'discover', 500)
    check('discover: đếm đã xem 2/7', page.locator('.dv-count').inner_text() == '2/7', page.locator('.dv-count').inner_text())
    check('discover: store ghi mã đã xem', sorted(state(page)['codesViewed']) == ['hdpe', 'pet'])

    # Thẻ lật
    goto(page, base, 'discover/facts', 500)
    n0 = page.locator('.dv-flip').count()
    page.locator('.dv-flip').first.click()
    page.wait_for_timeout(50)
    check('facts: lật được', 'is-flipped' in page.locator('.dv-flip').first.get_attribute('class'))
    seen = set()
    for _ in range(6):
        for i in range(page.locator('.dv-flip').count()):
            seen.add(page.locator('.dv-back').nth(i).inner_text()[:30])
        page.locator('.dv-deal').click()
        page.wait_for_timeout(60)
    check('facts: "Đổi thẻ" đi hết 18 thẻ trong 6 lần', len(seen) >= 18, f'{len(seen)} thẻ, mỗi lần {n0}')

    # Tên độc hại / tên toàn khoảng trắng
    goto(page, base, 'passport', 500)
    page.locator('#pp-name').fill('<img src=x onerror=a=1>')
    goto(page, base, 'home', 500)
    check('passport: tên có thẻ HTML được esc ở Home', page.locator('.hm-bubble img').count() == 0)
    goto(page, base, 'passport', 500)
    page.locator('#pp-name').fill('     ')
    goto(page, base, 'home', 500)
    check('passport: tên toàn khoảng trắng coi như chưa đặt', 'Xin chào' in page.locator('.hm-bubble').inner_text(), page.locator('.hm-bubble').inner_text()[:40])
    goto(page, base, 'passport', 500)
    check('passport: maxlength 24', page.locator('#pp-name').get_attribute('maxlength') == '24')
    page.locator('#pp-name').fill('')
    # Đổi avatar lưu được
    page.locator('.pp-avatar').click()
    page.wait_for_timeout(250)
    page.locator('.pp-pick-item').nth(3).click()
    page.wait_for_timeout(250)
    av = state(page)['profile']['avatar']
    check('passport: đổi tư thế Ebi', av == 'plant', av)
    tag = page.evaluate('document.activeElement.tagName')
    check('passport: sau khi đổi avatar tiêu điểm không rơi về BODY', tag != 'BODY', tag)
    # Huy hiệu khoá: bấm xem cách mở
    page.locator('.pp-badge').first.click()
    page.wait_for_timeout(250)
    check('passport: xem cách mở huy hiệu', 'Cách mở' in page.locator('.modal').inner_text())
    page.keyboard.press('Escape')

    # Home: hover/chạm Ebi, trình chiếu, CTA
    goto(page, base, 'home', 500)
    before = page.locator('.hm-bubble').inner_text()
    page.locator('.hm-ebi').tap()
    page.wait_for_timeout(120)
    check('home: chạm Ebi đổi lời', page.locator('.hm-bubble').inner_text() != before)
    n1 = page.locator('.hm-strip-num').inner_text()
    page.wait_for_timeout(3000)
    check('home: dải biến đổi tự chạy', page.locator('.hm-strip-num').inner_text() != n1)
    page.locator('.hm-strip-pause').tap()
    n2 = page.locator('.hm-strip-num').inner_text()
    page.wait_for_timeout(3000)
    check('home: nút tạm dừng dừng hẳn', page.locator('.hm-strip-num').inner_text() == n2)
    page.locator('.hm-cta .btn-primary').tap()
    page.wait_for_timeout(400)
    check('home: BẮT ĐẦU KHÁM PHÁ', hash_of(page) == '#/journey', hash_of(page))

    # Bản đồ Home: 6 điểm đi đúng khu
    for k, z in enumerate(['discover', 'journey', 'lab', 'play', 'passport', 'connect']):
        goto(page, base, 'home/map', 450)
        page.locator('.hm-place').nth(k).tap()
        page.wait_for_timeout(300)
        check(f'home/map: thẻ {z}', hash_of(page) == f'#/{z}', hash_of(page))
    goto(page, base, 'home/map', 450)
    page.locator('.hm-stats').tap()
    page.wait_for_timeout(300)
    check('home/map: số liệu tới connect/stats', hash_of(page) == '#/connect/stats', hash_of(page))
    # Số liệu null = Đang cập nhật, không số 0
    txt = page.locator('.cn-table').inner_text()
    check('connect: số liệu chưa có hiện "Đang cập nhật"', txt.count('Đang cập nhật') == 7 and ' 0 ' not in txt, txt.count('Đang cập nhật'))
    check('connect: không hiện mục Ảnh/Đối tác khi tắt', page.locator('.cn-seg-item').count() == 2)

    # Thanh trượt: kéo bằng cảm ứng
    goto(page, base, 'lab/slider', 500)
    tr = page.locator('.lab-track').bounding_box()
    y = tr['y'] + tr['height'] / 2
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': tr['x'] + 2, 'y': y}]})
    for i in range(1, 11):
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': tr['x'] + tr['width'] * i / 10, 'y': y}]})
        page.wait_for_timeout(16)
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
    page.wait_for_timeout(200)
    v = float(page.locator('.lab-grip').get_attribute('aria-valuenow'))
    check('lab: kéo thanh trượt bằng ngón tay tới cuối', v > 2.9, v)
    check('lab: ghi chú mô phỏng có ở thanh trượt', page.locator('.lab-note').is_visible())
    goto(page, base, 'lab', 450)
    check('lab: ghi chú mô phỏng có ở sảnh', page.locator('.lab-note').is_visible())
    all_logs.extend(log.items)
    check('edge: không lỗi console', not log.items, log.items[:3])
    ctx.close()


def t_lab_hold(b, base):
    ctx = new_ctx(b, '360x740')
    page = ctx.new_page()
    cdp = ctx.new_cdp_session(page)
    goto(page, base, 'lab/recycle', 450)
    lab = data(page, 'lab')
    choices = lab['steps'][0]['choices']
    for k, c in enumerate(choices):
        if c['isPet']:
            page.locator('.lab-choice').nth(k).click()
    page.locator('.lab-nav .btn').last.click()
    page.wait_for_timeout(300)
    solve_sort(page, [{'label': c['label'], 'bin': 'pet' if c['isPet'] else 'other'} for c in choices], 'touch', 'tap')
    page.wait_for_timeout(950)
    page.locator('.lab-nav .btn').last.click()
    page.wait_for_timeout(300)
    r = page.locator('.lab-run').bounding_box()
    x, y = r['x'] + r['width'] / 2, r['y'] + r['height'] / 2
    # giữ nút chạy máy rồi thả giữa chừng: máy dừng, không tự xong
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]})
    page.wait_for_timeout(900)
    mid = float(page.locator('.lab-bar').get_attribute('aria-valuenow'))
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
    page.wait_for_timeout(600)
    after = float(page.locator('.lab-bar').get_attribute('aria-valuenow'))
    check('lab: giữ nút máy chạy, thả ra dừng', 5 < mid < 60 and after - mid < 8 and page.locator('.lab-run').count() == 1, f'{mid} → {after}')
    # quay lại giữa lúc tự chạy: không lỗi, chạy lại từ đầu
    page.locator('.lab-run').click()
    page.wait_for_timeout(300)
    page.locator('.lab-nav .btn').first.click()
    page.wait_for_timeout(250)
    check('lab: lùi bước khi máy đang chạy không kẹt', page.locator('.lab-head h1').inner_text() == 'Đưa vào khu PET')
    ctx.close()


# ---------------------------------- 5. Thẻ PNG & hình nền ----------------------------------
def png_size(path):
    with open(path, 'rb') as f:
        head = f.read(24)
    assert head[:8] == b'\x89PNG\r\n\x1a\n', 'không phải PNG'
    return struct.unpack('>II', head[16:24])


def t_card(b, base):
    # Tên tiếng Việt có dấu, đủ 5 huy hiệu
    ctx = new_ctx(b, '360x740', state=FULL_STATE)
    page = ctx.new_page()
    log = Log(page, 'card')
    goto(page, base, 'passport/card', 500)
    page.locator('.pp-card-btns .btn-primary:not([disabled])').wait_for(timeout=8000)
    page.wait_for_timeout(800)
    with page.expect_download(timeout=6000) as dl:
        page.locator('.pp-card-btns .btn-primary').click()
    p = os.path.join(DL, 'card-full.png')
    dl.value.save_as(p)
    size = png_size(p)
    check('card: tải PNG 1080×1350', size == (1080, 1350), size)
    check('card: tên tệp .png', dl.value.suggested_filename.endswith('.png'), dl.value.suggested_filename)
    fonts = page.evaluate("[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight+' '+f.unicodeRange.slice(0,14)).slice(0,20)")
    check('card: font tiếng Việt đã nạp', any('Baloo' in f for f in fonts) and any('Vietnam' in f for f in fonts), len(fonts))
    # Web Share: nút hiện khi canShare có
    share = page.locator('.pp-card-btns .btn-sun')
    print('   canShare trong headless:', page.evaluate("!!navigator.canShare"), 'nút hiện:', share.is_visible())
    ctx.close()

    # Có Web Share (giả lập điện thoại): gọi navigator.share với tệp PNG
    ctx = new_ctx(b, '360x740', state=FULL_STATE)
    ctx.add_init_script("""navigator.canShare=(d)=>!!(d&&d.files&&d.files.length);
      navigator.share=(d)=>{window.__shared={n:d.files.length,type:d.files[0].type,name:d.files[0].name,size:d.files[0].size};return Promise.resolve()};""")
    page = ctx.new_page()
    goto(page, base, 'passport/card', 500)
    share = page.locator('.pp-card-btns .btn-sun')
    share.wait_for(state='visible', timeout=8000)
    share.click()
    page.wait_for_timeout(200)
    shared = page.evaluate('window.__shared')
    check('card: Web Share gửi thẳng tệp PNG', bool(shared) and shared['type'] == 'image/png' and shared['n'] == 1, shared)
    ctx.close()

    # Tên 24 ký tự, chữ rộng + emoji; không huy hiệu
    long_state = {**FULL_STATE, 'profile': {'name': 'WWWWWWWWWWWWWWWWWWWWWWWW', 'avatar': 'plant'}}
    ctx = new_ctx(b, '1366x768', state=long_state)
    page = ctx.new_page()
    goto(page, base, 'passport/card', 500)
    page.locator('.pp-card-btns .btn-primary:not([disabled])').wait_for(timeout=8000)
    with page.expect_download(timeout=6000) as dl:
        page.locator('.pp-card-btns .btn-primary').click()
    dl.value.save_as(os.path.join(DL, 'card-longname.png'))
    ctx.close()

    fresh_ctx = new_ctx(b, '360x740')
    page = fresh_ctx.new_page()
    goto(page, base, 'passport/card', 500)
    page.locator('.pp-card-btns .btn-primary:not([disabled])').wait_for(timeout=8000)
    with page.expect_download(timeout=6000) as dl:
        page.locator('.pp-card-btns .btn-primary').click()
    dl.value.save_as(os.path.join(DL, 'card-empty.png'))
    fresh_ctx.close()

    # Hình nền
    ctx = new_ctx(b, '360x740', state=FULL_STATE)
    page = ctx.new_page()
    log2 = Log(page, 'walls')
    goto(page, base, 'passport/wallpapers', 800)
    for k in range(3):
        page.locator('.pp-wall-opt').nth(k).click()
        page.wait_for_timeout(500)
        with page.expect_download(timeout=8000) as dl:
            page.locator('.pp-wall-btn').click()
        p = os.path.join(DL, f'wall-{k}.png')
        dl.value.save_as(p)
        size = png_size(p)
        check(f'wall {k}: PNG 1080×1920', size == (1080, 1920), size)
    ctx.close()

    # Khoá hình nền theo điểm
    for points, opened in [(0, 0), (49, 0), (50, 1), (119, 1), (120, 2), (299, 2), (300, 3)]:
        ctx = new_ctx(b, '360x740', state={**FULL_STATE, 'points': points})
        page = ctx.new_page()
        goto(page, base, 'passport/wallpapers', 500)
        n = page.locator('.pp-wall-opt:not(.is-locked)').count()
        check(f'wall: {points} điểm mở {opened}', n == opened, n)
        ctx.close()

    # Mất mạng (không font): vẫn tải được thẻ?
    ctx = new_ctx(b, '360x740', state=FULL_STATE)
    ctx.route('**/fonts.g*/**', lambda r: r.abort())
    page = ctx.new_page()
    goto(page, base, 'passport/card', 400)
    t0 = time.time()
    page.locator('.pp-card-btns .btn-primary:not([disabled])').wait_for(timeout=9000)
    check('card: font lỗi vẫn vẽ được thẻ', True, f'{time.time() - t0:.1f}s')
    with page.expect_download(timeout=6000) as dl:
        page.locator('.pp-card-btns .btn-primary').click()
    dl.value.save_as(os.path.join(DL, 'card-nofont.png'))
    ctx.close()
    all_logs.extend(log.items + log2.items)


def main():
    want = sys.argv[1:] or ['nav', 'play', 'points', 'kb', 'reduced', 'edge', 'card']
    with server() as base, browser() as b:
        if 'nav' in want:
            guarded('nav', lambda: t_nav(b, base))
        if 'play' in want:
            guarded('play touch', lambda: run_all_games(b, base, '360x740', 'touch'))
            if 'touch-only' not in want:
                guarded('play mouse', lambda: run_all_games(b, base, '1366x768', 'mouse'))
        if 'points' in want:
            guarded('points', lambda: t_points_extra(b, base))
        if 'kb' in want:
            guarded('kb', lambda: t_keyboard(b, base))
        if 'reduced' in want:
            guarded('reduced', lambda: t_reduced(b, base))
        if 'edge' in want:
            guarded('edge', lambda: t_edge(b, base))
            guarded('lab hold', lambda: t_lab_hold(b, base))
        if 'card' in want:
            guarded('card', lambda: t_card(b, base))
    fails = [r for r in results if not r['ok']]
    with open(os.path.join(SHOTS, f'behaviour-{"-".join(want)}.json'), 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=1)
    print(f'\n{len(results) - len(fails)}/{len(results)} PASS')
    for r in fails:
        print('FAIL', r['name'], r['detail'])
    print('\nLOG:', *sorted(set(all_logs)), sep='\n  ')


if __name__ == '__main__':
    main()
