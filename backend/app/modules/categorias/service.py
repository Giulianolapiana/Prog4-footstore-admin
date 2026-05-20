from typing import List, Optional
from datetime import datetime, timezone
from fastapi import HTTPException
from sqlmodel import Session
from app.modules.categorias.models import Categoria
from app.modules.categorias.schemas import CategoriaCreate, CategoriaUpdate
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork


class CategoriaService:

    def __init__(self, session: Session) -> None:
        self._session = session

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        nombre: Optional[str] = None,
    ) -> List[Categoria]:
        with CategoriaUnitOfWork(self._session) as uow:
            return uow.categorias.get_active(skip, limit, nombre)

    def get_by_id(self, categoria_id: int) -> Categoria:
        with CategoriaUnitOfWork(self._session) as uow:
            categoria = uow.categorias.get_by_id(categoria_id)
            if not categoria or categoria.deleted_at is not None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Categoría con id={categoria_id} no encontrada."
                )
        return categoria

    def create(self, data: CategoriaCreate) -> Categoria:
        with CategoriaUnitOfWork(self._session) as uow:
            # Validar unicidad de nombre
            existente = uow.categorias.get_by_nombre(data.nombre)
            if existente:
                if existente.deleted_at is not None:
                    # Reactivar categoría deshabilitada
                    existente.deleted_at = None
                    existente.descripcion = data.descripcion
                    existente.orden_display = data.orden_display
                    existente.updated_at = datetime.now(timezone.utc)
                    uow.categorias.add(existente)
                    return existente
                raise HTTPException(
                    status_code=409,
                    detail=f"Ya existe una categoría activa con el nombre '{data.nombre}'."
                )

            # Validar que el parent exista si se proporciona
            if data.parent_id is not None:
                parent = uow.categorias.get_by_id(data.parent_id)
                if not parent or parent.deleted_at is not None:
                    raise HTTPException(
                        status_code=404,
                        detail=f"Categoría padre con id={data.parent_id} no encontrada."
                    )

            categoria = Categoria(**data.model_dump())
            uow.categorias.add(categoria)
        return categoria

    def update(self, categoria_id: int, data: CategoriaUpdate) -> Categoria:
        with CategoriaUnitOfWork(self._session) as uow:
            categoria = uow.categorias.get_by_id(categoria_id)
            if not categoria or categoria.deleted_at is not None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Categoría con id={categoria_id} no encontrada."
                )

            # Validar unicidad si cambia el nombre
            if data.nombre and data.nombre != categoria.nombre:
                existente = uow.categorias.get_by_nombre(data.nombre)
                if existente and existente.deleted_at is None:
                    raise HTTPException(
                        status_code=409,
                        detail=f"Ya existe una categoría con el nombre '{data.nombre}'."
                    )

            update_data = data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(categoria, key, value)
            categoria.updated_at = datetime.now(timezone.utc)
            uow.categorias.add(categoria)
        return categoria

    def delete(self, categoria_id: int) -> None:
        """Soft-delete: marca deleted_at sin borrar el registro."""
        with CategoriaUnitOfWork(self._session) as uow:
            categoria = uow.categorias.get_by_id(categoria_id)
            if not categoria or categoria.deleted_at is not None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Categoría con id={categoria_id} no encontrada."
                )
            categoria.deleted_at = datetime.now(timezone.utc)
            categoria.updated_at = datetime.now(timezone.utc)
            uow.categorias.add(categoria)
