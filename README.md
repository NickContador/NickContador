#!/usr/bin/env python3

# -*- coding: utf-8 -*-

“””
╔══════════════════════════════════════════════════════════════════════╗
║   SISTEMA DE ALINHAMENTO 3D – COM IMPORTAÇÃO WEB                   ║
║   Fonte: https://wlmedeiros.blogspot.com                            ║
║   Versão 2025  |  Menu interativo + Scraper integrado              ║
╚══════════════════════════════════════════════════════════════════════╝
Dependências:
pip install requests beautifulsoup4 openpyxl
“””

import os, sys, re, json, csv, time
from collections import defaultdict

# ── Imports opcionais ────────────────────────────────────────────────────────

try:
import requests
from bs4 import BeautifulSoup
SCRAPER_OK = True
except ImportError:
SCRAPER_OK = False

try:
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
EXCEL_OK = True
except ImportError:
EXCEL_OK = False

# ══════════════════════════════════════════════════════════════════════════════

# SCRAPER – wlmedeiros.blogspot.com

# ══════════════════════════════════════════════════════════════════════════════

BASE_URL   = “https://wlmedeiros.blogspot.com”
HEADERS    = {“User-Agent”: “Mozilla/5.0 (compatible; AlinhamentoBot/1.0)”}
CACHE_FILE = “wlmedeiros_cache.json”

def _dms_para_grau(texto: str) -> float | None:
“”“Converte ‘-0º30’ ou ‘+4º17’ para float em graus decimais.”””
texto = texto.strip().replace(“º”, “°”)
m = re.match(r”([+-]?\d+)°(\d+)?”, texto)
if not m:
return None
graus = int(m.group(1))
mins  = int(m.group(2)) if m.group(2) else 0
sinal = -1 if texto.strip().startswith(”-”) else 1
return round(graus + sinal * mins / 60, 4)

def _parse_conv(texto: str) -> float | None:
“”“Extrai valor numérico de convergência: ‘+0,71’ → 0.71”””
texto = texto.strip().replace(”,”, “.”)
m = re.match(r”([+-]?\d+.?\d*)”, texto)
return float(m.group(1)) if m else None

def _extrair_dados_post(url: str) -> dict | None:
“”“Faz GET em um post e extrai tabela de alinhamento.”””
try:
r = requests.get(url, headers=HEADERS, timeout=15)
r.raise_for_status()
except Exception as e:
print(f”    ⚠  Erro ao acessar {url}: {e}”)
return None

```
soup = BeautifulSoup(r.text, "html.parser")

# Título do post
h3 = soup.find("h3", class_="post-title")
titulo = h3.get_text(strip=True) if h3 else ""

# Texto completo do post
entry = soup.find("div", class_="entry-content") or soup.find("div", class_="post-body")
if not entry:
    return None
texto = entry.get_text("\n")

# Ano e Aro
ano  = re.search(r"Ano[:\s]+(\d{4})", texto)
aro  = re.search(r"Aro[:\s]+(\d+)",  texto)
ano  = ano.group(1)  if ano  else "N/D"
aro  = aro.group(1)  if aro  else "N/D"

def extrair_bloco(secao: str) -> dict:
    """Extrai Converg, Câmber, Cáster de um bloco DIANTEIRA ou TRASEIRA."""
    pat = rf"{secao}:(.*?)(?=DIANTEIRA:|TRASEIRA:|CONVERGÊNCIAS EM GRAUS|$)"
    m = re.search(pat, texto, re.S | re.I)
    if not m:
        return {}
    bloco = m.group(1)

    dados = {}

    # Convergência mm
    mc = re.search(r"Converg\.[:\s]*([+-]?\d+[,.]?\d*)\s*\(\+-\)\s*([0-9,\.]+)", bloco)
    if mc:
        dados["conv_mm_nom"] = _parse_conv(mc.group(1))
        dados["conv_mm_tol"] = _parse_conv(mc.group(2))

    # Câmber
    mb = re.search(r"Câmber\s*[:\s]*([+-]?\d+º\d*)\s*\(\+-\)\s*(\d+º\d*)", bloco)
    if mb:
        dados["camber_nom"] = _dms_para_grau(mb.group(1))
        dados["camber_tol"] = _dms_para_grau(mb.group(2))

    # Cáster
    mca = re.search(r"Cáster\s*[:\s]*([+-]?\d+º\d*)\s*\(\+-\)\s*(\d+º\d*)", bloco)
    if mca:
        dados["caster_nom"] = _dms_para_grau(mca.group(1))
        dados["caster_tol"] = _dms_para_grau(mca.group(2))

    # KPI
    mkpi = re.search(r"KPI\s*[:\s]*([0-9º,\.]+)", bloco)
    if mkpi and mkpi.group(1).strip() not in ("", "-"):
        dados["kpi"] = mkpi.group(1).strip()

    return dados

d_front = extrair_bloco("DIANTEIRA")
d_rear  = extrair_bloco("TRASEIRA")

# Convergência em graus (bloco complementar)
conv_graus_bloco = re.search(
    r"CONVERGÊNCIAS EM GRAUS(.*?)$", texto, re.S | re.I)
conv_d_grau = conv_t_grau = None
if conv_graus_bloco:
    cg = conv_graus_bloco.group(1)
    md = re.search(r"DIANTEIRA:.*?Converg\.[:\s]*([+-]?\d+º\d*)\s*\(\+-\)\s*(\d+º\d*)", cg, re.S | re.I)
    mt = re.search(r"TRASEIRA:.*?Converg\.[:\s]*([+-]?\d+º\d*)\s*\(\+-\)\s*(\d+º\d*)", cg, re.S | re.I)
    if md:
        conv_d_grau = {"nom": _dms_para_grau(md.group(1)), "tol": _dms_para_grau(md.group(2))}
    if mt:
        conv_t_grau = {"nom": _dms_para_grau(mt.group(1)), "tol": _dms_para_grau(mt.group(2))}

if not d_front and not d_rear:
    return None

return {
    "titulo":     titulo,
    "ano":        ano,
    "aro":        aro,
    "url":        url,
    "fonte":      "wlmedeiros.blogspot.com",
    # Dianteiro
    "conv_d_mm_nom":  d_front.get("conv_mm_nom"),
    "conv_d_mm_tol":  d_front.get("conv_mm_tol"),
    "camber_d_nom":   d_front.get("camber_nom"),
    "camber_d_tol":   d_front.get("camber_tol"),
    "caster_nom":     d_front.get("caster_nom"),
    "caster_tol":     d_front.get("caster_tol"),
    "kpi":            d_front.get("kpi", ""),
    "conv_d_grau_nom": conv_d_grau["nom"] if conv_d_grau else None,
    "conv_d_grau_tol": conv_d_grau["tol"] if conv_d_grau else None,
    # Traseiro
    "conv_t_mm_nom":  d_rear.get("conv_mm_nom"),
    "conv_t_mm_tol":  d_rear.get("conv_mm_tol"),
    "camber_t_nom":   d_rear.get("camber_nom"),
    "camber_t_tol":   d_rear.get("camber_tol"),
    "conv_t_grau_nom": conv_t_grau["nom"] if conv_t_grau else None,
    "conv_t_grau_tol": conv_t_grau["tol"] if conv_t_grau else None,
}
```

def _listar_posts(pagina_url: str) -> list[str]:
“”“Lista URLs dos posts de uma página do blog.”””
try:
r = requests.get(pagina_url, headers=HEADERS, timeout=15)
r.raise_for_status()
except Exception as e:
print(f”  ⚠  Erro ao listar posts: {e}”)
return []

```
soup = BeautifulSoup(r.text, "html.parser")
urls = []
for a in soup.find_all("a", href=True):
    href = a["href"]
    # Posts do blogspot têm padrão /YYYY/MM/slug.html
    if re.search(r"/\d{4}/\d{2}/[\w-]+\.html", href):
        u = href.split("?")[0] + "?m=1"
        if u not in urls:
            urls.append(u)
return urls
```

def scrape_blog(max_posts: int = 50) -> list[dict]:
“”“Percorre o blog coletando dados de alinhamento.”””
print(f”\n  🌐 Conectando em {BASE_URL} …”)
todos_urls: list[str] = []
pagina = BASE_URL + “/?m=1”

```
# Segue links de paginação ("Postagens mais antigas")
visitadas = set()
while pagina and len(todos_urls) < max_posts:
    if pagina in visitadas:
        break
    visitadas.add(pagina)
    novos = _listar_posts(pagina)
    for u in novos:
        if u not in todos_urls:
            todos_urls.append(u)
    # Próxima página
    try:
        r = requests.get(pagina, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(r.text, "html.parser")
        prox = soup.find("a", string=re.compile("mais antigas", re.I))
        pagina = (BASE_URL + prox["href"] if prox and not prox["href"].startswith("http")
                  else prox["href"] if prox else None)
        if pagina and "?" not in pagina:
            pagina += "?m=1"
    except Exception:
        pagina = None
    time.sleep(0.5)

print(f"  📋 {len(todos_urls)} post(s) encontrado(s). Extraindo dados...\n")

resultados = []
for i, url in enumerate(todos_urls[:max_posts], 1):
    slug = url.split("/")[-1].replace(".html?m=1", "")
    print(f"  [{i:>3}/{min(len(todos_urls), max_posts)}] {slug[:55]:<55}", end=" ")
    dados = _extrair_dados_post(url)
    if dados:
        resultados.append(dados)
        print("✔")
    else:
        print("—  (sem tabela)")
    time.sleep(0.4)

return resultados
```

def carregar_cache() -> list[dict]:
if os.path.exists(CACHE_FILE):
with open(CACHE_FILE, encoding=“utf-8”) as f:
return json.load(f)
return []

def salvar_cache(dados: list[dict]):
with open(CACHE_FILE, “w”, encoding=“utf-8”) as f:
json.dump(dados, f, ensure_ascii=False, indent=2)

# ══════════════════════════════════════════════════════════════════════════════

# BANCO LOCAL (fallback / já importados do site)

# ══════════════════════════════════════════════════════════════════════════════

DADOS_WEB: list[dict] = [
{
“titulo”: “Hyundai Creta”,
“ano”: “2023”, “aro”: “16”,
“url”: “https://wlmedeiros.blogspot.com/2026/03/hyundai-creta.html?m=1”,
“fonte”: “wlmedeiros.blogspot.com”,
“conv_d_mm_nom”: 0.71,  “conv_d_mm_tol”: 1.42,
“camber_d_nom”: -0.5,   “camber_d_tol”: 0.5,
“caster_nom”: 4.283,    “caster_tol”: 0.5,
“kpi”: “”,
“conv_d_grau_nom”: 0.1, “conv_d_grau_tol”: 0.2,
“conv_t_mm_nom”: 2.35,  “conv_t_mm_tol”: 2.12,
“camber_t_nom”: -1.5,   “camber_t_tol”: 0.5,
“conv_t_grau_nom”: 0.317, “conv_t_grau_tol”: 0.3,
},
{
“titulo”: “Ram Rampage Bighorn 2.0 Diesel”,
“ano”: “2024”, “aro”: “17”,
“url”: “https://wlmedeiros.blogspot.com/2026/03/ram-rampage-bighorn.html?m=1”,
“fonte”: “wlmedeiros.blogspot.com”,
“conv_d_mm_nom”: 0.50,  “conv_d_mm_tol”: 0.50,
“camber_d_nom”: -0.667, “camber_d_tol”: 0.583,
“caster_nom”: 3.983,    “caster_tol”: 0.5,
“kpi”: “”,
“conv_d_grau_nom”: 0.067, “conv_d_grau_tol”: 0.067,
“conv_t_mm_nom”: 1.63,  “conv_t_mm_tol”: 0.73,
“camber_t_nom”: -0.333, “camber_t_tol”: 0.5,
“conv_t_grau_nom”: 0.217, “conv_t_grau_tol”: 0.1,
},
{
“titulo”: “Land Rover Range Rover Evoque”,
“ano”: “2023”, “aro”: “17”,
“url”: “https://wlmedeiros.blogspot.com/2026/03/land-rover-range-rover-evoque.html?m=1”,
“fonte”: “wlmedeiros.blogspot.com”,
“conv_d_mm_nom”: 1.63,  “conv_d_mm_tol”: 1.13,
“camber_d_nom”: -0.783, “camber_d_tol”: 0.75,
“caster_nom”: 3.2,      “caster_tol”: 0.75,
“kpi”: “”,
“conv_d_grau_nom”: 0.217, “conv_d_grau_tol”: 0.15,
“conv_t_mm_nom”: 1.51,  “conv_t_mm_tol”: 1.13,
“camber_t_nom”: -1.483, “camber_t_tol”: 0.5,
“conv_t_grau_nom”: 0.2, “conv_t_grau_tol”: 0.15,
},
{
“titulo”: “BMW X7 AWD (G07)”,
“ano”: “2023”, “aro”: “20”,
“url”: “https://wlmedeiros.blogspot.com/2026/03/bmw-x7.html?m=1”,
“fonte”: “wlmedeiros.blogspot.com”,
“conv_d_mm_nom”: 0.89,  “conv_d_mm_tol”: 0.59,
“camber_d_nom”: -0.367, “camber_d_tol”: 0.417,
“caster_nom”: None,     “caster_tol”: None,
“kpi”: “”,
“conv_d_grau_nom”: 0.1, “conv_d_grau_tol”: 0.067,
“conv_t_mm_nom”: 1.48,  “conv_t_mm_tol”: 0.59,
“camber_t_nom”: -1.5,   “camber_t_tol”: 0.083,
“conv_t_grau_nom”: 0.167, “conv_t_grau_tol”: 0.067,
},
{
“titulo”: “Fiat Ducato Cargo”,
“ano”: “2024”, “aro”: “16”,
“url”: “https://wlmedeiros.blogspot.com/2026/01/fiat-ducato.html?m=1”,
“fonte”: “wlmedeiros.blogspot.com”,
“conv_d_mm_nom”: -1.00, “conv_d_mm_tol”: 1.00,
“camber_d_nom”: 0.0,    “camber_d_tol”: 0.5,
“caster_nom”: 1.75,     “caster_tol”: 0.5,
“kpi”: “”,
“conv_d_grau_nom”: -0.133, “conv_d_grau_tol”: 0.133,
“conv_t_mm_nom”: -2.72, “conv_t_mm_tol”: 1.75,
“camber_t_nom”: -0.5,   “camber_t_tol”: 0.5,
“conv_t_grau_nom”: -0.383, “conv_t_grau_tol”: 0.233,
},
{
“titulo”: “GM Chevrolet Silverado High Country”,
“ano”: “2024”, “aro”: “20”,
“url”: “https://wlmedeiros.blogspot.com/2026/01/gm-chevrolet-silverado-high-country.html?m=1”,
“fonte”: “wlmedeiros.blogspot.com”,
“conv_d_mm_nom”: 3.66,  “conv_d_mm_tol”: 1.66,
“camber_d_nom”: -0.5,   “camber_d_tol”: 0.5,
“caster_nom”: 3.333,    “caster_tol”: 0.75,
“kpi”: “”,
“conv_d_grau_nom”: 0.417, “conv_d_grau_tol”: 0.183,
“conv_t_mm_nom”: 0.0,   “conv_t_mm_tol”: 0.55,
“camber_t_nom”: 0.0,    “camber_t_tol”: 0.167,
“conv_t_grau_nom”: 0.0, “conv_t_grau_tol”: 0.067,
},
{
“titulo”: “Citroen C3”,
“ano”: “2023”, “aro”: “16”,
“url”: “https://wlmedeiros.blogspot.com/2025/11/citroen-c3.html?m=1”,
“fonte”: “wlmedeiros.blogspot.com”,
“conv_d_mm_nom”: 2.00,  “conv_d_mm_tol”: 1.16,
“camber_d_nom”: -0.4,   “camber_d_tol”: 0.5,
“caster_nom”: 4.033,    “caster_tol”: 0.5,
“kpi”: “”,
“conv_d_grau_nom”: 0.283, “conv_d_grau_tol”: 0.15,
“conv_t_mm_nom”: 5.07,  “conv_t_mm_tol”: 1.13,
“camber_t_nom”: -2.0,   “camber_t_tol”: 0.5,
“conv_t_grau_nom”: 0.717, “conv_t_grau_tol”: 0.15,
},
]

# BD ativo (começa com dados locais; scraper adiciona mais)

DB_WEB: list[dict] = list(DADOS_WEB)

# ══════════════════════════════════════════════════════════════════════════════

# UTILITÁRIOS DE TERMINAL

# ══════════════════════════════════════════════════════════════════════════════

def limpar():
os.system(“cls” if os.name == “nt” else “clear”)

def linha(c=“═”, n=72): print(c * n)

def titulo(txt):
limpar(); linha()
print(f”  🔧  {txt}”); linha(); print()

def pausar():
input(”\n  Pressione ENTER para continuar…”)

def fv(v, unidade=“°”):
if v is None:        return “  N/D  “
if isinstance(v, float): return f”{v:+.3f}{unidade}”
return str(v)

def exibir_web(v: dict, idx: int | None = None):
pref = f”  [{idx}] “ if idx else “  “
print(f”{pref}\033[1m{v[‘titulo’]}\033[0m  |  {v[‘ano’]}  |  Aro {v[‘aro’]}”)
print(f”       DIANTEIRO ─ Conv: {fv(v[‘conv_d_mm_nom’],‘mm’)} (±{fv(v[‘conv_d_mm_tol’],‘mm’)})  “
f”Câmber: {fv(v[‘camber_d_nom’])}  Cáster: {fv(v[‘caster_nom’])}”)
print(f”       TRASEIRO  ─ Conv: {fv(v[‘conv_t_mm_nom’],‘mm’)} (±{fv(v[‘conv_t_mm_tol’],‘mm’)})  “
f”Câmber: {fv(v[‘camber_t_nom’])}”)
print(f”       Fonte: {v[‘fonte’]}  |  {v[‘url’]}”)
print()

# ══════════════════════════════════════════════════════════════════════════════

# MÓDULOS DO MENU

# ══════════════════════════════════════════════════════════════════════════════

# ── Importar / Atualizar do blog ──────────────────────────────────────────────

def menu_importar():
titulo(“IMPORTAR DADOS DO BLOG – wlmedeiros.blogspot.com”)
if not SCRAPER_OK:
print(”  ⚠  Módulos necessários não instalados.”)
print(”  Execute: pip install requests beautifulsoup4\n”)
pausar(); return

```
# Carregar cache
cache = carregar_cache()
if cache:
    print(f"  Cache local: {len(cache)} registro(s) em '{CACHE_FILE}'")
    print("  [1] Usar cache existente")
    print("  [2] Atualizar do blog (nova raspagem)")
    print("  [0] Voltar")
    linha("─")
    esc = input("  Escolha: ").strip()
    if esc == "0": return
    if esc == "1":
        global DB_WEB
        DB_WEB = cache
        print(f"\n  ✔  {len(DB_WEB)} veículo(s) carregado(s) do cache.")
        pausar(); return
else:
    print("  Nenhum cache encontrado. Iniciando raspagem do blog...\n")
    esc = "2"

if esc == "2":
    try:
        max_p = input("  Quantos posts buscar? [padrão: 30]: ").strip()
        max_p = int(max_p) if max_p.isdigit() else 30
    except Exception:
        max_p = 30

    novos = scrape_blog(max_posts=max_p)
    if novos:
        # Mesclar: não duplicar por URL
        urls_existentes = {v["url"] for v in DB_WEB}
        adicionados = [v for v in novos if v["url"] not in urls_existentes]
        DB_WEB.extend(adicionados)
        salvar_cache(DB_WEB)
        print(f"\n  ✔  {len(novos)} extraído(s)  |  {len(adicionados)} novo(s) adicionado(s).")
        print(f"  💾 Cache salvo em '{CACHE_FILE}'")
    else:
        print("\n  ⚠  Nenhum dado extraído.")
    pausar()
```

# ── Listar todos ──────────────────────────────────────────────────────────────

def menu_listar():
titulo(f”TODOS OS VEÍCULOS IMPORTADOS  ({len(DB_WEB)} registros)”)
if not DB_WEB:
print(”  Nenhum dado disponível. Use [1] Importar primeiro.”)
pausar(); return
for i, v in enumerate(DB_WEB, 1):
exibir_web(v, i)
pausar()

# ── Buscar ────────────────────────────────────────────────────────────────────

def menu_buscar():
titulo(“BUSCA LIVRE”)
termo = input(”  Buscar (marca/modelo/ano): “).strip().lower()
if not termo: return
res = [v for v in DB_WEB if termo in v[“titulo”].lower() or termo in v[“ano”]]
print()
if not res:
print(”  ⚠  Nenhum resultado.”)
else:
print(f”  ✔  {len(res)} resultado(s):\n”)
for i, v in enumerate(res, 1):
exibir_web(v, i)
pausar()

# ── Detalhe de um veículo ─────────────────────────────────────────────────────

def menu_detalhe():
titulo(“VER DADOS COMPLETOS”)
if not DB_WEB:
print(”  Nenhum dado. Importe primeiro.”); pausar(); return
for i, v in enumerate(DB_WEB, 1):
print(f”  [{i:>3}] {v[‘titulo’]}  ({v[‘ano’]})”)
linha(“─”)
esc = input(”  Número do veículo: “).strip()
if not esc.isdigit() or not (1 <= int(esc) <= len(DB_WEB)):
print(”  ⚠  Inválido.”); pausar(); return
v = DB_WEB[int(esc) - 1]
titulo(f”DADOS DETALHADOS – {v[‘titulo’]}”)

```
def row(label, nom, tol, un=""):
    n = fv(nom, un) if nom is not None else "N/D"
    t = fv(tol, un) if tol is not None else "N/D"
    print(f"  {label:<30} Nom: {n:<12}  Tol: ±{t}")

print(f"  Veículo : {v['titulo']}")
print(f"  Ano     : {v['ano']}   Aro: {v['aro']}")
print(f"  Fonte   : {v['fonte']}")
print(f"  URL     : {v['url']}")
linha("─")
print("  ── EIXO DIANTEIRO ───────────────────────────────────────")
row("Convergência (mm)",  v["conv_d_mm_nom"],  v["conv_d_mm_tol"],  " mm")
row("Convergência (grau)",v["conv_d_grau_nom"],v["conv_d_grau_tol"],"°")
row("Câmber (°)",         v["camber_d_nom"],   v["camber_d_tol"],   "°")
row("Cáster (°)",         v["caster_nom"],     v["caster_tol"],     "°")
if v.get("kpi"):
    print(f"  {'KPI':<30} {v['kpi']}")
linha("─")
print("  ── EIXO TRASEIRO ────────────────────────────────────────")
row("Convergência (mm)",  v["conv_t_mm_nom"],  v["conv_t_mm_tol"],  " mm")
row("Convergência (grau)",v["conv_t_grau_nom"],v["conv_t_grau_tol"],"°")
row("Câmber (°)",         v["camber_t_nom"],   v["camber_t_tol"],   "°")
pausar()
```

# ── Exportar ──────────────────────────────────────────────────────────────────

def menu_exportar():
titulo(“EXPORTAR DADOS IMPORTADOS”)
print(”  [1] JSON  – dados completos”)
print(”  [2] CSV   – planilha simples”)
print(”  [3] Excel – formatado (.xlsx)”)
print(”  [0] Voltar”)
linha(“─”)
esc = input(”  Escolha: “).strip()

```
if esc == "1":
    path = "wlmedeiros_alinhamento.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(DB_WEB, f, ensure_ascii=False, indent=2)
    print(f"\n  ✔  JSON gerado: {path}")

elif esc == "2":
    path = "wlmedeiros_alinhamento.csv"
    if DB_WEB:
        with open(path, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=DB_WEB[0].keys())
            w.writeheader(); w.writerows(DB_WEB)
        print(f"\n  ✔  CSV gerado: {path}")

elif esc == "3":
    _exportar_excel_web()

if esc in ("1", "2", "3"):
    pausar()
```

def _exportar_excel_web():
if not EXCEL_OK:
print(”\n  ⚠  openpyxl não instalado. Execute: pip install openpyxl”)
return
if not DB_WEB:
print(”\n  ⚠  Sem dados para exportar.”); return

```
COR_T="0D1B4B"; COR_H="1A56A0"; COR_S="C5D8F0"
COR_A1="FFFFFF"; COR_A2="EBF5FB"; COR_B="FFFFFF"; COR_E="1A1A2E"

def fill(h): return PatternFill("solid", fgColor=h)
brd = Border(
    left=Side(style="thin",color="9DC3E6"), right=Side(style="thin",color="9DC3E6"),
    top=Side(style="thin",color="9DC3E6"),  bottom=Side(style="thin",color="9DC3E6"))

wb = Workbook()
ws = wb.active
ws.title = "Dados wlmedeiros"

colunas = [
    ("VEÍCULO / MODELO", 30),("ANO",7),("ARO",7),
    ("CONV D mm NOM",14),("CONV D mm TOL",14),
    ("CONV D ° NOM",13),  ("CONV D ° TOL",13),
    ("CÂMBER D NOM",13),  ("CÂMBER D TOL",13),
    ("CÁSTER NOM",12),    ("CÁSTER TOL",12),
    ("KPI",10),
    ("CONV T mm NOM",14),("CONV T mm TOL",14),
    ("CONV T ° NOM",13), ("CONV T ° TOL",13),
    ("CÂMBER T NOM",13), ("CÂMBER T TOL",13),
    ("URL / FONTE",45),
]

# Título
nc = len(colunas)
ws.merge_cells(f"A1:{get_column_letter(nc)}1")
c = ws["A1"]
c.value = "TABELA DE ALINHAMENTO 3D – Importado de wlmedeiros.blogspot.com"
c.font = Font(name="Arial", bold=True, color=COR_B, size=13)
c.fill = fill(COR_T)
c.alignment = Alignment(horizontal="center", vertical="center")
ws.row_dimensions[1].height = 26

# Cabeçalhos
for col, (nome, larg) in enumerate(colunas, 1):
    ws.column_dimensions[get_column_letter(col)].width = larg
    c = ws.cell(2, col, nome)
    c.font = Font(name="Arial", bold=True, color=COR_B, size=8)
    c.fill = fill(COR_H)
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = brd
ws.row_dimensions[2].height = 30

# Dados
for row, v in enumerate(DB_WEB, 3):
    bg = COR_A1 if row % 2 == 0 else COR_A2
    vals = [
        v["titulo"], v["ano"], v["aro"],
        v["conv_d_mm_nom"],  v["conv_d_mm_tol"],
        v["conv_d_grau_nom"],v["conv_d_grau_tol"],
        v["camber_d_nom"],   v["camber_d_tol"],
        v["caster_nom"],     v["caster_tol"],
        v.get("kpi",""),
        v["conv_t_mm_nom"],  v["conv_t_mm_tol"],
        v["conv_t_grau_nom"],v["conv_t_grau_tol"],
        v["camber_t_nom"],   v["camber_t_tol"],
        v["url"],
    ]
    for col, val in enumerate(vals, 1):
        c = ws.cell(row, col, val)
        c.font = Font(name="Arial", size=9)
        c.fill = fill(bg); c.border = brd
        c.alignment = Alignment(
            horizontal="left" if col in (1, nc) else "center",
            vertical="center")
    ws.row_dimensions[row].height = 15

# Rodapé
last = len(DB_WEB) + 2
ws.merge_cells(f"A{last+1}:{get_column_letter(nc)}{last+1}")
c = ws[f"A{last+1}"]
c.value = (f"⚠  Dados extraídos automaticamente de wlmedeiros.blogspot.com  |  "
           f"{len(DB_WEB)} veículos  |  Confirme sempre com o manual do fabricante.")
c.font = Font(name="Arial", italic=True, size=8, color="7F7F7F")
c.fill = fill("F2F2F2")
c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
ws.row_dimensions[last+1].height = 24

ws.auto_filter.ref = f"A2:{get_column_letter(nc)}{last}"
ws.freeze_panes = "A3"

path = "wlmedeiros_alinhamento.xlsx"
wb.save(path)
print(f"\n  ✔  Excel gerado: {path}  ({len(DB_WEB)} registros)")
```

# ── Estatísticas ──────────────────────────────────────────────────────────────

def menu_stats():
titulo(“ESTATÍSTICAS DOS DADOS IMPORTADOS”)
if not DB_WEB:
print(”  Sem dados. Importe primeiro.”); pausar(); return

```
print(f"  Total de veículos   : {len(DB_WEB)}")

anos = [v["ano"] for v in DB_WEB if v["ano"] != "N/D"]
if anos:
    anos_i = [int(a) for a in anos if a.isdigit()]
    if anos_i:
        print(f"  Ano mais recente    : {max(anos_i)}")
        print(f"  Ano mais antigo     : {min(anos_i)}")

# Média câmber dianteiro
cb = [v["camber_d_nom"] for v in DB_WEB if isinstance(v["camber_d_nom"], float)]
if cb:
    print(f"  Câmber D. médio     : {sum(cb)/len(cb):+.3f}°")

ca = [v["caster_nom"] for v in DB_WEB if isinstance(v["caster_nom"], float)]
if ca:
    print(f"  Cáster médio        : {sum(ca)/len(ca):.3f}°")

print()
linha("─")
print("  CÂMBER DIANTEIRO por veículo (barra ASCII):")
for v in DB_WEB:
    if isinstance(v["camber_d_nom"], float):
        barra_len = max(1, int(abs(v["camber_d_nom"]) * 10))
        barra = "█" * barra_len
        print(f"  {v['titulo'][:35]:<35} {v['camber_d_nom']:+.3f}°  {barra}")
pausar()
```

# ══════════════════════════════════════════════════════════════════════════════

# MENU PRINCIPAL

# ══════════════════════════════════════════════════════════════════════════════

def menu_principal():
while True:
titulo(“SISTEMA DE ALINHAMENTO 3D – IMPORTAÇÃO WEB”)
print(f”  Fonte  : {BASE_URL}”)
print(f”  Dados  : {len(DB_WEB)} veículo(s) carregado(s)”)
scraper_status = “✔ disponível” if SCRAPER_OK else “✗ instale: pip install requests beautifulsoup4”
excel_status   = “✔ disponível” if EXCEL_OK   else “✗ instale: pip install openpyxl”
print(f”  Scraper: {scraper_status}”)
print(f”  Excel  : {excel_status}”)
print()
print(”  [1]  Importar / Atualizar dados do blog”)
print(”  [2]  Listar todos os veículos”)
print(”  [3]  Busca livre”)
print(”  [4]  Ver dados completos de um veículo”)
print(”  [5]  Estatísticas”)
print(”  [6]  Exportar (JSON / CSV / Excel)”)
print(”  [0]  Sair”)
linha(“─”)
esc = input(”  Escolha: “).strip()

```
    if   esc == "1": menu_importar()
    elif esc == "2": menu_listar()
    elif esc == "3": menu_buscar()
    elif esc == "4": menu_detalhe()
    elif esc == "5": menu_stats()
    elif esc == "6": menu_exportar()
    elif esc == "0":
        limpar(); print("\n  Até logo! 🔧\n"); sys.exit(0)
    else:
        print("  ⚠  Opção inválida."); pausar()
```

if **name** == “**main**”:
# Tenta carregar cache automaticamente na inicialização
cache = carregar_cache()
if cache:
DB_WEB = cache
menu_principal()