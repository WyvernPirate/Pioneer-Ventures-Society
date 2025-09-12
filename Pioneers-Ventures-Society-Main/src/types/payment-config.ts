export interface PaymentConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  number: string;
  instructions: string[];
  isActive: boolean;
  order: number;
  color: string;
  updatedAt: string;
}

export interface PaymentConfigFormData {
  name: string;
  description: string;
  icon: string;
  number: string;
  instructions: string[];
  isActive: boolean;
  order: number;
  color: string;
}