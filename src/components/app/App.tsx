import { lazy, Suspense } from 'react';
import { CitizenDetailPage, DashboardPage, NotFoundPage, RegistryPage } from '../pages';
import { PAGES } from '../../config/pages.config';
import { RegistryLayout } from '../registryLayout/RegistryLayout';
import { useCitizenRegistry } from '../../hooks/useCitizenRegistry';

const EditCitizen = lazy(() =>
  import('../editCitizen/EditCitizen').then((module) => ({
    default: module.EditCitizen,
  })),
);

export function App() {
  const {
    route,
    mobileMenuOpen,
    setMobileMenuOpen,
    overrides,
    filters,
    activeFilters,
    searchDraft,
    setSearchDraft,
    page,
    setPage,
    size,
    setSize,
    editing,
    setEditing,
    rows,
    total,
    selected,
    navigate,
    openCitizen,
    backToRegistry,
    changeFilters,
    addFilter,
    removeFilter,
    resetFilters,
    saveCitizen,
  } = useCitizenRegistry();

  return (
    <>
      <RegistryLayout
        route={route}
        selectedName={selected?.name}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={() => setMobileMenuOpen((open) => !open)}
        onCloseMenu={() => setMobileMenuOpen(false)}
        onNavigate={navigate}
      >
        {route.name === 'dashboard' && (
          <DashboardPage
            overrides={overrides}
            onOpenRegistry={(status) => {
              if (status) {
                changeFilters({ status, search: '' });
                setSearchDraft('');
                addFilter('status');
              }
              navigate(PAGES.registry);
            }}
          />
        )}
        {route.name === 'registry' && (
          <RegistryPage
            filters={filters}
            activeFilters={activeFilters}
            searchDraft={searchDraft}
            setSearchDraft={setSearchDraft}
            rows={rows}
            total={total}
            page={page}
            size={size}
            setPage={setPage}
            setSize={setSize}
            openCitizen={openCitizen}
            changeFilters={changeFilters}
            addFilter={addFilter}
            removeFilter={removeFilter}
            resetFilters={resetFilters}
          />
        )}
        {route.name === 'citizen' && selected && (
          <CitizenDetailPage
            citizen={selected}
            onBack={backToRegistry}
            onEdit={() => setEditing(true)}
          />
        )}
        {route.name === 'not-found' && <NotFoundPage onBack={backToRegistry} />}
      </RegistryLayout>
      <Suspense fallback={null}>
        {editing && selected && (
          <EditCitizen
            key={selected.id}
            citizen={selected}
            onCancel={() => setEditing(false)}
            onSave={saveCitizen}
          />
        )}
      </Suspense>
    </>
  );
}
