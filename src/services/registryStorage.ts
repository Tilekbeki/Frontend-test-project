import type { Citizen, Filters } from '../models/citizen.type';
import { filterKeys, type FilterKey } from '../config/registryFilters';
import { TOTAL_CITIZENS } from './citizens';

const filterStorageKey = 'citizen-registry-filters-v1';
const overridesStorageKey = 'citizen-overrides-v1';
const citizenFields: Array<Exclude<keyof Citizen, 'id'>> = [
  'name', 'birthday', 'region', 'status', 'phone', 'email', 'address', 'snils',
  'familyStatus', 'occupation', 'citizenship', 'gender', 'education',
  'employmentType', 'preferredContact', 'benefitCategory', 'notes',
];

export function loadRegistryFilters(): { filters: Filters; active: FilterKey[] } {
  const empty = { filters: { search: '', region: '', status: '' }, active: [] as FilterKey[] };
  try {
    const saved = JSON.parse(localStorage.getItem(filterStorageKey) ?? '{}');
    const filters: Filters = { search: typeof saved.filters?.search === 'string' ? saved.filters.search : '', region: '', status: '' };
    const active = Array.isArray(saved.active) ? filterKeys.filter(key => saved.active.includes(key)) : [];
    for (const key of active) if (typeof saved.filters?.[key] === 'string') filters[key] = saved.filters[key];
    return { filters, active };
  } catch { return empty; }
}

export function saveRegistryFilters(filters: Filters, active: FilterKey[]): void {
  if (!filters.search && !active.length) localStorage.removeItem(filterStorageKey);
  else localStorage.setItem(filterStorageKey, JSON.stringify({ filters, active }));
}

export function loadOverrides(): Record<number, Partial<Citizen>> {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(overridesStorageKey) ?? '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};

    const overrides: Record<number, Partial<Citizen>> = {};
    for (const [key, value] of Object.entries(saved)) {
      const id = Number(key);
      if (!Number.isSafeInteger(id) || id < 1 || id > TOTAL_CITIZENS ||
          !value || typeof value !== 'object' || Array.isArray(value)) continue;
      const fields = value as Record<string, unknown>;
      const valid: Partial<Citizen> = {};
      for (const field of citizenFields) {
        if (typeof fields[field] === 'string') valid[field] = fields[field];
      }
      if (Object.keys(valid).length) overrides[id] = valid;
    }
    return overrides;
  } catch { return {}; }
}

export function saveOverrides(overrides: Record<number, Partial<Citizen>>): void {
  localStorage.setItem(overridesStorageKey, JSON.stringify(overrides));
}
