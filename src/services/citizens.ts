import type { Citizen, Filters } from '../models/citizen.type';

export const TOTAL_CITIZENS = 120_000;
export const regions = ['Москва', 'Санкт-Петербург', 'Московская область', 'Татарстан', 'Краснодарский край', 'Новосибирская область'];
export const statuses = ['Проверен', 'На проверке', 'Требует уточнения'];
const surnames = ['Иванов', 'Петров', 'Смирнов', 'Кузнецов', 'Попов', 'Соколов', 'Новиков', 'Морозов', 'Волков', 'Фёдоров', 'Михайлов', 'Орлов'];
const maleNames = ['Александр', 'Дмитрий', 'Сергей', 'Максим', 'Андрей', 'Илья'];
const femaleNames = ['Мария', 'Анна', 'Елена', 'Ольга', 'Наталья', 'Алина'];
const malePatronymics = ['Александрович', 'Иванович', 'Петрович', 'Сергеевич', 'Андреевич', 'Викторович'];
const femalePatronymics = ['Александровна', 'Ивановна', 'Петровна', 'Сергеевна', 'Андреевна', 'Викторовна'];

const regionFor = (id: number) => {
  const bucket = (id * 37) % 100;
  return regions[bucket < 25 ? 0 : bucket < 45 ? 1 : bucket < 63 ? 2 : bucket < 78 ? 3 : bucket < 90 ? 4 : 5];
};
const statusFor = (id: number) => {
  const bucket = (id * 43) % 100;
  return statuses[bucket < 62 ? 0 : bucket < 88 ? 1 : 2];
};


export function citizenAt(id: number): Citizen {
  if (!Number.isInteger(id) || id < 1 || id > TOTAL_CITIZENS) throw new RangeError('Неверный ID гражданина');
  const isMale = id % 2 === 1;
  const surname = surnames[(id * 7 + Math.floor(id / 11)) % surnames.length];
  const s = isMale ? surname : `${surname}а`;
  const n = (isMale ? maleNames : femaleNames)[(id * 5 + Math.floor(id / 3)) % maleNames.length];
  const p = (isMale ? malePatronymics : femalePatronymics)[(id * 11 + Math.floor(id / 7)) % malePatronymics.length];
  const yyyy = 1968 + id % 41;
  const mm = String(1 + id % 12).padStart(2, '0');
  const dd = String(1 + id % 28).padStart(2, '0');
  return {
    id,
    name: `${s} ${n} ${p}`,
    birthday: `${yyyy}-${mm}-${dd}`,
    region: regionFor(id),
    status: statusFor(id),
    phone: `+7 9${String(100000000 + id).slice(0, 2)} ${String(1000000 + id).slice(-3)}-${String(id % 100).padStart(2, '0')}-${String((id * 3) % 100).padStart(2, '0')}`,
    email: `citizen${id}@example.test`,
    address: `ул. Центральная, д. ${1 + id % 90}, кв. ${1 + id % 120}`,
    snils: `${String(100000000 + id).slice(-3)}-${String(200000000 + id).slice(-3)}-${String(300000000 + id).slice(-3)} ${String(id % 100).padStart(2, '0')}`,
    familyStatus: id % 3 === 0 ? 'В браке' : 'Не состоит в браке',
    occupation: ['Специалист', 'Инженер', 'Преподаватель', 'Предприниматель'][id % 4],
    citizenship: 'Российская Федерация',
    gender: isMale ? 'Мужской' : 'Женский',
    education: ['Высшее', 'Среднее специальное', 'Среднее'][id % 3],
    employmentType: ['Полная занятость', 'Частичная занятость', 'Самозанятость'][id % 3],
    preferredContact: id % 2 ? 'Телефон' : 'Электронная почта',
    benefitCategory: id % 7 === 0 ? 'Есть льготы' : 'Без льгот',
    notes: '',
  };
}

export function registryStats(overrides: Record<number, Partial<Citizen>> = {}) {
  const byRegion: Record<string, number> = Object.fromEntries(regions.map(region => [region, 0]));
  const byStatus: Record<string, number> = Object.fromEntries(statuses.map(status => [status, 0]));

  for (let id = 1; id <= TOTAL_CITIZENS; id++) {
    const region = overrides[id]?.region ?? regionFor(id);
    const status = overrides[id]?.status ?? statusFor(id);
    byRegion[region] = (byRegion[region] ?? 0) + 1;
    byStatus[status] = (byStatus[status] ?? 0) + 1;
  }

  return { byRegion, byStatus };
}

export function matchingIds(filters: Filters, overrides: Record<number, Partial<Citizen>> = {}): number[] | null {
  const search = filters.search.trim().toLocaleLowerCase('ru');
  if (!search && !filters.region && !filters.status && !filters.gender && !filters.education) return null;
  const ids: number[] = [];
  for (let id = 1; id <= TOTAL_CITIZENS; id++) {
    const citizen = { ...citizenAt(id), ...overrides[id] };
    if (filters.region && citizen.region !== filters.region) continue;
    if (filters.status && citizen.status !== filters.status) continue;
    if (filters.gender && citizen.gender !== filters.gender) continue;
    if (filters.education && citizen.education !== filters.education) continue;
    if (search && !`${citizen.name} ${citizen.id}`.toLocaleLowerCase('ru').includes(search)) continue;
    ids.push(id);
  }
  return ids;
}

export function pageOfCitizens(ids: number[] | null, page: number, size: number, overrides: Record<number, Partial<Citizen>> = {}): Citizen[] {
  const start = (page - 1) * size;
  const count = ids ? ids.length : TOTAL_CITIZENS;
  const end = Math.min(start + size, count);
  const rows: Citizen[] = [];
  for (let index = start; index < end; index++) {
    const id = ids ? ids[index] : index + 1;
    rows.push({ ...citizenAt(id), ...overrides[id] });
  }
  return rows;
}
