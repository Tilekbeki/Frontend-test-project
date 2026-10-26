import { Empty } from 'antd';
import { BackToRegistryLink } from '../../backToRegistryLink/BackToRegistryLink';

export interface NotFoundPageProps {
  onBack: () => void;
}

export function NotFoundPage({ onBack }: NotFoundPageProps) {
  return (
    <div className="detail-page">
      <div className="detail-toolbar">
        <BackToRegistryLink onBack={onBack} />
      </div>
      <section className="data-panel not-found-panel">
        <h1>Страница не найдена</h1>
        <Empty description="Страница или личное дело не найдены" />
      </section>
    </div>
  );
}
