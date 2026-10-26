import type { Citizen } from '../../../models/citizen.type';
import { BackToRegistryLink } from '../../backToRegistryLink/BackToRegistryLink';
import { CitizenCard } from '../../citizenCard/CitizenCard';

export interface CitizenDetailPageProps {
  citizen: Citizen;
  onBack: () => void;
  onEdit: () => void;
}

export function CitizenDetailPage({ citizen, onBack, onEdit }: CitizenDetailPageProps) {
  return (
    <div className="detail-page">
      <div className="detail-toolbar">
        <BackToRegistryLink onBack={onBack} />
        <span>Карточка гражданина</span>
      </div>
      <section
        className="data-panel citizen-detail-panel"
        aria-label={`Личное дело ${citizen.name}`}
      >
        <CitizenCard
          key={citizen.id}
          citizen={citizen}
          onEdit={onEdit}
        />
      </section>
    </div>
  );
}
