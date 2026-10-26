import { Avatar, Button, Dropdown, Empty, Input, Pagination, Select, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { regions, statuses } from '../../../services/citizens';
import type { Citizen, Filters } from '../../../models/citizen.type';
import {
  filterKeys,
  filterLabels,
  type FilterKey,
} from '../../../config/registryFilters';
import { PAGES } from '../../../config/pages.config';
import {
  avatarUrl,
  formatNumber,
  initials,
  prettyDate,
  statusClass,
} from '../../../utils/citizenPresentation';

export interface RegistryPageProps {
  filters: Filters;
  activeFilters: FilterKey[];
  searchDraft: string;
  setSearchDraft: (value: string) => void;
  rows: Citizen[];
  total: number;
  page: number;
  size: number;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  openCitizen: (id: number) => void;
  changeFilters: (next: Partial<Filters>) => void;
  addFilter: (key: FilterKey) => void;
  removeFilter: (key: FilterKey) => void;
  resetFilters: () => void;
}

export function RegistryPage({
  filters,
  activeFilters,
  searchDraft,
  setSearchDraft,
  rows,
  total,
  page,
  size,
  setPage,
  setSize,
  openCitizen,
  changeFilters,
  addFilter,
  removeFilter,
  resetFilters,
}: RegistryPageProps) {
  const columns: TableColumnsType<Citizen> = [
    {
      title: 'Гражданин',
      dataIndex: 'name',
      width: 250,
      render: (name: string, record) => (
        <a
          className="name-cell citizen-link"
          href={PAGES.citizen(record.id)}
          onClick={(event) => {
            event.stopPropagation();
            if (
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            )
              return;
            event.preventDefault();
            openCitizen(record.id);
          }}
        >
          <Avatar
            size={36}
            className="mini-avatar"
            src={avatarUrl(record.id)}
            aria-hidden="true"
          >
            {initials(name)}
          </Avatar>
          <span>
            <strong>{name}</strong>
            <small>№ {formatNumber(record.id)}</small>
          </span>
        </a>
      ),
    },
    { title: 'Регион', dataIndex: 'region', width: 150, responsive: ['lg'] },
    {
      title: 'Дата рождения',
      dataIndex: 'birthday',
      width: 120,
      render: (value: string) => prettyDate(value),
      responsive: ['lg'],
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 135,
      render: (value: string) => (
        <span className={`status-label ${statusClass(value)}`}>{value}</span>
      ),
    },
  ];
  return (
    <div className="registry-page">
      <div className="page-header registry-header">
        <div>
          <h1>Картотека граждан</h1>
          <p>Поиск и работа с личными делами</p>
        </div>
      </div>
      <section
        className="data-panel list-panel"
        aria-label="Список граждан"
      >
        <div className="list-head">
          <div>
            <h2>Список граждан</h2>
            <p>Нажмите на запись, чтобы открыть личное дело</p>
          </div>
          <span className="panel-count">Записей: {formatNumber(total)}</span>
        </div>
        <div className="filters">
          <div className="filter-main-row">
            <Input.Search
              aria-label="Поиск по ФИО или номеру"
              placeholder="ФИО или номер дела"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onSearch={setSearchDraft}
              allowClear
            />
            <Dropdown
              menu={{
                items: filterKeys
                  .filter((key) => !activeFilters.includes(key))
                  .map((key) => ({ key, label: filterLabels[key] })),
                onClick: ({ key }) => addFilter(key as FilterKey),
              }}
              disabled={activeFilters.length === filterKeys.length}
              trigger={['click']}
            >
              <Button>+ Фильтр</Button>
            </Dropdown>
            <Button
              onClick={resetFilters}
              disabled={!searchDraft && !activeFilters.length}
            >
              Сбросить
            </Button>
          </div>
          {activeFilters.length > 0 && (
            <div className="filter-fields">
              {activeFilters.map((key) => (
                <div
                  className="filter-field"
                  key={key}
                >
                  <span>{filterLabels[key]}</span>
                  <Select
                    aria-label={filterLabels[key]}
                    placeholder="Все"
                    value={filters[key] || undefined}
                    allowClear
                    options={(key === 'region'
                      ? regions
                      : key === 'status'
                        ? statuses
                        : key === 'gender'
                          ? ['Мужской', 'Женский']
                          : ['Высшее', 'Среднее специальное', 'Среднее']
                    ).map((value) => ({ value }))}
                    onChange={(value) => changeFilters({ [key]: value ?? '' })}
                  />
                  <button
                    type="button"
                    aria-label={`Убрать фильтр ${filterLabels[key]}`}
                    onClick={() => removeFilter(key)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <Table<Citizen>
          rowKey="id"
          columns={columns}
          dataSource={rows}
          pagination={false}
          locale={{
            emptyText: (
              <Empty description="Записи не найдены. Измените условия поиска." />
            ),
          }}
          onRow={(record) => ({ onClick: () => openCitizen(record.id) })}
          size="middle"
          scroll={{ x: 535 }}
        />
        <div className="pagination-row">
          <Pagination
            current={page}
            pageSize={size}
            total={total}
            showSizeChanger
            pageSizeOptions={[20, 50, 100]}
            size="small"
            onChange={(nextPage, nextSize) => {
              setPage(nextPage);
              setSize(nextSize);
            }}
          />
        </div>
      </section>
    </div>
  );
}
