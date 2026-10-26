import type { ReactNode } from 'react';
import { IdcardFilled } from '@ant-design/icons';
import { PAGES } from '../config/pages.config';
import type { AppRoute } from '../config/routes';

export interface RegistryLayoutProps {
  route: AppRoute;
  selectedName?: string;
  mobileMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onNavigate: (path: string) => void;
  children: ReactNode;
}

export function RegistryLayout({ route, selectedName, mobileMenuOpen, onToggleMenu, onCloseMenu, onNavigate, children }: RegistryLayoutProps) {
  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="brand">
        <span className="brand-mark" aria-hidden="true"><IdcardFilled /></span>
        <div className="brand-copy">Админка<small>Реестра граждан</small></div>
      </div>
      <button className="menu-toggle" type="button" aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-controls="citizen-main-nav" aria-expanded={mobileMenuOpen} onClick={() => onToggleMenu()}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">{mobileMenuOpen ? <path d="M5 5 19 19M19 5 5 19" /> : <path d="M4 6h16M4 12h16M4 18h16" />}</svg>
      </button>
      <nav id="citizen-main-nav" aria-label="Основные разделы">
        <button className={`nav-link ${route.name === 'dashboard' ? 'active' : ''}`} onClick={() => onNavigate(PAGES.dashboard)} aria-current={route.name === 'dashboard' ? 'page' : undefined}>
          <svg className="nav-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2.75" y="2.75" width="6" height="6" rx="1" /><rect x="11.25" y="2.75" width="6" height="6" rx="1" /><rect x="2.75" y="11.25" width="6" height="6" rx="1" /><rect x="11.25" y="11.25" width="6" height="6" rx="1" /></svg>
          Обзор
        </button>
        <button className={`nav-link ${route.name === 'registry' || route.name === 'citizen' ? 'active' : ''}`} onClick={() => onNavigate(PAGES.registry)} aria-current={route.name === 'registry' ? 'page' : undefined}>
          <svg className="nav-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6.5 8.75a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5ZM2.75 16.75v-1.5a3.75 3.75 0 0 1 3.75-3.75h1a3.75 3.75 0 0 1 3.75 3.75v1.5H2.75ZM13.75 8.75a2.5 2.5 0 1 0 0-5M13 11.5a3.75 3.75 0 0 1 4.25 3.72v1.53H14" /></svg>
          Картотека граждан
        </button>
      </nav>
      <div className="sidebar-spacer" />
    </aside>
    {mobileMenuOpen && <button className="menu-backdrop" type="button" aria-label="Закрыть меню" onClick={() => onCloseMenu()} />}

    <main className="main">
      <header className="topbar">
        <div className="breadcrumb">Реестр граждан <span>/</span> {route.name === 'dashboard' ? 'Обзор' : route.name === 'registry' ? 'Картотека' : route.name === 'citizen' ? <>Картотека <span>/</span> {selectedName}</> : 'Страница не найдена'}</div>
      </header>
      <div className="content">
        {children}
      </div>
    </main>
  </div>;
}
