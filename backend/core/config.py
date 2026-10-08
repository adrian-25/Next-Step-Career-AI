from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    # Optional for browser-fallback deployments. Set this in Render to enable
    # resume history, search, analytics, and backup endpoints.
    DATABASE_URL: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_KEY: str = ""

    # Auth
    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS
    # Comma-separated to support Render's direct service-URL injection.
    ALLOWED_ORIGINS: str = (
        "http://localhost:8080,"
        "http://localhost:3000,"
        "https://next-step-career-ai.vercel.app"
    )

    # ML
    MODEL_CACHE_DIR: str = "./ml/models"
    MAX_RESUME_SIZE_MB: int = 10

    # Redis (optional caching)
    REDIS_URL: str = "redis://localhost:6379"

    class Config:
        env_file = ".env"

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]


settings = Settings()
