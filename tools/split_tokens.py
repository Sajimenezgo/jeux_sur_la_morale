"""Recorta las 6 fichas del atlas exportado desde VectorCraft (3x2, celdas de 512) a PNG (alfa) y SVG individuales."""
import re, sys, xml.etree.ElementTree as ET
from PIL import Image

src_png, src_svg, out_dir = sys.argv[1:4]
CHARS = [("scientist","sci_"),("mlengineer","ml_"),("statistician","st_"),
         ("analyst","an_"),("engineer","en_"),("auditor","au_")]
# nombres de las piezas sin prefijo en el SVG (formas del ícono): se asignan por rango de celda
im = Image.open(src_png).convert("RGBA")
ET.register_namespace("", "http://www.w3.org/2000/svg")
ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")
for i,(cid,_) in enumerate(CHARS):
    col,row = i%3, i//3
    x0,y0 = col*512+12, row*512+12
    im.crop((x0,y0,x0+488,y0+488)).save(f"{out_dir}/token_{cid}.png", optimize=True)
    # SVG: conserva solo elementos cuyo bbox aproximado cae en la celda -> más simple: viewBox sobre el atlas completo
    tree = ET.parse(src_svg); root = tree.getroot()
    root.set("viewBox", f"{x0} {y0} 488 488"); root.set("width","488"); root.set("height","488")
    tree.write(f"{out_dir}/portrait_{cid}.svg", xml_declaration=True, encoding="utf-8")
print("ok")
