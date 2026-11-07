"""Valida tarjetas candidatas (JSON) contra el esquema y contra el texto fuente.

Uso: python3 tools/validate_cards.py CORPUS_DIR tarjetas1.json [tarjetas2.json ...]
Salida: resumen por archivo + lista de problemas. Código de salida 1 si hay errores duros.

Comprobaciones:
  - campos obligatorios y límites de longitud (pensados para leer en un celular)
  - quiz/checkpoint: 4 opciones, `correct` válido, sin opciones repetidas
  - dilemma: >= 2 posturas
  - la cita (`source.quote`) existe en el archivo fuente (se normaliza espacios, guiones de
    corte de línea, comillas y mayúsculas) -> detecta citas inventadas o mal copiadas
"""
import json, re, sys, unicodedata
from pathlib import Path

KINDS = {"quiz", "checkpoint", "dilemma", "fact"}
THEMES = {"bias_fairness", "privacy_consent", "transparency_explainability", "accountability_governance",
          "human_agency", "attention_manipulation", "scientific_integrity", "safety_security",
          "labor_climate_justice", "education", "health", "public_policy_co", "data_quality",
          "ai_alignment_rl", "military_surveillance"}
LIM = {"title_words": 5, "prompt": 260, "explanation": 240, "tip": 110, "quote_words": 25, "option": 140}


def norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.replace("­", "").replace("’", "'").replace("“", '"').replace("”", '"').replace("«", '"').replace("»", '"')
    s = re.sub(r"-\s*\n\s*", "", s)          # palabra cortada por guion al final de línea
    # Solo alfanumérico y SIN espacios: la extracción de PDFs justificados parte palabras
    # ("obsta culizando", "posibilida des"), así que los espacios no son fiables.
    return re.sub(r"[^0-9a-zA-Z]+", "", s).lower()


def check(card, corpus_dir, cache):
    errs, warns = [], []
    g = lambda k: card.get(k)
    for k in ("id", "kind", "theme", "title", "prompt", "board", "source", "tip"):
        if not g(k) and not (k == "tip" and g("kind") == "dilemma"):
            errs.append(f"falta '{k}'")
    if g("kind") not in KINDS: errs.append(f"kind inválido: {g('kind')}")
    if g("theme") not in THEMES: errs.append(f"theme fuera de taxonomía: {g('theme')}")
    if g("board") not in {"snake", "ladder", "any"}: errs.append(f"board inválido: {g('board')}")
    if g("difficulty") not in {1, 2, 3}: warns.append("difficulty debería ser 1, 2 o 3")
    if len(str(g("title") or "").split()) > LIM["title_words"]: warns.append("title > 5 palabras")
    if len(g("prompt") or "") > LIM["prompt"]: warns.append(f"prompt {len(g('prompt'))} > {LIM['prompt']}")
    if len(g("explanation") or "") > LIM["explanation"]: warns.append(f"explanation {len(g('explanation'))} > {LIM['explanation']}")
    if len(g("tip") or "") > LIM["tip"]: warns.append(f"tip {len(g('tip'))} > {LIM['tip']}")
    if g("kind") in ("quiz", "checkpoint"):
        o = g("options")
        if not isinstance(o, list) or len(o) != 4: errs.append("se requieren exactamente 4 opciones")
        else:
            if len({norm(x) for x in o}) != 4: errs.append("opciones repetidas")
            if any(len(x) > LIM["option"] for x in o): warns.append("alguna opción > 140 caracteres")
            if not isinstance(g("correct"), int) or not 0 <= g("correct") < 4: errs.append("'correct' inválido")
        if not g("explanation"): errs.append("falta explanation")
    if g("kind") == "dilemma":
        st = g("stances")
        if not isinstance(st, list) or len(st) < 2: errs.append("dilemma requiere >= 2 stances")
    src = g("source") or {}
    q = src.get("quote", "")
    if not q: errs.append("falta source.quote")
    else:
        if len(q.split()) > LIM["quote_words"]: warns.append(f"quote {len(q.split())} palabras > {LIM['quote_words']}")
        f = src.get("file", "")
        path = Path(corpus_dir) / f
        if not path.exists():
            errs.append(f"archivo fuente no existe: {f}")
        else:
            if f not in cache: cache[f] = norm(path.read_text(errors="ignore"))
            if norm(q) not in cache[f]:
                (warns if g("grounded") is False else errs).append("la cita NO aparece literalmente en la fuente")
    return errs, warns


def main():
    corpus, files = sys.argv[1], sys.argv[2:]
    cache, hard = {}, 0
    for fp in files:
        data = json.loads(Path(fp).read_text())
        by = {}
        for c in data: by[c.get("kind")] = by.get(c.get("kind"), 0) + 1
        print(f"\n== {Path(fp).name}: {len(data)} tarjetas {by}")
        ids = [c.get("id") for c in data]
        if len(set(ids)) != len(ids): print("  ERROR ids duplicados"); hard += 1
        for c in data:
            e, w = check(c, corpus, cache)
            for x in e: print(f"  ERROR {c.get('id')}: {x}"); hard += 1
            for x in w: print(f"  aviso {c.get('id')}: {x}")
    print(f"\nTotal errores duros: {hard}")
    sys.exit(1 if hard else 0)


if __name__ == "__main__":
    main()
