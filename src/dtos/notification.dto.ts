/**
 * Notification DTOs
 * Data Transfer Objects for Notification-related requests and responses
 */

export interface NotificationResponseDTO {
  id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationListResponseDTO {
  notifications: NotificationResponseDTO[];
  unread_count: number;
}

export interface MarkNotificationReadDTO {
  notification_id: string;
}
