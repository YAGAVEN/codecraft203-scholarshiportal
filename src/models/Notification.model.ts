/**
 * Notification Model
 * Represents a user notification in the system
 */

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateNotificationInput {
  user_id: string;
  message: string;
  is_read?: boolean;
}

export interface UpdateNotificationInput {
  is_read?: boolean;
  message?: string;
}
