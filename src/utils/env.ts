// Environment variable helper for Vite
export const getEnvVar = (key: string): string => import.meta.env?.[key] || '';
