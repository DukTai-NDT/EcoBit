"""(Đặt biến CHROME_PATH nếu muốn dùng Chrome có sẵn thay vì Chromium của Playwright.)
Chụp màn hình các route ở mobile & desktop bằng Chrome headless.
Dùng: python3 scripts/qa_screens.py [route ...]   (mặc định: 7 khu)
Kết quả: qa-shots/<viewport>-<route>.png + in lỗi console.
"""
import sys, os, subprocess, time, socket
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'qa-shots')
os.makedirs(OUT, exist_ok=True)
routes = sys.argv[1:] or ['home', 'discover', 'journey', 'lab', 'play', 'passport', 'connect']
VIEWS = {'m': (360, 740), 'd': (1366, 768)}

def free_port():
    s = socket.socket(); s.bind(('127.0.0.1', 0)); p = s.getsockname()[1]; s.close(); return p

port = free_port()
srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(port), '--bind', '127.0.0.1'], cwd=ROOT,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(0.8)
errors = []
try:
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get('CHROME_PATH') or None, args=['--no-sandbox'])
        for vk, (w, hgt) in VIEWS.items():
            ctx = b.new_context(viewport={'width': w, 'height': hgt}, device_scale_factor=1, has_touch=(vk == 'm'))
            page = ctx.new_page()
            page.on('console', lambda m: errors.append(f'[{vk}] console.{m.type}: {m.text}') if m.type in ('error', 'warning') and 'TUNNEL' not in m.text else None)
            page.on('pageerror', lambda e: errors.append(f'[{vk}] pageerror: {e}'))
            for r in routes:
                page.goto(f'http://127.0.0.1:{port}/index.html#/{r}')
                page.wait_for_timeout(900)
                name = r.replace('/', '_')
                page.screenshot(path=os.path.join(OUT, f'{vk}-{name}.png'))
            ctx.close()
        b.close()
finally:
    srv.terminate()
print('\n'.join(errors) if errors else 'Không có lỗi console.')
print('Ảnh:', OUT)
