// Donation purposes configuration types

export interface DonationPurpose {
  id: string;
  value: string;
  label: string;
  description: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface DonationPurposeFormData {
  value: string;
  label: string;
  description: string;
  isActive: boolean;
  order: number;
}