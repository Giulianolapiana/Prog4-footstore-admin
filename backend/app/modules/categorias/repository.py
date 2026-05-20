from typing import List, Optional
from sqlmodel import Session, select, col
from app.core.repository import BaseRepository
from app.modules.categorias.models import Categoria


class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Categoria)

    def get_active(
        self,
        skip: int = 0,
        limit: int = 100,
        nombre: Optional[str] = None,
    ) -> List[Categoria]:
        query = select(Categoria).where(Categoria.deleted_at.is_(None))
        if nombre:
            query = query.where(col(Categoria.nombre).icontains(nombre))
        query = query.order_by(Categoria.orden_display).offset(skip).limit(limit)
        return self.session.exec(query).all()

    def get_by_nombre(self, nombre: str) -> Categoria | None:
        return self.session.exec(
            select(Categoria).where(Categoria.nombre == nombre)
        ).first()
