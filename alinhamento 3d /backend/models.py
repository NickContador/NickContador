from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Veiculo(Base):
    __tablename__ = "veiculos"

    id = Column(Integer, primary_key=True, index=True)
    fabricante = Column(String, index=True)
    marca = Column(String, index=True, nullable=False)
    modelo = Column(String, index=True, nullable=False)
    ano_inicio = Column(Integer, nullable=False)
    ano_fim = Column(Integer, nullable=True)

    geometria = relationship("GeometriaSuspensao", back_populates="veiculo", cascade="all, delete")


class GeometriaSuspensao(Base):
    __tablename__ = "geometria_suspensao"

    id = Column(Integer, primary_key=True, index=True)
    veiculo_id = Column(Integer, ForeignKey("veiculos.id"), nullable=False)
    eixo = Column(String, nullable=False)
    camber_nominal = Column(String)
    caster_nominal = Column(String)
    convergencia_nominal = Column(String)

    veiculo = relationship("Veiculo", back_populates="geometria")
