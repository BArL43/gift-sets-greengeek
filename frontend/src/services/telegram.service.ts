class TelegramService {
  private static instance: TelegramService;
  private botToken: string;
  private adminChatId: string;

  private constructor() {
    // В реальном приложении эти значения должны храниться в .env файле
    this.botToken = process.env.REACT_APP_TELEGRAM_BOT_TOKEN || '';
    this.adminChatId = process.env.REACT_APP_ADMIN_CHAT_ID || '';
    
    // Отладочный вывод
    console.log('Telegram Service initialized with:');
    console.log('Bot Token:', this.botToken ? '***' + this.botToken.slice(-4) : 'not set');
    console.log('Admin Chat ID:', this.adminChatId || 'not set');
  }

  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  public async sendMessage(message: string): Promise<void> {
    try {
      if (!this.botToken || !this.adminChatId) {
        throw new Error('Telegram bot token or admin chat ID is not configured');
      }

      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.adminChatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to send Telegram message: ${errorData.description || response.statusText}`);
      }
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      throw error;
    }
  }
}

export default TelegramService.getInstance(); 