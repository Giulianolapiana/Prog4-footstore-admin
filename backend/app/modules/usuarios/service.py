from datetime import datetime, timezone

from fastapi import HTTPException
from sqlmodel import Session

from app.core.segurity import hash_password, verify_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UsuarioCreate
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class UsuarioService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def create(self, data: UsuarioCreate) -> Usuario:
        with UsuarioUnitOfWork(self._session) as uow:
            existente = uow.usuarios.get_by_email(data.email)
            if existente and existente.deleted_at is None:
                raise HTTPException(
                    status_code=409,
                    detail=f"Ya existe un usuario activo con el email '{data.email}'."
                )

            if existente and existente.deleted_at is not None:
                existente.email = data.email
                existente.hashed_password = hash_password(data.password)
                existente.role = data.role
                existente.is_active = data.is_active
                existente.deleted_at = None
                existente.updated_at = datetime.now(timezone.utc)
                uow.usuarios.add(existente)
                return existente

            usuario = Usuario(
                email=data.email,
                hashed_password=hash_password(data.password),
                role=data.role,
                is_active=data.is_active,
            )
            uow.usuarios.add(usuario)
        return usuario

    def authenticate(self, email: str, password: str) -> Usuario | None:
        with UsuarioUnitOfWork(self._session) as uow:
            usuario = uow.usuarios.get_by_email(email)
            if not usuario or usuario.deleted_at is not None:
                return None
            if not verify_password(password, usuario.hashed_password):
                return None
            return usuario
