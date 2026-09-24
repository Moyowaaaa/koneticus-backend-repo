const DEFAULT_ORIGINS = [
  process.env.LOCALHOST3K   || '',
  process.env.LOCALHOST3K1  || '',
  process.env.PRODUCTIONURL || '',
  process.env.NETLIFYURL    || '',
  process.env.BETAURL       || '',
  process.env.WAITLISTURL      || '',
];



const extraOrigins =
  process.env.CORS_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

const normalizeOrigin = (origin: string) => origin.replace(/\/$/, "");

export const allowedOrigins = [...DEFAULT_ORIGINS, ...extraOrigins].map(
  normalizeOrigin,
);

export const isAllowedOrigin = (origin?: string) => {
  if (!origin) return true;
  return allowedOrigins.includes(normalizeOrigin(origin));
};
