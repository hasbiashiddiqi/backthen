export const env = {
  PORT: Number(process.env.PORT || 3000),
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_HOST: process.env.DATABASE_HOST || "127.0.0.1",
  DATABASE_PORT: Number(process.env.DATABASE_PORT || 3306),
  DATABASE_USER: process.env.DATABASE_USER || "root",
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "",
  DATABASE_NAME: process.env.DATABASE_NAME || "backthen_db",
};
