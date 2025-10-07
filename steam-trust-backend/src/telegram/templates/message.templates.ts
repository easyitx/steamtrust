import {
  PaymentNotification,
  SystemAlert,
  WebhookNotification,
} from '../telegram.interface';

export class MessageTemplates {
  // Шаблон для уведомления о платеже
  static paymentNotification(data: PaymentNotification): string {
    const emoji = this.getStatusEmoji(data.status);
    const time = this.formatTime(data.timestamp);

    return `💳 <b>Новый платеж</b> ${emoji}

🆔 <b>ID:</b> <code>${data.paymentId}</code>
💰 <b>Сумма:</b> ${data.amount} ${data.currency}
🏦 <b>Провайдер:</b> ${data.provider}
📊 <b>Статус:</b> ${data.status}
${data.account ? `🎮 <b>Аккаунт:</b> ${data.account}` : ''}
⏰ <b>Время:</b> ${time}`;
  }

  // Шаблон для системных алертов
  static systemAlert(data: SystemAlert): string {
    const emoji = this.getAlertEmoji(data.type);
    const time = this.formatTime(data.timestamp);

    return `${emoji} <b>${data.title}</b>

📝 ${data.message}
⏰ ${time}
${data.metadata ? `📋 <b>Детали:</b> <code>${JSON.stringify(data.metadata, null, 2)}</code>` : ''}`;
  }

  // Шаблон для webhook уведомлений
  static webhookNotification(data: WebhookNotification): string {
    const emoji = this.getStatusEmoji(data.status);
    const time = this.formatTime(data.timestamp);

    return `🔗 <b>Webhook получен</b> ${emoji}

🏦 <b>Провайдер:</b> ${data.provider}
🆔 <b>ID платежа:</b> <code>${data.paymentId}</code>
💰 <b>Сумма:</b> ${data.amount}
📊 <b>Статус:</b> ${data.status}
⏰ <b>Время:</b> ${time}
${data.signature ? `🔐 <b>Подпись:</b> <code>${data.signature}</code>` : ''}`;
  }

  // Шаблон для уведомлений об ошибках
  static errorNotification(data: any): string {
    const emoji = this.getSeverityEmoji(data.severity);
    const time = this.formatTime(data.timestamp);

    return `${emoji} <b>Ошибка системы</b>

🚨 <b>Контекст:</b> ${data.context}
❌ <b>Ошибка:</b> ${data.error}
⏰ <b>Время:</b> ${time}
${data.stack ? `📋 <b>Stack trace:</b> <code>${data.stack}</code>` : ''}`;
  }

  // Вспомогательные методы
  private static getStatusEmoji(status: string): string {
    const statusMap: Record<string, string> = {
      success: '✅',
      completed: '🎉',
      pending: '⏳',
      failed: '❌',
      externalProcess: '🔄',
      externalError: '⚠️',
      insufficientFunds: '💸',
      duplicateTransaction: '🔄',
      paymentVerificationFailed: '🔍',
      paymentConfirmationFailed: '❌',
      purchaseNotFound: '🔍',
      calculationError: '🧮',
      topUpError: '💳',
    };
    return statusMap[status] || '❓';
  }

  private static getAlertEmoji(type: string): string {
    const alertMap: Record<string, string> = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅',
    };
    return alertMap[type] || 'ℹ️';
  }

  private static getSeverityEmoji(severity: string): string {
    const severityMap: Record<string, string> = {
      low: '🔵',
      medium: '🟡',
      high: '🟠',
      critical: '🔴',
    };
    return severityMap[severity] || '⚪';
  }

  private static formatTime(date: Date): string {
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
