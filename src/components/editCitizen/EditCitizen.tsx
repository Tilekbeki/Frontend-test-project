import { DatePicker, Form, Input, Modal, Radio, Select } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { regions, statuses } from '../../services/citizens';
import type { Citizen } from '../../models/citizen.type';

type FormValues = Omit<Citizen, 'id' | 'birthday'> & { birthday: Dayjs };

export interface EditCitizenProps {
  citizen: Citizen;
  onCancel: () => void;
  onSave: (value: Citizen) => void;
}

export function EditCitizen({ citizen, onCancel, onSave }: EditCitizenProps) {
  const [form] = Form.useForm();
  const save = (values: FormValues) => {
    onSave({ ...citizen, ...values, birthday: values.birthday.format('YYYY-MM-DD') });
  };
  return (
    <Modal
      open
      title="Редактировать карточку"
      width={780}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Сохранить"
      cancelText="Отмена"
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ ...citizen, birthday: dayjs(citizen.birthday) }}
        onFinish={save}
      >
        <h3 className="form-section">Личные данные</h3>
        <div className="form-grid">
          <Form.Item
            name="name"
            label="ФИО"
            rules={[{ required: true, max: 120 }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="birthday"
            label="Дата рождения"
            rules={[{ required: true }]}
          >
            <DatePicker
              format="DD.MM.YYYY"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Пол"
          >
            <Radio.Group options={['Мужской', 'Женский']} />
          </Form.Item>
          <Form.Item
            name="citizenship"
            label="Гражданство"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="snils"
            label="СНИЛС"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="familyStatus"
            label="Семейное положение"
          >
            <Select
              options={['В браке', 'Не состоит в браке'].map((value) => ({ value }))}
            />
          </Form.Item>
        </div>
        <h3 className="form-section">Контакты и адрес</h3>
        <div className="form-grid">
          <Form.Item
            name="phone"
            label="Телефон"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Электронная почта"
            rules={[{ type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="region"
            label="Регион"
          >
            <Select options={regions.map((value) => ({ value }))} />
          </Form.Item>
          <Form.Item
            name="address"
            label="Адрес регистрации"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="preferredContact"
            label="Удобный способ связи"
          >
            <Select
              options={['Телефон', 'Электронная почта'].map((value) => ({ value }))}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Статус проверки"
          >
            <Select options={statuses.map((value) => ({ value }))} />
          </Form.Item>
        </div>
        <h3 className="form-section">Социальные сведения</h3>
        <div className="form-grid">
          <Form.Item
            name="education"
            label="Образование"
          >
            <Select
              options={['Высшее', 'Среднее специальное', 'Среднее'].map((value) => ({
                value,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="occupation"
            label="Профессия"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="employmentType"
            label="Занятость"
          >
            <Select
              options={['Полная занятость', 'Частичная занятость', 'Самозанятость'].map(
                (value) => ({ value }),
              )}
            />
          </Form.Item>
          <Form.Item
            name="benefitCategory"
            label="Льготы"
          >
            <Select options={['Есть льготы', 'Без льгот'].map((value) => ({ value }))} />
          </Form.Item>
        </div>
        <Form.Item
          name="notes"
          label="Примечание"
        >
          <Input.TextArea
            rows={3}
            placeholder="Дополнительная информация"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
