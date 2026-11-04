"""Tách nền kem + thêm viền sticker trắng cho ảnh minh hoạ ECObit.
Dùng: python3 scripts/sticker.py raw/ public/img/
"""
import sys, glob, os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

TOL = 34          # độ lệch màu so với nền
BORDER = 12       # độ dày viền sticker (px, trên ảnh gốc 1024)
MAXW = 720

def process(path, out_dir):
    im = Image.open(path).convert('RGB')
    a = np.asarray(im).astype(np.int16)
    h, w, _ = a.shape
    edge = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    bg = np.median(edge, axis=0)
    dist = np.sqrt(((a - bg) ** 2).sum(-1))
    bgmask = dist < TOL
    # xoá watermark góc phải dưới
    bgmask[int(h*0.80):, int(w*0.86):] = True
    # đóng các khe hở nhỏ của nét viền để nền không tràn vào trong
    fg_lines = ~bgmask
    fg_lines = ndi.binary_closing(fg_lines, iterations=2)
    lab, n = ndi.label(~fg_lines)
    border_labels = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    outside = np.isin(lab, list(border_labels))
    subject = ~outside
    subject = ndi.binary_fill_holes(subject)
    # bỏ đốm nhỏ lẻ
    lab2, n2 = ndi.label(subject)
    if n2 > 1:
        sizes = ndi.sum(subject, lab2, range(1, n2 + 1))
        keep = np.isin(lab2, [i + 1 for i, s in enumerate(sizes) if s > 400])
        subject = keep
    alpha = Image.fromarray((subject * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    # viền sticker
    dil = ndi.binary_dilation(subject, iterations=BORDER)
    dil = ndi.binary_fill_holes(dil)
    ring = Image.fromarray((dil * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    rgba = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    white = Image.new('RGBA', (w, h), (255, 253, 247, 255))
    rgba.paste(white, (0, 0), ring)
    subj = im.convert('RGBA'); subj.putalpha(alpha)
    rgba = Image.alpha_composite(rgba, subj)
    bbox = rgba.getbbox()
    rgba = rgba.crop((max(bbox[0]-4,0), max(bbox[1]-4,0), min(bbox[2]+4,w), min(bbox[3]+4,h)))
    if rgba.width > MAXW:
        rgba = rgba.resize((MAXW, round(rgba.height * MAXW / rgba.width)), Image.LANCZOS)
    name = os.path.splitext(os.path.basename(path))[0]
    rgba.save(os.path.join(out_dir, name + '.webp'), 'WEBP', quality=88, method=6)
    rgba.save(os.path.join(out_dir, name + '.png'), optimize=True)
    return name, rgba.size

if __name__ == '__main__':
    src, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    for f in sorted(glob.glob(os.path.join(src, '*.png'))):
        print(process(f, out))
