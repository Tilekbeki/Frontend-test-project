import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadOverrides } from './registryStorage';

afterEach(() => vi.unstubAllGlobals());

describe('сохранённые карточки', () => {
  it('игнорирует повреждённые поля и недопустимые идентификаторы', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => JSON.stringify({
        1: { id: 2, name: { text: 'Ошибка' }, region: 'Москва', notes: 'Проверено' },
        120001: { name: 'Вне реестра' },
        invalid: { name: 'Неизвестный ID' },
      }),
    });

    expect(loadOverrides()).toEqual({ 1: { region: 'Москва', notes: 'Проверено' } });
  });
});
