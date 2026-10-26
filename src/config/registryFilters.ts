export type FilterKey = 'region' | 'status' | 'gender' | 'education';

export const filterLabels: Record<FilterKey, string> = {
  region: 'Регион',
  status: 'Статус',
  gender: 'Пол',
  education: 'Образование',
};

export const filterKeys = Object.keys(filterLabels) as FilterKey[];
