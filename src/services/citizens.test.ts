import { describe, expect, it } from 'vitest';
import {
  citizenAt,
  matchingIds,
  pageOfCitizens,
  registryStats,
  TOTAL_CITIZENS,
} from './citizens';

describe('каталог граждан', () => {
  it('строит страницы без создания всех записей в памяти', () => {
    expect(matchingIds({ search: '', region: '', status: '' })).toBeNull();
    expect(pageOfCitizens(null, 6000, 20)).toHaveLength(20);
    expect(pageOfCitizens(null, 6000, 20)[19].id).toBe(TOTAL_CITIZENS);
    expect(citizenAt(1).id).toBe(1);
  });
  it('совмещает поиск и фильтры', () => {
    const target = citizenAt(123);
    const ids = matchingIds({
      search: '123',
      region: target.region,
      status: target.status,
      gender: target.gender,
      education: target.education,
    });
    expect(ids).toContain(123);
    expect(
      matchingIds({
        search: '123',
        region: target.region,
        status: target.status,
        gender: target.gender === 'Мужской' ? 'Женский' : 'Мужской',
      }),
    ).not.toContain(123);
    expect(matchingIds({ search: 'нет такого имени', region: '', status: '' })).toEqual(
      [],
    );
  });
  it('согласует имена и показатели с изменёнными карточками', () => {
    const first = citizenAt(1);
    const second = citizenAt(2);
    expect(first.gender).toBe('Мужской');
    expect(first.name.split(' ')[1]).toBe('Илья');
    expect(second.gender).toBe('Женский');
    expect(second.name.split(' ')[0].endsWith('а')).toBe(true);

    const before = registryStats();
    const after = registryStats({ 1: { region: 'Москва', status: 'Требует уточнения' } });
    expect(Object.values(before.byRegion).reduce((sum, count) => sum + count, 0)).toBe(
      TOTAL_CITIZENS,
    );
    expect(Object.values(after.byStatus).reduce((sum, count) => sum + count, 0)).toBe(
      TOTAL_CITIZENS,
    );
    expect(after.byRegion[first.region]).toBe(
      before.byRegion[first.region] - Number(first.region !== 'Москва'),
    );
    expect(after.byStatus['Требует уточнения']).toBe(
      before.byStatus['Требует уточнения'] + Number(first.status !== 'Требует уточнения'),
    );
  });
});
