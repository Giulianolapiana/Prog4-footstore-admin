from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UsuarioBase(BaseModel):
    email: EmailStr
    role: Literal["admin", "user"] = "user"
    is_active: bool = True


class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=8, max_length=128)


class UsuarioUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(default=None, min_length=8, max_length=128)
    role: Optional[Literal["admin", "user"]] = None
    is_active: Optional[bool] = None


class UsuarioResponse(UsuarioBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
