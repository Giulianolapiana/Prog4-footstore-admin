from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from app.core.database import get_session
from app.core.segurity import (
    AuthenticatedUser,
    create_access_token,
    get_current_active_user,
)
from app.modules.usuarios.service import UsuarioService

router = APIRouter(tags=["Auth"])

SessionDep = Annotated[Session, Depends(get_session)]


def get_usuario_service(session: SessionDep) -> UsuarioService:
    return UsuarioService(session)


@router.post("/token", summary="Obtener JWT")
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    svc: UsuarioService = Depends(get_usuario_service),
):
    usuario = svc.authenticate(form_data.username, form_data.password)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": usuario.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get(
    "/me",
    response_model=AuthenticatedUser,
    summary="Usuario autenticado actual",
)
def read_users_me(
    current_user: Annotated[AuthenticatedUser, Depends(get_current_active_user)],
):
    return current_user
