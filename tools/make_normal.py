"""Deriva mapa de normales (tangent-space, OpenGL +Y) y variante alterna desde el albedo del tile."""
import sys
import numpy as np
from PIL import Image, ImageFilter

src, out_normal, out_alt = sys.argv[1:4]
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.float32) / 255.0
lum = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2])
h = np.asarray(Image.fromarray((lum * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.6))).astype(np.float32) / 255.0
strength = 5.0
dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * strength
dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * strength
n = np.stack([-dx, dy, np.ones_like(h)], -1)  # +Y hacia arriba (convención OpenGL/Three)
n /= np.linalg.norm(n, axis=-1, keepdims=True)
Image.fromarray(((n * 0.5 + 0.5) * 255).astype(np.uint8)).save(out_normal)

# Variante alterna: más clara y ligeramente más fría, para ajedrezado sutil de casillas
alt = a * 0.78 + np.array([0.10, 0.17, 0.33], np.float32) * 0.22
alt = np.clip(alt * 1.12, 0, 1)
Image.fromarray((alt * 255).astype(np.uint8)).save(out_alt)
print("ok")
