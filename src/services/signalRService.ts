import * as signalR from '@microsoft/signalr';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL 
      ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
      : 'http://localhost:8080';
  }

  async startConnection(token: string): Promise<void> {
    try {
      await this.stopConnection();
      await new Promise(resolve => setTimeout(resolve, 100));

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${this.baseUrl}/userHub`, {
          accessTokenFactory: () => token,
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .build();

      this.setupEventHandlers();
      await this.connection.start();

    } catch (error) {
      console.error('❌ SignalR Connection Error:', error);
    }
  }

  async stopConnection(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        this.connection = null;
      } catch (error) {
        console.error('Error stopping SignalR:', error);
      }
    }
  }

  on<T = unknown>(event: string, callback: (data: T) => void): void {
    this.connection?.on(event, callback);
  }

  off<T = unknown>(event: string, callback: (data: T) => void): void {
    this.connection?.off(event, callback);
  }

  private setupEventHandlers(): void {
    if (!this.connection) return;

    this.connection.on('AvatarChanged', (newAvatarName: string) => {
      console.log('Avatar changed:', newAvatarName);
      window.dispatchEvent(new CustomEvent('avatarChanged', {
        detail: { newAvatarName }
      }));
    });

    this.connection.on('UsernameChanged', (newUsername: string) => {
      console.log('Username changed:', newUsername);
      window.dispatchEvent(new CustomEvent('usernameChanged', {
        detail: { newUsername }
      }));
    });

    this.connection.onreconnecting(() => {
      console.log('SignalR reconnecting...');
    });

    this.connection.onreconnected(() => {
      console.log('SignalR reconnected');
    });

    this.connection.onclose(() => {
      console.log('SignalR connection closed');
    });
  }

  isConnected(): boolean {
    return this.connection !== null && this.connection.state === signalR.HubConnectionState.Connected;
  }
}

export const signalRService = new SignalRService();

if (typeof window !== 'undefined') {
  (window as Window & { signalRService?: SignalRService }).signalRService = signalRService;
}