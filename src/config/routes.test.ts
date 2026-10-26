import { describe, expect, it } from 'vitest';
import { TOTAL_CITIZENS } from '../services/citizens';
import { parseRoute } from './routes';

describe('маршруты реестра', () => {
  it('открывает обзор, картотеку и прямую ссылку на гражданина', () => {
    expect(parseRoute('/')).toEqual({ name: 'dashboard' });
    expect(parseRoute('/citizens')).toEqual({ name: 'registry' });
    expect(parseRoute('/citizens/')).toEqual({ name: 'registry' });
    expect(parseRoute('/citizens/123')).toEqual({ name: 'citizen', id: 123 });
    expect(parseRoute(`/citizens/${TOTAL_CITIZENS}/`)).toEqual({
      name: 'citizen',
      id: TOTAL_CITIZENS,
    });
  });

  it.each([
    '/citizens/0',
    `/citizens/${TOTAL_CITIZENS + 1}`,
    '/citizens/-1',
    '/citizens/1.5',
    '/citizens/abc',
    '/citizens/1/extra',
    '/other',
  ])('отклоняет неизвестный или недопустимый путь %s', (pathname) => {
    expect(parseRoute(pathname)).toEqual({ name: 'not-found' });
  });
});
