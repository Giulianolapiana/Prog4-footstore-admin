from typing import Optional, List, TYPE_CHECKING
from decimal import Decimal
from datetime import datetime, timezone
from sqlalchemy import JSON
from sqlmodel import SQLModel, Field, Relationship, Column, DECIMAL

if TYPE_CHECKING:
    from app.modules.categorias.models import Categoria
    from app.modules.ingredientes.models import Ingrediente


class ProductoCategoria(SQLModel, table=True):
    """Tabla de asociación N:N entre Producto y Categoría."""
    __tablename__ = "producto_categoria"

    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    categoria_id: int = Field(foreign_key="categoria.id", primary_key=True)
    es_principal: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProductoIngrediente(SQLModel, table=True):
    """Tabla de asociación N:N entre Producto e Ingrediente."""
    __tablename__ = "producto_ingrediente"

    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    ingrediente_id: int = Field(foreign_key="ingrediente.id", primary_key=True)
    es_removible: bool = Field(default=True, nullable=False)
    es_opcional: bool = Field(default=False, nullable=False)


class Producto(SQLModel, table=True):
    """
    Tabla principal de productos del sistema de pedidos.
    Relacionado N:N con Categoria e Ingrediente a través de tablas de enlace.
    """
    __tablename__ = "producto"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=150, nullable=False)
    descripcion: Optional[str] = Field(default=None)
    stock_cantidad: int = Field(default=0, nullable=False, ge=0)
    precio_base: Decimal = Field(sa_column=Column(DECIMAL(10, 2), nullable=False), ge=0)
    imagenes_url: Optional[List[str]] = Field(default=[], sa_column=Column(JSON))
    disponible: bool = Field(default=True, nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deleted_at: Optional[datetime] = Field(default=None)

    # Relaciones N:M directas (usando link_model)
    categorias: List["Categoria"] = Relationship(
        back_populates="productos",
        link_model=ProductoCategoria
    )
    ingredientes: List["Ingrediente"] = Relationship(
        back_populates="productos",
        link_model=ProductoIngrediente
    )
