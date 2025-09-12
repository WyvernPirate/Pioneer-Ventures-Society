export interface Initiative {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  icon: string; // Store icon name as string
  link: string;
  order: number; // For sorting
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InitiativeFormData {
  title: string;
  description: string;
  icon: string;
  link: string;
  order: number;
  isActive: boolean;
}