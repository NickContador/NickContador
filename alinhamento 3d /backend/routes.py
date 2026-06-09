from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import Veiculo, GeometriaSuspensao
from schemas import VeiculoCreate, VeiculoResponse

router = APIRouter()


@router.post("/veiculos/", response_model=VeiculoResponse, status_code=201)
def criar_veiculo(veiculo: VeiculoCreate, db: Session = Depends(get_db)):
    db_veiculo = Veiculo(
        fabricante=veiculo.fabricante, marca=veiculo.marca, modelo=veiculo.modelo,
        ano_inicio=veiculo.ano_inicio, ano_fim=veiculo.ano_fim
    )
    db.add(db_veiculo)
    db.commit()
    db.refresh(db_veiculo)

    for geo in veiculo.geometria:
        db.add(GeometriaSuspensao(
            veiculo_id=db_veiculo.id, eixo=geo.eixo,
            camber_nominal=geo.camber_nominal,
            caster_nominal=geo.caster_nominal,
            convergencia_nominal=geo.convergencia_nominal
        ))
    db.commit()
    db.refresh(db_veiculo)
    return db_veiculo


import subprocess
import os

@router.post("/veiculos/sincronizar")
def sincronizar_banco(veiculos: List[VeiculoCreate] = [], db: Session = Depends(get_db)):
    adicionados = 0
    for v in veiculos:
        existe = db.query(Veiculo).filter(
            Veiculo.marca.ilike(v.marca),
            Veiculo.modelo.ilike(v.modelo),
            Veiculo.ano_inicio == v.ano_inicio
        ).first()
        if existe:
            continue
        novo = Veiculo(fabricante=v.fabricante, marca=v.marca, modelo=v.modelo, ano_inicio=v.ano_inicio, ano_fim=v.ano_fim)
        db.add(novo)
        db.commit()
        db.refresh(novo)
        for geo in v.geometria:
            db.add(GeometriaSuspensao(
                veiculo_id=novo.id, eixo=geo.eixo,
                camber_nominal=geo.camber_nominal,
                caster_nominal=geo.caster_nominal,
                convergencia_nominal=geo.convergencia_nominal
            ))
        adicionados += 1
    db.commit()

    # Run scraper if no manual data was sent
    if not veiculos:
        scraper_path = os.path.join(os.path.dirname(__file__), "..", "scraper.py")
        try:
            result = subprocess.run(["python3", scraper_path], capture_output=True, text=True, timeout=120)
            return {"status": "sucesso", "mensagem": result.stdout.strip().split("\n")[-1] if result.stdout else "Scraper executado."}
        except Exception as e:
            return {"status": "erro", "mensagem": str(e)}

    return {"status": "sucesso", "mensagem": f"{adicionados} veículo(s) adicionado(s)."}


@router.get("/veiculos/", response_model=List[VeiculoResponse])
def listar_veiculos(
    fabricante: Optional[str] = None,
    marca: Optional[str] = None,
    modelo: Optional[str] = None,
    ano: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Veiculo)
    if fabricante:
        query = query.filter(Veiculo.fabricante.ilike(f"%{fabricante}%"))
    if marca:
        query = query.filter(Veiculo.marca.ilike(f"%{marca}%"))
    if modelo:
        query = query.filter(Veiculo.modelo.ilike(f"%{modelo}%"))
    if ano:
        query = query.filter(
            Veiculo.ano_inicio <= ano,
            (Veiculo.ano_fim >= ano) | (Veiculo.ano_fim.is_(None))
        )
    return query.all()


@router.get("/veiculos/{veiculo_id}", response_model=VeiculoResponse)
def buscar_veiculo(veiculo_id: int, db: Session = Depends(get_db)):
    veiculo = db.query(Veiculo).filter(Veiculo.id == veiculo_id).first()
    if not veiculo:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")
    return veiculo
