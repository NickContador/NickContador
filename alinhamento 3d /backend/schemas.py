from pydantic import BaseModel, Field
from typing import List, Optional


class GeometriaCreate(BaseModel):
    eixo: str
    camber_nominal: str
    caster_nominal: Optional[str] = None
    convergencia_nominal: str


class GeometriaResponse(GeometriaCreate):
    id: int
    veiculo_id: int

    class Config:
        from_attributes = True


class VeiculoBase(BaseModel):
    fabricante: Optional[str] = None
    marca: str
    modelo: str
    ano_inicio: int
    ano_fim: Optional[int] = None


class VeiculoCreate(VeiculoBase):
    geometria: List[GeometriaCreate] = []


class VeiculoResponse(VeiculoBase):
    id: int
    geometria: List[GeometriaResponse] = []

    class Config:
        from_attributes = True
