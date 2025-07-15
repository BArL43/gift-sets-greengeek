import TelegramService from './telegram.service';

class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async notifyAdminAboutOrder(orderData: any): Promise<void> {
    // Уведомления теперь отправляются только с бэкенда
    console.log('Order notification will be sent from backend');
  }
}

export default NotificationService.getInstance(); 