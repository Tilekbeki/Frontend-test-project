export const PAGES = {
  dashboard: '/',
  registry: '/citizens',
  citizen: (id: number) => `/citizens/${id}`,
} as const;
