import { useMemo } from 'react';
import { Avatar, Button } from 'antd';
import { citizenAt, regions, registryStats, statuses, TOTAL_CITIZENS } from '../../services/citizens';
import type { Citizen } from '../../models/citizen.type';
import { avatarUrl, formatNumber, initials, statusClass } from '../../utils/citizenPresentation';

export interface DashboardPageProps {
  overrides: Record<number, Partial<Citizen>>;
  onOpenRegistry: (status?: string) => void;
}

export function DashboardPage({ overrides, onOpenRegistry }: DashboardPageProps) {
  const stats = useMemo(() => registryStats(overrides), [overrides]);
  const attention = stats.byStatus['Требует уточнения'];
  const regionCounts = regions.map(region => ({ region, count: stats.byRegion[region] }));
  const maxRegionCount = Math.max(...regionCounts.map(item => item.count));

  return <div className="dashboard-page">
    <div className="page-header">
      <div>
        <h1>Обзор реестра</h1>
        <p>Текущее состояние картотеки граждан</p>
      </div>
      <Button type="primary" onClick={() => onOpenRegistry()}>Открыть картотеку <span aria-hidden="true">→</span></Button>
    </div>

    <section className="overview-band" aria-label="Сводка реестра">
      <div className="overview-total">
        <div className="metric-heading">
          <Avatar.Group size={34} className="overview-avatar-group">
            {[1, 2, 3].map(id => <Avatar key={id} src={avatarUrl(id)} aria-hidden="true">{initials(citizenAt(id).name)}</Avatar>)}
          </Avatar.Group>
          <span className="metric-label">Записей в реестре</span>
        </div>
        <strong>{formatNumber(TOTAL_CITIZENS)}</strong>
        <span className="metric-note">в 6 регионах</span>
      </div>
      <div className="overview-divider" />
      <div className="overview-focus">
        <div>
          <span className="metric-label">Требуют уточнения</span>
          <strong>{formatNumber(attention)}</strong>
          <p>Откройте эти карточки, чтобы проверить недостающие сведения.</p>
        </div>
        <button className="text-action" onClick={() => onOpenRegistry('Требует уточнения')}>Посмотреть записи <span aria-hidden="true">→</span></button>
      </div>
    </section>

    <div className="dashboard-grid">
      <section className="data-panel status-panel">
        <div className="panel-head">
          <div><h2>Состояние записей</h2><p>Распределение по статусам проверки</p></div>
        </div>
        <div className="status-track" role="img" aria-label={statuses.map(status => `${status}: ${formatNumber(stats.byStatus[status])}`).join(', ')}>
          {statuses.map(status => <div key={status} className={`status-segment ${statusClass(status)}`} style={{ width: `${stats.byStatus[status] / TOTAL_CITIZENS * 100}%` }} />)}
        </div>
        <div className="status-list">
          {statuses.map(status => <button className="status-row" key={status} onClick={() => onOpenRegistry(status)}>
            <span className={`status-dot ${statusClass(status)}`} />
            <span className="status-row-name">{status}</span>
            <strong>{formatNumber(stats.byStatus[status])}</strong>
            <span className="status-percent">{Math.round(stats.byStatus[status] / TOTAL_CITIZENS * 100)}%</span>
          </button>)}
        </div>
      </section>

      <section className="data-panel region-panel">
        <div className="panel-head">
          <div><h2>Регионы</h2><p>Записи по месту регистрации</p></div>
          <span className="panel-count">6 регионов</span>
        </div>
        <div className="region-chart">
          {regionCounts.map(({ region, count }) => <div className="region-row" key={region}>
            <span>{region}</span>
            <div className="bar-track"><div style={{ width: `${count / maxRegionCount * 100}%` }} /></div>
            <strong>{formatNumber(count)}</strong>
          </div>)}
        </div>
      </section>
    </div>
  </div>;
}
