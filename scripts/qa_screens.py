"""Chụp và đo bố cục mọi route ở 6 khung nhìn (M6, mục 2).

Dùng:
  python3 scripts/qa_screens.py                 # mọi route, 6 khung nhìn + các trạng thái giữa chừng
  python3 scripts/qa_screens.py play/quiz home  # chỉ các route này, không chạy trạng thái
Đặt CHROME_PATH nếu muốn dùng Chrome có sẵn.
Kết quả: qa-shots/<viewport>/<route>.png, qa-shots/layout.json, in các vấn đề bố cục.
Ngoài cuộn trang còn đo: chữ/nút bị cắt khỏi sân khấu, chữ bị xén, nút bị che, vùng cuộn con.
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qa_common import (EXTRA_VIEWPORTS, FULL_STATE, SHOTS, VIEWPORTS, AUDIT_JS, Log, browser, data, goto, new_ctx, problems, server,
                       solve_match, solve_order, solve_quiz, solve_sort, tap)

ROUTES = [
    'home', 'home/map', 'discover', 'discover/pet', 'discover/hdpe', 'discover/pvc', 'discover/ldpe', 'discover/pp',
    'discover/ps', 'discover/other', 'discover/identify', 'discover/facts', 'journey', 'journey/1', 'journey/2',
    'journey/3', 'journey/4', 'journey/5', 'journey/finale', 'lab', 'lab/recycle', 'lab/slider', 'play', 'play/sort',
    'play/match', 'play/puzzle', 'play/quiz', 'play/detective', 'passport', 'passport/card', 'passport/wallpapers',
    'connect', 'connect/stats',
]

results = []


def rec(page, vp, name, shot=True):
    a = page.evaluate(AUDIT_JS)
    w, hgt, _ = VIEWPORTS[vp]
    p = problems(a, hgt)
    results.append({'vp': vp, 'state': name, 'problems': p, 'raw': a})
    if shot:
        d = os.path.join(SHOTS, vp)
        os.makedirs(d, exist_ok=True)
        page.screenshot(path=os.path.join(d, name.replace('/', '_') + '.png'))


def crawl_routes(b, base, vp, routes):
    ctx = new_ctx(b, vp, state=FULL_STATE)
    page = ctx.new_page()
    log = Log(page, vp)
    for r in routes:
        goto(page, base, r, 750)
        rec(page, vp, r)
    ctx.close()
    return log.items


def crawl_states(b, base, vp):
    """Các trạng thái dài nhất: lời giải thích, tab chi tiết, thẻ lật, kết quả, phần thưởng, hộp thoại."""
    w, hgt, touch = VIEWPORTS[vp]
    mode = 'touch' if touch else 'mouse'
    ctx = new_ctx(b, vp, state={**FULL_STATE, 'journey': [False] * 5, 'journeyDone': False})
    page = ctx.new_page()
    log = Log(page, vp + ' states')

    # Discover: 7 mã × 4 tab
    for c in ['pet', 'hdpe', 'pvc', 'ldpe', 'pp', 'ps', 'other']:
        goto(page, base, f'discover/{c}', 450)
        for i in range(4):
            page.locator('.dv-tab').nth(i).click()
            page.wait_for_timeout(120)
            rec(page, vp, f's-discover-{c}-tab{i}', shot=(c in ('other', 'pp')))

    # Thẻ lật: lật mọi thẻ qua nhiều lần chia
    goto(page, base, 'discover/facts', 500)
    for round_ in range(4 if w <= 860 else 3):
        cards = page.locator('.dv-flip')
        for i in range(cards.count()):
            cards.nth(i).click()
        page.wait_for_timeout(750)
        rec(page, vp, f's-facts-{round_}', shot=(round_ == 0))
        page.locator('.dv-deal').click()
        page.wait_for_timeout(250)
    # Đoán mã: chọn từng đồ vật, trả lời sai để hiện gợi ý dài, rồi đúng để hiện đặc điểm
    goto(page, base, 'discover/identify', 500)
    codes = data(page, 'codes')
    objs = page.locator('.dv-obj')
    for i in range(objs.count()):
        objs.nth(i).click()
        label = objs.nth(i).get_attribute('aria-label').split(': ', 1)[1]
        code = next(c for c in codes if c['object'] == label)
        wrong = next(c for c in codes if c['id'] != code['id'])
        page.locator('.dv-choice').nth(codes.index(wrong)).click()
        page.wait_for_timeout(100)
        rec(page, vp, f's-identify-hint-{code["id"]}', shot=(code['id'] == 'other'))
        page.locator('.dv-choice').nth(codes.index(code)).click()
        page.wait_for_timeout(120)
        rec(page, vp, f's-identify-info-{code["id"]}', shot=(code['id'] == 'other'))
    page.locator('.dv-finish').click()
    page.wait_for_timeout(450)
    rec(page, vp, 's-identify-result')

    # Quiz & Detective: mọi câu ở trạng thái sai (khung giải thích dài nhất)
    for game, name in (('quiz', 'quiz'), ('detective', 'detective')):
        goto(page, base, f'play/{game}', 500)
        qs = data(page, name)['questions']
        for i in range(len(qs)):
            rec(page, vp, f's-{game}-q{i}', shot=(i == 0))
            bad = (qs[i]['answer'] + 1) % len(qs[i]['options'])
            page.locator('.quiz-opt').nth(bad).click()
            page.wait_for_timeout(460)
            rec(page, vp, f's-{game}-q{i}-explain', shot=(i in (0, 3)))
            page.locator('.quiz-next').click()
            page.wait_for_timeout(100)
        page.wait_for_timeout(400)
        rec(page, vp, f's-{game}-result')

    # Sort, Match, Puzzle
    goto(page, base, 'play/sort', 500)
    solve_sort(page, data(page, 'sort')['items'], mode, 'tap')
    page.wait_for_timeout(900)
    rec(page, vp, 's-sort-result')
    goto(page, base, 'play/match', 500)
    solve_match(page, data(page, 'match')['pairs'], mode)
    rec(page, vp, 's-match-done')
    page.wait_for_timeout(1000)
    rec(page, vp, 's-match-result')
    goto(page, base, 'play/puzzle', 500)
    items = data(page, 'puzzle')['items']
    for k, it in enumerate(items):
        page.locator('.order-card').filter(has_text=it['label']).click()
        if k == 2:
            page.wait_for_timeout(100)
            rec(page, vp, 's-puzzle-half')
    page.wait_for_timeout(250)
    rec(page, vp, 's-puzzle-full')
    page.locator('.order-check').click()
    page.wait_for_timeout(1300)
    rec(page, vp, 's-puzzle-result')

    # Journey: mọi lời thoại, nhiệm vụ, phần thưởng
    j = data(page, 'journey')
    for s in j['stages']:
        sid = s['id']
        goto(page, base, f'journey/{sid}', 500)
        for n in range(len(s['lines'])):
            rec(page, vp, f's-journey-{sid}-line{n}', shot=(n == 0))
            page.locator('.jr-nav .btn').last.click()
            page.wait_for_timeout(130)
        page.wait_for_timeout(250)
        rec(page, vp, f's-journey-{sid}-task')
        cfg = s['task']['config']
        eng = s['task']['engine']
        if eng == 'quiz':
            for q in cfg['questions']:
                page.locator('.quiz-opt').nth((q['answer'] + 1) % len(q['options'])).click()
                page.wait_for_timeout(420)
                rec(page, vp, f's-journey-{sid}-explain')
                page.locator('.quiz-next').click()
                page.wait_for_timeout(100)
        elif eng == 'sort':
            solve_sort(page, cfg['items'], mode, 'tap')
            page.wait_for_timeout(800)
        elif eng == 'order':
            solve_order(page, cfg['items'], mode)
            page.wait_for_timeout(1100)
        elif eng == 'match':
            solve_match(page, cfg['pairs'], mode)
            page.wait_for_timeout(1000)
        page.wait_for_timeout(350)
        rec(page, vp, f's-journey-{sid}-reward-before')
        page.wait_for_timeout(1500)
        rec(page, vp, f's-journey-{sid}-reward')

    # Lab: đủ 5 bước
    goto(page, base, 'lab/recycle', 500)
    lab = data(page, 'lab')
    choices = lab['steps'][0]['choices']
    for k, c in enumerate(choices):
        page.locator('.lab-choice').nth(k).click()
        page.wait_for_timeout(90)
        rec(page, vp, f's-lab-choose-{c["id"]}', shot=(k == 3))
    page.locator('.lab-nav .btn').last.click()
    page.wait_for_timeout(350)
    rec(page, vp, 's-lab-sort')
    solve_sort(page, [{'label': c['label'], 'bin': 'pet' if c['isPet'] else 'other'} for c in choices], mode, 'tap')
    page.wait_for_timeout(1000)
    rec(page, vp, 's-lab-sort-done')
    for st in ('wash', 'make'):
        page.locator('.lab-nav .btn').last.click()
        page.wait_for_timeout(300)
        rec(page, vp, f's-lab-{st}')
        page.locator('.lab-run').click()
        page.wait_for_timeout(5000)
        rec(page, vp, f's-lab-{st}-done')
    page.locator('.lab-nav .btn').last.click()
    page.wait_for_timeout(350)
    rec(page, vp, 's-lab-product')
    for k in range(4):
        page.locator('.lab-product').nth(k).click()
        page.wait_for_timeout(120)
        rec(page, vp, f's-lab-product-{k}', shot=(k == 0))
    page.locator('.lab-nav .btn').last.click()
    page.wait_for_timeout(500)
    rec(page, vp, 's-lab-result')

    # Slider: cả 4 khung
    goto(page, base, 'lab/slider', 500)
    page.locator('.lab-grip').focus()
    for k in range(4):
        rec(page, vp, f's-slider-{k}', shot=(k == 1))
        page.keyboard.press('PageUp')
        page.wait_for_timeout(100)

    # Passport: hộp thoại
    goto(page, base, 'passport', 500)
    page.locator('.pp-avatar').click()
    page.wait_for_timeout(450)
    d = os.path.join(SHOTS, vp)
    page.screenshot(path=os.path.join(d, 's-passport-avatar-modal.png'))
    fits = page.evaluate("(() => { const m = document.querySelector('.modal'); return { over: m.scrollHeight - m.clientHeight, h: m.getBoundingClientRect().height }; })()")
    results.append({'vp': vp, 'state': 's-passport-avatar-modal', 'problems': [f"modal cuộn +{fits['over']}"] if fits['over'] > 0 else [], 'raw': fits})
    page.keyboard.press('Escape')
    page.locator('.pp-reset').click()
    page.wait_for_timeout(400)
    page.screenshot(path=os.path.join(d, 's-passport-reset-modal.png'))
    page.keyboard.press('Escape')
    ctx.close()
    return log.items


def main():
    custom = sys.argv[1:]
    errors = []
    VIEWPORTS.update(EXTRA_VIEWPORTS)
    with server() as base, browser() as b:
        for vp in VIEWPORTS:
            print('==', vp, flush=True)
            errors += crawl_routes(b, base, vp, custom or ROUTES)
            if not custom and vp not in EXTRA_VIEWPORTS:
                try:
                    errors += crawl_states(b, base, vp)
                except Exception as e:  # ghi lại rồi chạy tiếp khung nhìn khác
                    errors.append(f'{vp} states CRASH: {str(e)[:600]}')
                    print('  CRASH', str(e)[:600], flush=True)
    with open(os.path.join(SHOTS, 'layout.json'), 'w', encoding='utf-8') as f:
        json.dump({'results': results, 'errors': sorted(set(errors))}, f, ensure_ascii=False, indent=1)
    bad = [r for r in results if r['problems']]
    print(f'\n{len(results)} trạng thái đã đo, {len(bad)} có vấn đề.')
    for r in bad:
        print(f"[{r['vp']}] {r['state']}: {' | '.join(r['problems'])}")
    print('\n'.join(sorted(set(errors))) if errors else 'Không có lỗi console.')
    print('Ảnh:', SHOTS)


if __name__ == '__main__':
    main()
