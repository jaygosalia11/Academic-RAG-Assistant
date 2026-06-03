from fastapi import FastAPI
from app.routes.admin_routes import router as admin_router
from app.routes.chat_routes import router as chat_router

app = FastAPI()

app.include_router(admin_router)
app.include_router(chat_router)