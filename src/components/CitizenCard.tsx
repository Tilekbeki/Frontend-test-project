import { Avatar, Button, Descriptions, Space, Table, Tabs, Tag } from 'antd';
import type { Citizen } from '../models/citizen.type';
import { avatarUrl, initials, prettyDate, statusClass } from '../utils/citizenPresentation';

export interface CitizenCardProps { citizen: Citizen; onEdit: () => void }

export function CitizenCard({ citizen, onEdit }: CitizenCardProps) {
  const familyRows = [
    { key: '1', name: `Член семьи ${citizen.id % 3 + 1}`, relation: citizen.id % 2 ? 'Супруг(а)' : 'Родитель', birthday: `${1970 + citizen.id % 35}-05-14` },
    { key: '2', name: `Член семьи ${citizen.id % 3 + 2}`, relation: 'Ребёнок', birthday: `${2006 + citizen.id % 15}-09-03` },
  ];
  return <div className="citizen-card"><div className="citizen-top"><Avatar size={64} className="profile-avatar" src={avatarUrl(citizen.id)} aria-hidden="true">{initials(citizen.name)}</Avatar><div className="profile-title"><span>ЛИЧНОЕ ДЕЛО · № {citizen.id}</span><h1>{citizen.name}</h1><Space size={6} wrap><span className={`status-label ${statusClass(citizen.status)}`}>{citizen.status}</span><Tag>{citizen.region}</Tag></Space></div><Button onClick={onEdit}>Изменить</Button></div>
    <Tabs items={[
      { key: 'general', label: 'Основное', children: <div className="detail-grid"><section><h3 className="detail-heading">Личные данные</h3><Descriptions column={1} size="small" className="detail-list"><Descriptions.Item label="Дата рождения">{prettyDate(citizen.birthday)}</Descriptions.Item><Descriptions.Item label="Пол">{citizen.gender}</Descriptions.Item><Descriptions.Item label="Гражданство">{citizen.citizenship}</Descriptions.Item><Descriptions.Item label="СНИЛС">{citizen.snils}</Descriptions.Item><Descriptions.Item label="Семейное положение">{citizen.familyStatus}</Descriptions.Item><Descriptions.Item label="Льготная категория">{citizen.benefitCategory}</Descriptions.Item></Descriptions></section><section><h3 className="detail-heading">Контакты</h3><Descriptions column={1} size="small" className="detail-list"><Descriptions.Item label="Телефон">{citizen.phone}</Descriptions.Item><Descriptions.Item label="Почта">{citizen.email}</Descriptions.Item><Descriptions.Item label="Адрес">{citizen.region}, {citizen.address}</Descriptions.Item><Descriptions.Item label="Способ связи">{citizen.preferredContact}</Descriptions.Item></Descriptions></section></div> },
      { key: 'family', label: 'Семья', children: <><p className="detail-intro">Связанные записи о членах семьи</p><Table size="small" pagination={false} scroll={{ x: 520 }} dataSource={familyRows} columns={[{ title: 'Член семьи', dataIndex: 'name' }, { title: 'Родство', dataIndex: 'relation' }, { title: 'Дата рождения', dataIndex: 'birthday', render: (value: string) => prettyDate(value) }]} /></> },
      { key: 'education', label: 'Образование', children: <Descriptions column={1} size="small" className="detail-list"><Descriptions.Item label="Уровень">{citizen.education}</Descriptions.Item><Descriptions.Item label="Учебное заведение">{citizen.id % 2 ? 'Государственный университет' : 'Технический колледж'}</Descriptions.Item><Descriptions.Item label="Год окончания">{2000 + citizen.id % 23}</Descriptions.Item><Descriptions.Item label="Квалификация">{citizen.occupation}</Descriptions.Item></Descriptions> },
      { key: 'work', label: 'Занятость', children: <Descriptions column={1} size="small" className="detail-list"><Descriptions.Item label="Профессия">{citizen.occupation}</Descriptions.Item><Descriptions.Item label="Формат занятости">{citizen.employmentType}</Descriptions.Item><Descriptions.Item label="Организация">{citizen.id % 3 ? 'Городская служба' : 'Частная компания'}</Descriptions.Item><Descriptions.Item label="Примечание">{citizen.notes || 'Нет примечаний'}</Descriptions.Item></Descriptions> },
    ]} />
  </div>;
}
