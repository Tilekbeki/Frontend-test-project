import { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { citizenAt, matchingIds, pageOfCitizens, TOTAL_CITIZENS } from '../services/citizens';
import type { Citizen, Filters } from '../models/citizen.type';
import type { FilterKey } from '../config/registryFilters';
import { PAGES } from '../config/pages.config';
import { loadOverrides, loadRegistryFilters, saveOverrides, saveRegistryFilters } from '../services/registryStorage';
import { parseRoute, type AppRoute } from '../config/routes';

export function useCitizenRegistry() {
  const [route, setRoute] = useState<AppRoute>(() => parseRoute(window.location.pathname));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [overrides, setOverrides] = useState<Record<number, Partial<Citizen>>>(loadOverrides);
  const [savedFilters] = useState(loadRegistryFilters);
  const [filters, setFilters] = useState<Filters>(savedFilters.filters);
  const [activeFilters, setActiveFilters] = useState<FilterKey[]>(savedFilters.active);
  const [searchDraft, setSearchDraft] = useState(savedFilters.filters.search);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileMenuOpen(false); };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const timer = window.setTimeout(() => setFilters(current => current.search === searchDraft ? current : { ...current, search: searchDraft }), 350);
    return () => window.clearTimeout(timer);
  }, [searchDraft]);
  useEffect(() => {
    try {
      saveRegistryFilters(filters, activeFilters);
    } catch { message.error('Не удалось сохранить фильтры в браузере'); }
  }, [filters, activeFilters]);

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseRoute(window.location.pathname));
      setEditing(false);
      setMobileMenuOpen(false);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const ids = useMemo(() => matchingIds(filters, overrides), [filters, overrides]);
  const total = ids?.length ?? TOTAL_CITIZENS;
  const rows = useMemo(() => pageOfCitizens(ids, page, size, overrides), [ids, page, size, overrides]);
  const selected = route.name === 'citizen' ? { ...citizenAt(route.id), ...overrides[route.id] } : null;
  useEffect(() => {
    document.title = route.name === 'citizen' ? `${selected?.name} — Контур`
      : route.name === 'registry' ? 'Картотека граждан — Контур'
      : route.name === 'dashboard' ? 'Обзор реестра — Контур'
      : 'Страница не найдена — Контур';
  }, [route.name, route.name === 'citizen' ? route.id : undefined, selected?.name]);

  const navigate = (path: string, replace = false, state: object | null = null) => {
    if (window.location.pathname !== path) {
      if (replace) window.history.replaceState(state, '', path);
      else window.history.pushState(state, '', path);
    }
    setRoute(parseRoute(path));
    setEditing(false);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };
  const openCitizen = (id: number) => navigate(PAGES.citizen(id), false, { fromRegistry: true });
  const backToRegistry = () => {
    if (window.history.state?.fromRegistry === true) window.history.back();
    else navigate(PAGES.registry, true);
  };
  const changeFilters = (next: Partial<Filters>) => { setFilters(current => ({ ...current, ...next })); setPage(1); };
  const addFilter = (key: FilterKey) => setActiveFilters(current => current.includes(key) ? current : [...current, key]);
  const removeFilter = (key: FilterKey) => { setActiveFilters(current => current.filter(item => item !== key)); changeFilters({ [key]: '' }); };
  const resetFilters = () => { setSearchDraft(''); setFilters({ search: '', region: '', status: '' }); setActiveFilters([]); setPage(1); };
  const saveCitizen = (value: Citizen) => {
    const next = { ...overrides, [value.id]: value };
    try {
      saveOverrides(next);
      setOverrides(next);
      const nextTotal = matchingIds(filters, next)?.length ?? TOTAL_CITIZENS;
      setPage(current => Math.min(current, Math.max(1, Math.ceil(nextTotal / size))));
      setEditing(false);
      message.success('Карточка сохранена');
    } catch {
      message.error('Не удалось сохранить карточку в браузере');
    }
  };
  return {
    route, mobileMenuOpen, setMobileMenuOpen, overrides, filters, activeFilters,
    searchDraft, setSearchDraft, page, setPage, size, setSize, editing, setEditing,
    rows, total, selected, navigate, openCitizen, backToRegistry,
    changeFilters, addFilter, removeFilter, resetFilters, saveCitizen,
  };
}
