export class DateUtils {
  static normalize(dateString: string, formatType: 'date' | 'datetime' | 'timeago' = 'date'): string {
    const date = new Date(dateString);
    
    switch (formatType) {
      case 'date':
        return date.toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      
      case 'datetime':
        return date.toLocaleString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      
      case 'timeago':
      { 
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return 'только что';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин. назад`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч. назад`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} дн. назад`;
        
        return this.normalize(dateString, 'date'); 
      }
      
      default:
        return date.toLocaleDateString('ru-RU');
    }
  }
}