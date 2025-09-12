// Admin configuration for notifications and system settings

export interface AdminConfig {
  notificationEmails: string[];
  primaryAdminEmail: string;
  financeEmail: string;
  supportEmail: string;
}

// Default admin configuration
// In production, this should be stored in Firebase or environment variables
export const adminConfig: AdminConfig = {
  // Primary admin emails that receive donation notifications
  notificationEmails: [
    'admin@pioneer-ventures-society.org',
    'finance@pioneer-ventures-society.org'
  ],
  
  // Primary admin email (main contact)
  primaryAdminEmail: 'admin@pioneer-ventures-society.org',
  
  // Finance team email
  financeEmail: 'finance@pioneer-ventures-society.org',
  
  // Support email
  supportEmail: 'support@pioneer-ventures-society.org'
};

// Get admin emails from environment or use defaults
export const getAdminEmails = (): string[] => {
  const envEmails = process.env.VITE_ADMIN_NOTIFICATION_EMAILS;
  if (envEmails) {
    return envEmails.split(',').map(email => email.trim());
  }
  return adminConfig.notificationEmails;
};

// Get primary admin email
export const getPrimaryAdminEmail = (): string => {
  return process.env.VITE_PRIMARY_ADMIN_EMAIL || adminConfig.primaryAdminEmail;
};

// Get finance email
export const getFinanceEmail = (): string => {
  return process.env.VITE_FINANCE_EMAIL || adminConfig.financeEmail;
};