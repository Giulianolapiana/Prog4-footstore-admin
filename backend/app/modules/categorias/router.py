from typing import List, Optional, Annotated
from fastapi import APIRouter, Depends, Query, Path, status
from sqlmodel import Session
from app.core.database import get_session
from app.modules.categorias.schemas import CategoriaCreate, CategoriaUpdate, CategoriaResponse
from app.modules.categorias.service import CategoriaService

router = APIRouter(prefix="/categorias", tags=["Categorías"])

# Tipos reutilizables con Annotated
SessionDep = Annotated[Session, Depends(get_session)]
SkipDep    = Annotated[int, Query(ge=0, description="Registros a omitir")]
LimitDep   = Annotated[int, Query(ge=1, le=100, description="Máximo de registros")]


def get_categoria_service(session: SessionDep) -> CategoriaService:
    """Factory de dependencia: inyecta el servicio con su Session."""
    return CategoriaService(session)


@router.get("/", response_model=List[CategoriaResponse], summary="Listar categorías")
def get_categorias(
    skip: SkipDep = 0,
    limit: LimitDep = 20,
    nombre: Annotated[
        Optional[str],
        Query(min_length=1, description="Filtrar por nombre (parcial)")
    ] = None,
    svc: CategoriaService = Depends(get_categoria_service),
):
    return svc.get_all(skip=skip, limit=limit, nombre=nombre)


@router.get("/{categoria_id}", response_model=CategoriaResponse, summary="Obtener categoría por ID")
def get_categoria(
    categoria_id: Annotated[int, Path(ge=1, description="ID de la categoría")],
    svc: CategoriaService = Depends(get_categoria_service),
):
    return svc.get_by_id(categoria_id)


@router.post(
    "/",
    response_model=CategoriaResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear categoría",
)
def create_categoria(
    data: CategoriaCreate,
    svc: CategoriaService = Depends(get_categoria_service),
):
    return svc.create(data)


@router.put(
    "/{categoria_id}",
    response_model=CategoriaResponse,
    summary="Actualizar categoría",
)
def update_categoria(
    categoria_id: Annotated[int, Path(ge=1)],
    data: CategoriaUpdate,
    svc: CategoriaService = Depends(get_categoria_service),
):
    return svc.update(categoria_id, data)


@router.delete(
    "/{categoria_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar categoría (soft-delete)",
)
def delete_categoria(
    categoria_id: Annotated[int, Path(ge=1)],
    svc: CategoriaService = Depends(get_categoria_service),
):
    svc.delete(categoria_id)
