from decimal import Decimal
from typing import List, Optional, Annotated
from fastapi import APIRouter, Depends, Query, Path, status
from sqlmodel import Session
from app.core.database import get_session
from app.modules.productos.schemas import ProductoCreate, ProductoUpdate, ProductoResponse
from app.modules.productos.service import ProductoService

router = APIRouter(prefix="/productos", tags=["Productos"])

SessionDep = Annotated[Session, Depends(get_session)]
SkipDep    = Annotated[int, Query(ge=0, description="Registros a omitir (paginación)")]
LimitDep   = Annotated[int, Query(ge=1, le=100, description="Máximo de registros por página")]


def get_producto_service(session: SessionDep) -> ProductoService:
    """Factory de dependencia: inyecta el servicio con su Session."""
    return ProductoService(session)


@router.get("/", response_model=List[ProductoResponse], summary="Listar productos con filtros y paginación")
def get_productos(
    skip: SkipDep = 0,
    limit: LimitDep = 20,
    nombre: Annotated[
        Optional[str],
        Query(min_length=1, description="Filtrar por nombre (parcial)")
    ] = None,
    disponible: Annotated[
        Optional[bool],
        Query(description="Filtrar por disponibilidad")
    ] = None,
    precio_min: Annotated[
        Optional[Decimal],
        Query(ge=0, description="Precio mínimo")
    ] = None,
    precio_max: Annotated[
        Optional[Decimal],
        Query(ge=0, description="Precio máximo")
    ] = None,
    svc: ProductoService = Depends(get_producto_service),
):
    return svc.get_all(
        skip=skip, limit=limit,
        nombre=nombre, disponible=disponible,
        precio_min=precio_min, precio_max=precio_max,
    )


@router.get(
    "/{producto_id}",
    response_model=ProductoResponse,
    summary="Obtener producto por ID con categorías e ingredientes",
)
def get_producto(
    producto_id: Annotated[int, Path(ge=1, description="ID del producto")],
    svc: ProductoService = Depends(get_producto_service),
):
    return svc.get_by_id(producto_id)


@router.post(
    "/",
    response_model=ProductoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear producto con categorías e ingredientes",
)
def create_producto(
    data: ProductoCreate,
    svc: ProductoService = Depends(get_producto_service),
):
    return svc.create(data)


@router.put(
    "/{producto_id}",
    response_model=ProductoResponse,
    summary="Actualizar producto",
)
def update_producto(
    producto_id: Annotated[int, Path(ge=1)],
    data: ProductoUpdate,
    svc: ProductoService = Depends(get_producto_service),
):
    return svc.update(producto_id, data)


@router.delete(
    "/{producto_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar producto (soft-delete)",
)
def delete_producto(
    producto_id: Annotated[int, Path(ge=1)],
    svc: ProductoService = Depends(get_producto_service),
):
    svc.delete(producto_id)
