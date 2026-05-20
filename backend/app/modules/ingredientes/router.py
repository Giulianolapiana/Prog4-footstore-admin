from typing import List, Optional, Annotated
from fastapi import APIRouter, Depends, Query, Path, status
from sqlmodel import Session
from app.core.database import get_session
from app.modules.ingredientes.schemas import IngredienteCreate, IngredienteUpdate, IngredienteResponse
from app.modules.ingredientes.service import IngredienteService

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])

SessionDep = Annotated[Session, Depends(get_session)]
SkipDep    = Annotated[int, Query(ge=0, description="Registros a omitir")]
LimitDep   = Annotated[int, Query(ge=1, le=100, description="Máximo de registros")]


def get_ingrediente_service(session: SessionDep) -> IngredienteService:
    return IngredienteService(session)


@router.get("/", response_model=List[IngredienteResponse], summary="Listar ingredientes")
def get_ingredientes(
    skip: SkipDep = 0,
    limit: LimitDep = 20,
    nombre: Annotated[
        Optional[str],
        Query(min_length=1, description="Filtrar por nombre")
    ] = None,
    solo_alergenos: Annotated[
        Optional[bool],
        Query(description="true = solo alérgenos, false = solo no alérgenos")
    ] = None,
    svc: IngredienteService = Depends(get_ingrediente_service),
):
    return svc.get_all(skip=skip, limit=limit, nombre=nombre, solo_alergenos=solo_alergenos)


@router.get("/{ingrediente_id}", response_model=IngredienteResponse, summary="Obtener ingrediente por ID")
def get_ingrediente(
    ingrediente_id: Annotated[int, Path(ge=1, description="ID del ingrediente")],
    svc: IngredienteService = Depends(get_ingrediente_service),
):
    return svc.get_by_id(ingrediente_id)


@router.post(
    "/",
    response_model=IngredienteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear ingrediente",
)
def create_ingrediente(
    data: IngredienteCreate,
    svc: IngredienteService = Depends(get_ingrediente_service),
):
    return svc.create(data)


@router.put(
    "/{ingrediente_id}",
    response_model=IngredienteResponse,
    summary="Actualizar ingrediente",
)
def update_ingrediente(
    ingrediente_id: Annotated[int, Path(ge=1)],
    data: IngredienteUpdate,
    svc: IngredienteService = Depends(get_ingrediente_service),
):
    return svc.update(ingrediente_id, data)


@router.delete(
    "/{ingrediente_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar ingrediente (soft-delete)",
)
def delete_ingrediente(
    ingrediente_id: Annotated[int, Path(ge=1)],
    svc: IngredienteService = Depends(get_ingrediente_service),
):
    svc.delete(ingrediente_id)
