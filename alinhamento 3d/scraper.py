import json
import re
import html
import os
from bs4 import BeautifulSoup

DB_PATH = "/home/marco/Documentos/DEV/PROJETOS /alinhamento 3d /dados/alinhamento.db"

BRANDS = [
    "Abarth","Agrale","Alfa Romeo","Audi","BMW","Buick","BYD","Cadillac","Chevrolet","Chrysler",
    "Citroen","Citroën","Dodge","Fiat","Ford","Geely","GM","GMC","Great Wall","Honda",
    "Hyundai","Isuzu","JAC","Jaguar","Jeep","Kia","Lamborghini","Land Rover","Lexus",
    "Lotus","Maserati","Mazda","Mercedes-Benz","Mercedes","Mini","Mitsubishi","Nissan",
    "Peugeot","Porsche","Ram","Renault","Rolls-Royce","Seat","Subaru","Suzuki","Tata",
    "Toyota","Volkswagen","VW","Volvo","Chery","Changan","Haval","GWM","Foton",
    "Shineray","Effa","KTM","Haojue","Dafra","Kasinski","Ssangyong","SsangYong",
    "Ducati","Harley-Davidson","Honda","Yamaha","Kawasaki","Triumph","Royal Enfield",
]

FABRICANTE_MAP = {
    'Fiat': 'Stellantis', 'Jeep': 'Stellantis', 'Dodge': 'Stellantis', 'Ram': 'Stellantis',
    'Citroen': 'Stellantis', 'Citroën': 'Stellantis', 'Peugeot': 'Stellantis',
    'Chrysler': 'Stellantis', 'Abarth': 'Stellantis', 'Alfa Romeo': 'Stellantis',
    'Maserati': 'Stellantis',
    'VW': 'Volkswagen Group', 'Volkswagen': 'Volkswagen Group', 'Audi': 'Volkswagen Group',
    'Porsche': 'Volkswagen Group', 'Seat': 'Volkswagen Group', 'Lamborghini': 'Volkswagen Group',
    'Chevrolet': 'General Motors', 'GM': 'General Motors', 'Buick': 'General Motors',
    'Cadillac': 'General Motors', 'GMC': 'General Motors',
    'Ford': 'Ford Motor Company', 'Troller': 'Ford Motor Company',
    'BMW': 'BMW Group', 'Mini': 'BMW Group', 'Rolls-Royce': 'BMW Group',
    'Mercedes': 'Mercedes-Benz Group', 'Mercedes-Benz': 'Mercedes-Benz Group',
    'Renault': 'Renault Group', 'Nissan': 'Renault Group',
    'Hyundai': 'Hyundai Motor Group', 'Kia': 'Hyundai Motor Group',
    'Toyota': 'Toyota Motor Corporation', 'Lexus': 'Toyota Motor Corporation',
    'Honda': 'Honda Motor Company',
    'Mitsubishi': 'Mitsubishi Motors',
    'Suzuki': 'Suzuki Motor Corporation',
    'Volvo': 'Volvo Group',
    'Land Rover': 'Jaguar Land Rover', 'Jaguar': 'Jaguar Land Rover',
    'Chery': 'Chery Automobile', 'JAC': 'JAC Motors', 'BYD': 'BYD Auto',
    'Changan': 'Changan Automobile', 'GWM': 'Great Wall Motors', 'Haval': 'Great Wall Motors',
    'Great Wall': 'Great Wall Motors', 'Geely': 'Geely Auto', 'Foton': 'Foton Motor',
    'Effa': 'Effa Motors', 'Shineray': 'Shineray Group', 'LIFAN': 'Lifan Industry',
    'Jinbei': 'BMW Group',
    'Subaru': 'Subaru Corporation', 'Isuzu': 'Isuzu Motors', 'Tata': 'Tata Motors',
    'Ssangyong': 'KG Mobility', 'SsangYong': 'KG Mobility', 'Agrale': 'Agrale S.A.',
    'Mahindra': 'Mahindra Group',
    'Ducati': 'Ducati Motor Holding', 'Harley-Davidson': 'Harley-Davidson',
    'Yamaha': 'Yamaha Motor Company', 'Kawasaki': 'Kawasaki Heavy Industries',
    'Triumph': 'Triumph Motorcycles', 'Royal Enfield': 'Royal Enfield',
    'KTM': 'KTM AG', 'Haojue': 'Haojue Motorcycle', 'Dafra': 'Dafra Motos',
    'Kasinski': 'Kasinski Motos',
}


def extract_brand_model(title):
    title = title.strip()
    title_upper = title.upper()
    
    for brand in sorted(BRANDS, key=len, reverse=True):
        if brand.upper() in title_upper:
            idx = title_upper.index(brand.upper())
            model = title[idx + len(brand):].strip()
            model = re.sub(r'^[\s\-–—,]+', '', model)
            model = re.sub(r'\s+', ' ', model).strip()
            # Remove year from model if present
            model = re.sub(r'\s+(19\d{2}|20\d{2})\s*$', '', model).strip()
            return brand, model if model else title
    
    # Fallback: first word as brand
    parts = title.split(None, 1)
    brand = parts[0] if parts else title
    model = parts[1] if len(parts) > 1 else title
    model = re.sub(r'\s+(19\d{2}|20\d{2})\s*$', '', model).strip()
    return brand, model


def extract_year_from_content(text, title=""):
    years = re.findall(r'Ano:\s*(\d{4})', text)
    if years:
        return int(years[0])
    years_in_title = re.findall(r'\b(19\d{2}|20\d{2})\b', title)
    if years_in_title:
        return int(years_in_title[0])
    years_in_text = re.findall(r'\b(19\d{2}|20\d{2})\b', text)
    valid = [int(y) for y in years_in_text if 1980 <= int(y) <= 2030]
    if valid:
        return min(valid)
    return None


def extract_aro(text):
    aros = re.findall(r'Aro:\s*(\d+)', text)
    if aros:
        return int(aros[0])
    aros = re.findall(r'\bARO\s+(\d+)', text)
    if aros:
        return int(aros[0])
    return None


def extract_geo_data(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    text = soup.get_text(separator='\n')
    text = html.unescape(text)
    
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    
    front = {}
    rear = {}
    front_graus = {}
    rear_graus = {}
    current_section = None
    in_graus = False
    
    for line_raw in lines:
        line = line_raw.replace('\xa0', ' ').replace('&nbsp;', ' ')
        l = line.upper()
        
        if 'CONVERGÊNCIAS EM GRAUS' in l or 'CONVERGENCIAS EM GRAUS' in l:
            in_graus = True
            continue
        
        if l in ('DIANTEIRA', 'DIANTEIRA:') or l.startswith('DIANTEIRA:'):
            current_section = 'front'
            continue
        
        if l in ('TRASEIRA', 'TRASEIRA:') or l.startswith('TRASEIRA:'):
            current_section = 'rear'
            continue
        
        if current_section is None:
            continue
        
        # Convergência
        m = re.match(r'[Cc]onverg\.?\s*:?\s*(.+)$', line)
        if m:
            val = m.group(1).strip()
            if in_graus:
                if current_section == 'front':
                    front_graus['convergencia'] = val
                else:
                    rear_graus['convergencia'] = val
            else:
                if current_section == 'front':
                    front['convergencia'] = val
                else:
                    rear['convergencia'] = val
            continue
        
        # Câmber
        m = re.match(r'[Cc][aâ]mber\s*:?\s*(.*)$', line, re.IGNORECASE)
        if m:
            val = m.group(1).strip()
            if val:
                if current_section == 'front':
                    front['camber'] = val
                else:
                    rear['camber'] = val
            continue
        
        # Cáster
        m = re.match(r'[Cc]áster\s*:?\s*(.*)$', line, re.IGNORECASE)
        if m:
            val = m.group(1).strip()
            if val:
                if current_section == 'front':
                    front['caster'] = val
            continue
        
        # KPI
        m = re.match(r'KPI\s*:?\s*(.*)$', line, re.IGNORECASE)
        if m:
            val = m.group(1).strip()
            if val:
                if current_section == 'front':
                    front['kpi'] = val
            continue
    
    # Old format (Dianteira:/Traseira: instead of DIANTEIRA:/TRASEIRA:)
    if not front and not rear:
        current_section = None
        for line_raw in lines:
            line = line_raw.replace('\xa0', ' ').replace('&nbsp;', ' ')
            l = line.upper()
            if l in ('DIANTEIRA', 'DIANTEIRA:') or (line.strip().title() == 'Dianteira' or line.strip().title() == 'Dianteira:'):
                current_section = 'front'
                continue
            if l in ('TRASEIRA', 'TRASEIRA:') or (line.strip().title() == 'Traseira' or line.strip().title() == 'Traseira:'):
                current_section = 'rear'
                continue
            if current_section is None:
                continue
            
            m = re.match(r'[Cc]onv\.?\s*:?\s*(.+)$', line)
            if m:
                val = m.group(1).strip()
                if current_section == 'front':
                    front['convergencia'] = val
                else:
                    rear['convergencia'] = val
                continue
            
            m = re.match(r'[Cc]amb\.?\s*:?\s*(.+)$', line, re.IGNORECASE)
            if m:
                val = m.group(1).strip()
                if current_section == 'front':
                    front['camber'] = val
                else:
                    rear['camber'] = val
                continue
            
            m = re.match(r'[Cc]ast\.?\s*:?\s*(.+)$', line, re.IGNORECASE)
            if m:
                val = m.group(1).strip()
                if current_section == 'front':
                    front['caster'] = val
                continue
    
    # Combine graus into front/rear
    if front_graus and 'convergencia' in front_graus:
        if 'convergencia_graus' not in front:
            front['convergencia_graus'] = front_graus['convergencia']
    if rear_graus and 'convergencia' in rear_graus:
        if 'convergencia_graus' not in rear:
            rear['convergencia_graus'] = rear_graus['convergencia']
    
    result = {}
    if front:
        result['dianteira'] = front
    if rear:
        result['traseira'] = rear
    return result if result else None


def is_vehicle_post(content, title):
    """Check if this is a vehicle alignment post (not an informational article)"""
    # Check for alignment table indicators
    has_table_indicators = any(x in content for x in [
        'DIANTEIRA:', 'TRASEIRA:', 'Converg.:', 'conv.:',
        'Câmber', 'Cáster', 'Convergências em mm'
    ])
    
    # Skip informational posts by checking title
    skip_titles = [
        'PINO MESTRE', 'KPI', 'TRANSFORMAR', 'GRAU EM MILÍMETROS',
        'ADICIONANDO VEÍCULOS', 'ANTIGA MOTOCA', 'SEGUIDORES',
        'QUEM SOU EU', 'DIVERSOS ANTIGOS', 'ARQUIVO',
    ]
    
    title_upper = title.upper()
    for skip in skip_titles:
        if skip in title_upper and 'CONVERG' not in content[:500]:
            return False
    
    return has_table_indicators


def process_entry(entry):
    title = entry.get('title', {}).get('$t', '')
    content = entry.get('content', {}).get('$t', '')
    
    if not content or not is_vehicle_post(content, title):
        return None
    
    brand, model = extract_brand_model(title)
    year = extract_year_from_content(content, title)
    aro = extract_aro(content)
    geo = extract_geo_data(content)
    
    if not geo:
        return None
    
    return {
        'brand': brand,
        'model': model,
        'year': year or 0,
        'aro': aro,
        'geo': geo,
        'title': title,
    }


def main():
    import sqlite3
    
    # Load feed files
    all_entries = []
    feed_dir = '/home/marco/snap/code/244/.local/share/opencode/tool-output'
    
    # Collect all JSON feed files
    for fname in sorted(os.listdir(feed_dir)):
        fpath = os.path.join(feed_dir, fname)
        if not os.path.isfile(fpath):
            continue
        try:
            with open(fpath, 'r') as f:
                data = json.load(f)
            if 'feed' in data and 'entry' in data['feed']:
                entries = data['feed']['entry']
                all_entries.extend(entries)
                print(f"  {fname}: {len(entries)} entradas")
        except (json.JSONDecodeError, Exception):
            pass
    
    print(f"Total de entradas carregadas: {len(all_entries)}")
    
    vehicles = []
    skipped = 0
    for entry in all_entries:
        result = process_entry(entry)
        if result:
            vehicles.append(result)
        else:
            skipped += 1
    
    print(f"Veículos extraídos: {len(vehicles)}")
    print(f"Ignorados: {skipped}")
    
    if not vehicles:
        print("Nenhum veículo extraído - verifique a lógica de extração")
        return
    
    # Insert into DB
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    adicionados = 0
    atualizados = 0
    erros = 0
    
    for v in vehicles:
        try:
            marca = v['brand']
            modelo = v['model']
            ano = v['year']
            fabricante = FABRICANTE_MAP.get(marca, '')
            
            if not ano:
                ano = 0
            
            cur.execute(
                "SELECT id FROM veiculos WHERE LOWER(marca) = LOWER(?) AND LOWER(modelo) = LOWER(?) AND ano_inicio = ?",
                (marca, modelo, ano)
            )
            existing = cur.fetchone()
            
            if existing:
                veiculo_id = existing[0]
                cur.execute("UPDATE veiculos SET fabricante = ? WHERE id = ?", (fabricante, veiculo_id))
            else:
                cur.execute(
                    "INSERT INTO veiculos (fabricante, marca, modelo, ano_inicio, ano_fim) VALUES (?, ?, ?, ?, NULL)",
                    (fabricante, marca, modelo, ano)
                )
                veiculo_id = cur.lastrowid
                adicionados += 1
            
            for eixo_key, eixo_data in v['geo'].items():
                eixo_label = 'Dianteiro' if eixo_key == 'dianteira' else 'Traseiro'
                camber = eixo_data.get('camber', '')
                caster = eixo_data.get('caster', '')
                # Preferir convergência em graus quando disponível
                convergencia = eixo_data.get('convergencia_graus', '') or eixo_data.get('convergencia', '')
                
                cur.execute(
                    "SELECT id FROM geometria_suspensao WHERE veiculo_id = ? AND eixo = ?",
                    (veiculo_id, eixo_label)
                )
                geo_existing = cur.fetchone()
                
                if geo_existing:
                    cur.execute(
                        "UPDATE geometria_suspensao SET camber_nominal = ?, caster_nominal = ?, convergencia_nominal = ? WHERE id = ?",
                        (camber, caster, convergencia, geo_existing[0])
                    )
                    atualizados += 1
                else:
                    cur.execute(
                        "INSERT INTO geometria_suspensao (veiculo_id, eixo, camber_nominal, caster_nominal, convergencia_nominal) VALUES (?, ?, ?, ?, ?)",
                        (veiculo_id, eixo_label, camber, caster, convergencia)
                    )
                    adicionados += 1
            
        except Exception as e:
            erros += 1
            print(f"  Erro em '{v['title']}': {e}")
    
    conn.commit()
    conn.close()
    
    print(f"\nResumo:")
    print(f"  Veículos extraídos: {len(vehicles)}")
    print(f"  Adicionados: {adicionados}")
    print(f"  Atualizados: {atualizados}")
    print(f"  Erros: {erros}")
    
    print(f"Sincronização concluída: {adicionados} adicionados, {atualizados} atualizados, {erros} erros.")


if __name__ == '__main__':
    main()
