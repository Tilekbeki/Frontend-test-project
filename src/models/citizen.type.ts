export interface Citizen {
  id: number;
  name: string;
  birthday: string;
  region: string;
  status: string;
  phone: string;
  email: string;
  address: string;
  snils: string;
  familyStatus: string;
  occupation: string;
  citizenship: string;
  gender: string;
  education: string;
  employmentType: string;
  preferredContact: string;
  benefitCategory: string;
  notes: string;
}

export interface Filters {
  search: string;
  region: string;
  status: string;
  gender?: string;
  education?: string;
}
