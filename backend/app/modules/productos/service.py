from typing import List, Optional
from decimal import Decimal
from datetime import datetime, timezone
from fastapi import HTTPException
from sqlmodel import Session, select
from app.modules.productos.models import Producto, ProductoCategoria, ProductoIngrediente
from app.modules.productos.schemas import ProductoCreate, ProductoUpdate
from app.modules.productos.unit_of_work import ProductoUnitOfWork


class ProductoService:

    def __init__(self, session: Session) -> None:
        self._session = session

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        nombre: Optional[str] = None,
        disponible: Optional[bool] = None,
        precio_min: Optional[Decimal] = None,
        precio_max: Optional[Decimal] = None,
    ) -> List[Producto]:
        with ProductoUnitOfWork(self._session) as uow:
            return uow.productos.search(
                skip=skip, limit=limit,
                nombre=nombre, disponible=disponible,
                precio_min=precio_min, precio_max=precio_max,
            )

    def get_by_id(self, producto_id: int) -> Producto:
        with ProductoUnitOfWork(self._session) as uow:
            producto = uow.productos.get_by_id(producto_id)
            if not producto or producto.deleted_at is not None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Producto con id={producto_id} no encontrado."
                )
        return producto

    def create(self, data: ProductoCreate) -> Producto:
        with ProductoUnitOfWork(self._session) as uow:
            # Verificar unicidad de nombre (reactivación si fue borrado)
            existente = uow.productos.session.exec(
                select(Producto).where(Producto.nombre == data.nombre)
            ).first()

            if existente:
                if existente.deleted_at is not None:
                    # Reactivar producto eliminado
                    existente.deleted_at = None
                    update_data = data.model_dump(
                        exclude={"categoria_ids", "ingredientes"}
                    )
                    for key, value in update_data.items():
                        setattr(existente, key, value)
                    existente.updated_at = datetime.now(timezone.utc)

                    # Limpiar links anteriores
                    for link in uow.productos.get_categorias_links(existente.id):
                        uow.productos.session.delete(link)
                    for link in uow.productos.get_ingredientes_links(existente.id):
                        uow.productos.session.delete(link)

                    # Re-crear links
                    self._attach_categorias(uow, existente, data.categoria_ids)
                    self._attach_ingredientes(uow, existente, data.ingredientes)
                    uow.productos.add(existente)
                    return existente
                else:
                    raise HTTPException(
                        status_code=409,
                        detail=f"Ya existe un producto activo con el nombre '{data.nombre}'."
                    )

            # Crear producto base
            producto_dict = data.model_dump(
                exclude={"categoria_ids", "ingredientes"}
            )
            producto = Producto(**producto_dict)
            uow.productos.add(producto)

            # Vincular categorías e ingredientes
            self._attach_categorias(uow, producto, data.categoria_ids)
            self._attach_ingredientes(uow, producto, data.ingredientes)

            uow.productos.session.flush()
            uow.productos.session.refresh(producto)
        return producto

    def update(self, producto_id: int, data: ProductoUpdate) -> Producto:
        with ProductoUnitOfWork(self._session) as uow:
            producto = uow.productos.get_by_id(producto_id)
            if not producto or producto.deleted_at is not None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Producto con id={producto_id} no encontrado."
                )

            update_data = data.model_dump(
                exclude_unset=True, exclude={"categoria_ids", "ingredientes"}
            )
            for key, value in update_data.items():
                setattr(producto, key, value)
            producto.updated_at = datetime.now(timezone.utc)

            if data.categoria_ids is not None:
                for link in uow.productos.get_categorias_links(producto_id):
                    uow.productos.session.delete(link)
                self._attach_categorias(uow, producto, data.categoria_ids)

            if data.ingredientes is not None:
                for link in uow.productos.get_ingredientes_links(producto_id):
                    uow.productos.session.delete(link)
                self._attach_ingredientes(uow, producto, data.ingredientes)

            uow.productos.add(producto)
        return producto

    def delete(self, producto_id: int) -> None:
        """Soft-delete: marca deleted_at sin borrar el registro."""
        with ProductoUnitOfWork(self._session) as uow:
            producto = uow.productos.get_by_id(producto_id)
            if not producto or producto.deleted_at is not None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Producto con id={producto_id} no encontrado."
                )
            producto.deleted_at = datetime.now(timezone.utc)
            producto.updated_at = datetime.now(timezone.utc)
            uow.productos.add(producto)

    # ── Helpers privados ──────────────────────────────────────────────────────

    def _attach_categorias(self, uow: ProductoUnitOfWork, producto: Producto, categoria_ids: list) -> None:
        """Valida y crea los vínculos ProductoCategoria."""
        ids_vistos: set = set()
        for i, cat_id in enumerate(categoria_ids):
            if cat_id in ids_vistos:
                raise HTTPException(
                    status_code=422,
                    detail=f"categoria_id={cat_id} está duplicado en la lista."
                )
            ids_vistos.add(cat_id)
            cat = uow.categorias.get_by_id(cat_id)
            if not cat or cat.deleted_at is not None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Categoría con id={cat_id} no encontrada."
                )
            link = ProductoCategoria(
                producto_id=producto.id,
                categoria_id=cat_id,
                es_principal=(i == 0),
            )
            uow.productos.session.add(link)

    def _attach_ingredientes(self, uow: ProductoUnitOfWork, producto: Producto, ingredientes_data: list) -> None:
        """Valida y crea los vínculos ProductoIngrediente."""
        ids_vistos: set = set()
        for ing_link in ingredientes_data:
            if ing_link.ingrediente_id in ids_vistos:
                raise HTTPException(
                    status_code=422,
                    detail=f"ingrediente_id={ing_link.ingrediente_id} está duplicado."
                )
            ids_vistos.add(ing_link.ingrediente_id)
            ing = uow.ingredientes.get_by_id(ing_link.ingrediente_id)
            if not ing or ing.deleted_at is not None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Ingrediente con id={ing_link.ingrediente_id} no encontrado."
                )
            link = ProductoIngrediente(
                producto_id=producto.id,
                ingrediente_id=ing_link.ingrediente_id,
                es_removible=ing_link.es_removible,
                es_opcional=ing_link.es_opcional,
            )
            uow.productos.session.add(link)
