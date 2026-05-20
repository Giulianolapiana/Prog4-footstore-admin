from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import create_db_and_tables

# Routers modulares
from app.modules.categorias.router import router as router_categorias
from app.modules.ingredientes.router import router as router_ingredientes
from app.modules.productos.router import router as router_productos
from app.modules.auth.router import router as router_auth
from app.modules.usuarios.router import router as router_usuarios


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crea las tablas en la base de datos si no existen
    create_db_and_tables()
    yield


app = FastAPI(
    title="Sistema de Pedidos — API",
    description=(
        "API REST para gestión de productos, categorías e ingredientes.\n\n"
        "**Stack:** FastAPI + SQLModel + PostgreSQL\n\n"
        "**Parcial 1 — Programación IV · UTN**"
    ),
    version="5.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(router_categorias)
app.include_router(router_ingredientes)
app.include_router(router_productos)
app.include_router(router_auth)
app.include_router(router_usuarios)


# ── Manejador de errores de validación de Pydantic ────────────────────────────
# Traduce los mensajes automáticos de FastAPI al español
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        err_type = error.get("type")
        message = error.get("msg")

        # Mapeo de errores comunes → español
        if err_type == "missing":
            message = "Este campo es obligatorio"
        elif err_type == "string_too_long":
            ctx = error.get("ctx", {})
            limit = ctx.get("max_length") or ctx.get("limit_value") or 150
            message = f"El texto es demasiado largo (máximo {limit} caracteres)"
        elif err_type == "string_too_short":
            ctx = error.get("ctx", {})
            limit = ctx.get("min_length") or ctx.get("limit_value") or 2
            message = f"El texto es demasiado corto (mínimo {limit} caracteres)"
        elif "greater_than" in (err_type or ""):
            limit = error.get("ctx", {}).get("limit_value") or error.get("ctx", {}).get("gt")
            message = f"El valor debe ser mayor a {limit}"
        elif "less_than" in (err_type or ""):
            limit = error.get("ctx", {}).get("limit_value") or error.get("ctx", {}).get("lt")
            message = f"El valor debe ser menor a {limit}"

        errors.append({
            "loc": error.get("loc"),
            "msg": message,
            "type": err_type,
        })

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": errors},
    )


@app.get("/", tags=["Root"], summary="Health check")
def read_root():
    return {"status": "ok", "message": "API Sistema de Pedidos funcionando 🚀"}
