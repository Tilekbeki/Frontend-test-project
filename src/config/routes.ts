import { TOTAL_CITIZENS } from '../services/citizens';
import { PAGES } from './pages.config';

export type AppRoute =
  | { name: 'dashboard' }
  | { name: 'registry' }
  | { name: 'citizen'; id: number }
  | { name: 'not-found' };

export function parseRoute(pathname: string): AppRoute {
  if (pathname === PAGES.dashboard) return { name: 'dashboard' };
  if (pathname === PAGES.registry || pathname === `${PAGES.registry}/`) return { name: 'registry' };

  const tail = pathname.startsWith(`${PAGES.registry}/`) ? pathname.slice(PAGES.registry.length + 1) : '';
  const match = /^([0-9]+)\/?$/.exec(tail);
  if (!match) return { name: 'not-found' };

  const id = Number(match[1]);
  return Number.isSafeInteger(id) && id >= 1 && id <= TOTAL_CITIZENS
    ? { name: 'citizen', id }
    : { name: 'not-found' };
}
