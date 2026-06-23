declare module "bun" {
  interface Env {
    DB_URL: string;
    JWT_SECRET: string;
    COOKIE_DOMAIN: string;
    FRONTEND_ORIGIN: string;
  }
}
