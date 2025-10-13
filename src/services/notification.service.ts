/**
 * Notification Service
 * Business logic for notification management
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { NotificationRepository } from '@/repositories/notification.repository';
import { Notification } from '@/models';
import { NotificationResponseDTO, NotificationListResponseDTO } from '@/dtos';

export class NotificationService {
  private notificationRepo: NotificationRepository;

  constructor(supabase: SupabaseClient) {
    this.notificationRepo = new NotificationRepository(supabase);
  }

  /**
   * Get all notifications for a user
   */
  async getUserNotifications(userId: string): Promise<NotificationListResponseDTO> {
    const notifications = await this.notificationRepo.findByUserId(userId);
    const unreadCount = await this.notificationRepo.countUnreadByUserId(userId);

    return {
      notifications: notifications.map((n) => this.mapToDTO(n)),
      unread_count: unreadCount,
    };
  }

  /**
   * Get unread notifications for a user
   */
  async getUnreadNotifications(userId: string): Promise<NotificationListResponseDTO> {
    const notifications = await this.notificationRepo.findUnreadByUserId(userId);

    return {
      notifications: notifications.map((n) => this.mapToDTO(n)),
      unread_count: notifications.length,
    };
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<NotificationResponseDTO> {
    const notification = await this.notificationRepo.markAsRead(notificationId);

    return this.mapToDTO(notification);
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepo.markAllAsReadByUserId(userId);
  }

  /**
   * Create a notification
   */
  async createNotification(
    userId: string,
    message: string
  ): Promise<NotificationResponseDTO> {
    const notification = await this.notificationRepo.create({
      user_id: userId,
      message,
      is_read: false,
    });

    return this.mapToDTO(notification);
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await this.notificationRepo.delete(notificationId);
  }

  /**
   * Map Notification to DTO
   */
  private mapToDTO(notification: Notification): NotificationResponseDTO {
    return {
      id: notification.id,
      user_id: notification.user_id,
      message: notification.message,
      is_read: notification.is_read,
      created_at: notification.created_at,
    };
  }
}
