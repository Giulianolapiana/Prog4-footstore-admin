from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.core.database import get_session
from app.core.segurity import AuthenticatedUser, get_current_active_user
from app.modules.usuarios.schemas import UsuarioCreate, UsuarioResponse
from app.modules.usuarios.service import UsuarioService

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

SessionDep = Annotated[Session, Depends(get_session)]


def get_usuario_service(session: SessionDep) -> UsuarioService:
    return UsuarioService(session)


@router.post(
    "/",
    response_model=UsuarioResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear usuario",
)
def create_usuario(
    data: UsuarioCreate,
    svc: UsuarioService = Depends(get_usuario_service),
):
    return svc.create(data)


@router.get(
    "/me",
    response_model=AuthenticatedUser,
    summary="Obtener usuario autenticado actual",
)
def get_usuario_me(
    current_user: Annotated[AuthenticatedUser, Depends(get_current_active_user)],
):
    return current_user
