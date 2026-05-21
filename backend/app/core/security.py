from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, HTTPException, status, Request, Response
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlmodel import Session

from app.core.config import settings
from app.core.database import get_session
# Asegurate de que esto apunte a tu modelo de usuario correcto más adelante
from app.modules.usuarios.repository import UsuarioRepository

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)

class AuthenticatedUser(BaseModel):
    id: int
    email: str
    roles: list[str]  # Cambiamos un solo 'role' por una lista de roles (RBAC)
    is_active: bool

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

# --- MANEJO DE COOKIES HTTPONLY ---
def set_auth_cookie(response: Response, token: str):
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,           # Fundamental para aprobar
        secure=False,            # False en dev, True en prod con HTTPS
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )

def clear_auth_cookie(response: Response):
    response.delete_cookie(key="access_token", path="/")

# --- DEPENDENCIAS DE AUTH Y ROLES ---
def get_current_user(
    request: Request,
    session: Annotated[Session, Depends(get_session)],
) -> AuthenticatedUser:
    
    # 1. Leer el token desde la cookie, NO desde el header
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="No autenticado. Falla la cookie.")

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expirado o inválido")

    usuario = UsuarioRepository(session).get_by_email(email)
    if not usuario or usuario.deleted_at is not None or not usuario.is_active:
        raise HTTPException(status_code=401, detail="Usuario no válido o inactivo")

    # Extraemos los códigos de los roles para pasarlos al frontend
    user_roles = [r.codigo for r in usuario.roles] if hasattr(usuario, 'roles') else []

    return AuthenticatedUser(
        id=usuario.id,
        email=usuario.email,
        roles=user_roles,
        is_active=usuario.is_active,
    )

def require_roles(*roles_requeridos: str):
    """Dependency para proteger rutas según el rol (RBAC)"""
    def dependency(current_user: Annotated[AuthenticatedUser, Depends(get_current_user)]) -> AuthenticatedUser:
        user_roles = set(current_user.roles)
        # Chequea si el usuario tiene al menos uno de los roles requeridos
        if not user_roles.intersection(set(roles_requeridos)):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permisos insuficientes. Se requiere alguno de: {roles_requeridos}"
            )
        return current_user
    return Depends(dependency)
