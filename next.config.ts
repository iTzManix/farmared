import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "26.221.13.33", // IP conocida (ej: Compañero 1)
    "26.134.31.38", // REEMPLAZAR con la IP de Hamachi/Radmin del Compañero 2
    "26.132.12.209", // REEMPLAZAR con la IP de Hamachi/Radmin del Compañero 3
    "localhost",
  ],
};

export default nextConfig;
