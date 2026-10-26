import dayjs from 'dayjs';

export const formatNumber = (n: number) => new Intl.NumberFormat('ru-RU').format(n);
export const prettyDate = (value: string) => dayjs(value).format('DD.MM.YYYY');
export const statusClass = (status: string) =>
  status === 'Проверен' ? 'verified' : status === 'На проверке' ? 'pending' : 'attention';
export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
export const avatarUrl = (id: number) =>
  `https://api.dicebear.com/10.x/lorelei/svg?seed=${id}`;
