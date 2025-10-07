export interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode?: 'HTML' | 'Markdown';
  disableWebPagePreview?: boolean;
}

// Уведомления о платежах
export interface PaymentNotification {
  paymentId: string;
  amount: string;
  currency: string;
  provider: string;
  status: string;
  account?: string;
  timestamp: Date;
}

// Системные алерты
export interface SystemAlert {
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Webhook уведомления
export interface WebhookNotification {
  provider: string;
  paymentId: string;
  status: string;
  amount: string;
  timestamp: Date;
  signature?: string;
}
