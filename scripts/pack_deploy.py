"""Đóng gói bản deploy sạch vào deploy/ecobit-hub/ (+ deploy/ecobit-hub.zip). Chỉ dùng thư viện chuẩn.

Dùng:
  python3 scripts/pack_deploy.py            # bản xem trước (mặc định): chặn máy tìm kiếm
  python3 scripts/pack_deploy.py --release  # bản phát hành chính thức: không chặn
Sau đó kéo thả thư mục deploy/ecobit-hub/ lên https://app.netlify.com/drop.

Chép theo danh sách cho phép, rồi tự kiểm: không lọt thư mục nội bộ, mọi import/CSS/ảnh trỏ tới file có thật.
"""
import argparse
import fnmatch
import os
import re
import shutil
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'deploy')
PKG = os.path.join(OUT_DIR, 'ecobit-hub')
ZIP = os.path.join(OUT_DIR, 'ecobit-hub.zip')

ALLOW_FILES = ['index.html', 'netlify.toml']
ALLOW_DIRS = ['src', 'public']
ALLOW_ROOT_GLOBS = ['*.ico', '*.webmanifest', 'robots.txt']
# Không bao giờ chép, kể cả khi nằm trong src/ hay public/.
SKIP_NAMES = {'__pycache__', '.DS_Store', 'Thumbs.db', 'desktop.ini'}
SKIP_GLOBS = ['.git*', '*.pyc', '*.md']
# Đường dẫn cấm trong gói (tự kiểm).
BANNED_PARTS = ('raw', 'docs', 'scripts', 'qa-shots', '.claude', '__pycache__')
BANNED_NAMES = ('CLAUDE.md', 'README.md', 'package.json')

ROBOTS_META = '<meta name="robots" content="noindex, nofollow">'
ROBOTS_TXT = 'User-agent: *\nDisallow: /\n'


def skip(name):
    return name in SKIP_NAMES or any(fnmatch.fnmatch(name, g) for g in SKIP_GLOBS)


def copy_allowed():
    if os.path.isdir(PKG):
        shutil.rmtree(PKG)
    if os.path.exists(ZIP):
        os.remove(ZIP)
    os.makedirs(PKG)
    for f in ALLOW_FILES:
        shutil.copy2(os.path.join(ROOT, f), os.path.join(PKG, f))
    for f in sorted(os.listdir(ROOT)):
        if os.path.isfile(os.path.join(ROOT, f)) and any(fnmatch.fnmatch(f, g) for g in ALLOW_ROOT_GLOBS):
            shutil.copy2(os.path.join(ROOT, f), os.path.join(PKG, f))
    for d in ALLOW_DIRS:
        shutil.copytree(os.path.join(ROOT, d), os.path.join(PKG, d),
                        ignore=lambda _dir, names: [n for n in names if skip(n)])


def mark_preview():
    """Chỉ sửa bản chép: chèn meta robots và robots.txt chặn toàn bộ."""
    p = os.path.join(PKG, 'index.html')
    with open(p, encoding='utf-8') as fh:
        html = fh.read()
    if ROBOTS_META not in html:
        m = re.search(r'<meta charset[^>]*>', html, re.I) or re.search(r'<head[^>]*>', html, re.I)
        if not m:
            sys.exit('Không tìm thấy <head> trong index.html')
        html = html[:m.end()] + '\n  ' + ROBOTS_META + html[m.end():]
    with open(p, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(html)
    with open(os.path.join(PKG, 'robots.txt'), 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(ROBOTS_TXT)


def list_files():
    out = []
    for dp, _dn, fn in os.walk(PKG):
        for f in fn:
            full = os.path.join(dp, f)
            out.append((os.path.relpath(full, PKG).replace(os.sep, '/'), os.path.getsize(full)))
    return sorted(out)


def make_zip(files):
    with zipfile.ZipFile(ZIP, 'w', zipfile.ZIP_DEFLATED) as z:
        for rel, _ in files:
            z.write(os.path.join(PKG, rel), rel)   # index.html nằm ở gốc zip


def strip_comments(text):
    """Bỏ dòng chú thích (//, /* */) để ví dụ trong chú thích không bị coi là tham chiếu."""
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
    return '\n'.join(l for l in text.splitlines() if not l.lstrip().startswith('//'))


def check_refs(files):
    """Trả về (lỗi, cảnh báo). Mọi đường dẫn web tính từ gốc gói (trang chạy ở /index.html)."""
    have = {rel for rel, _ in files}
    errors, warns = [], []

    def need(path, where):
        path = os.path.normpath(path).replace(os.sep, '/')
        if path not in have:
            errors.append(f'{where}: thiếu {path}')

    with open(os.path.join(PKG, 'index.html'), encoding='utf-8') as fh:
        html = fh.read()
    for ref in re.findall(r'(?:src|href|content)="([^"#:]+\.(?:js|css|webp|png|svg|ico|webmanifest))"', html):
        need(ref, 'index.html')

    img_names, dyn = set(), set()
    for rel in sorted(have):
        if not rel.endswith(('.js', '.css')):
            continue
        with open(os.path.join(PKG, rel), encoding='utf-8') as fh:
            code = strip_comments(fh.read())
        base = os.path.dirname(rel)
        if rel.endswith('.js'):
            for spec in re.findall(r'''(?:\bimport\s*(?:[^'"()]*?\bfrom\s*)?|\bexport\s+[^'"]*?\bfrom\s*|\bimport\s*\(\s*)['"]([^'"]+)['"]''', code):
                if spec.startswith('.'):
                    need(os.path.join(base, spec), rel)
                elif spec.startswith('/'):
                    need(spec.lstrip('/'), rel)
                else:
                    errors.append(f'{rel}: import không phải đường dẫn tương đối: {spec}')
            for p in re.findall(r'''\bcss\(\s*['"]([^'"]+)['"]''', code):
                need('src/styles/' + p, rel)
            img_names.update(re.findall(r'''\b(?:img|imgUrl)\(\s*['"]([^'"]+)['"]''', code))
            img_names.update(re.findall(r'''\bimg\s*:\s*['"]([^'"]+)['"]''', code))
            for p in re.findall(r'''['"`](public/img/[^'"`$]+\.(?:webp|png|svg))['"`]''', code):
                need(p, rel)
            for pre in re.findall(r'''\b(?:img|imgUrl)\(\s*`([^`$]*)\$\{''', code):
                dyn.add(('public/img/' + pre, rel))
            for pre in re.findall(r'''`(public/img/[^`$]*)\$\{''', code):
                dyn.add((pre, rel))
        else:
            for u in re.findall(r'''url\(\s*['"]?([^'")]+)['"]?\s*\)''', code):
                if not u.startswith(('data:', 'http:', 'https:', '#')):
                    need(os.path.join(base, u), rel)
            for u in re.findall(r'''@import\s+['"]([^'"]+)['"]''', code):
                need(os.path.join(base, u), rel)
    for n in sorted(img_names):
        need(f'public/img/{n}.webp', 'ảnh')
    # Tên ảnh ghép động (VD loc-${id}): chỉ kiểm được là có ít nhất một file khớp; qa_screens bắt 404 thật.
    for pre, rel in sorted(dyn):
        if not any(h.startswith(pre) for h in have):
            warns.append(f'{rel}: ảnh ghép động "{pre}…" chưa có file nào (chỉ lỗi nếu nhánh này được bật)')
    return errors, warns, len(img_names)


def check_banned(paths):
    bad = []
    for rel in paths:
        parts = rel.split('/')
        if any(p in BANNED_PARTS for p in parts[:-1]) or parts[-1] in BANNED_NAMES or parts[0].startswith('.git'):
            bad.append(rel)
    return bad


def human(n):
    return f'{n / 1024 / 1024:.2f} MB' if n >= 1024 * 1024 else f'{n / 1024:.1f} KB'


def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    g = ap.add_mutually_exclusive_group()
    g.add_argument('--preview', dest='preview', action='store_true', default=True, help='bản xem trước, chặn index (mặc định)')
    g.add_argument('--release', dest='preview', action='store_false', help='bản phát hành, không chặn index')
    args = ap.parse_args()

    copy_allowed()
    if args.preview:
        mark_preview()
    files = list_files()
    make_zip(files)

    total = sum(s for _, s in files)
    print(f'Gói: {os.path.relpath(PKG, ROOT)}  ({"xem trước – noindex" if args.preview else "phát hành"})')
    print(f'{len(files)} file · {human(total)} · zip {human(os.path.getsize(ZIP))}')
    print('5 file lớn nhất:')
    for rel, s in sorted(files, key=lambda x: -x[1])[:5]:
        print(f'  {human(s):>10}  {rel}')

    with zipfile.ZipFile(ZIP) as z:
        zipped = z.namelist()
    bad = check_banned([r for r, _ in files] + zipped)
    errors, warns, n_img = check_refs(files)
    if args.preview:
        with open(os.path.join(PKG, 'index.html'), encoding='utf-8') as fh:
            if ROBOTS_META not in fh.read():
                errors.append('index.html thiếu meta robots noindex')
    print('Tự kiểm:')
    print(f'  thư mục nội bộ trong gói: {len(bad)}' + (' – ' + ', '.join(bad[:10]) if bad else ''))
    print(f'  tham chiếu hỏng: {len(errors)} (đã soát {n_img} tên ảnh, import, CSS)')
    for e in errors:
        print('   ✗', e)
    for w in warns:
        print('   ! ', w)
    if bad or errors:
        sys.exit(1)
    print('OK')


if __name__ == '__main__':
    main()
