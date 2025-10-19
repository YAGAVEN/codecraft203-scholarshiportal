/**
 * Notification Repository
 * Handles all database operations related to notifications
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository';
import { Notification, CreateNotificationInput } from '@/models';

export class NotificationRepository extends BaseRepository {
  constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  /**
   * Get all notifications for a user
   */
  async findByUserId(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await this.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      this.handleError(error, 'NotificationRepository.findByUserId');
    }
  }

  /**
   * Get unread notifications for a user
   */
  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await this.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      this.handleError(error, 'NotificationRepository.findUnreadByUserId');
    }
  }

  /**
   * Count unread notifications
   */
  async countUnreadByUserId(userId: string): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      this.handleError(error, 'NotificationRepository.countUnreadByUserId');
    }
  }

  /**
   * Create a new notification
   */
  async create(input: CreateNotificationInput): Promise<Notification> {
    try {
      const { data, error } = await this.supabase
        .from('notifications')
        .insert({
          user_id: input.user_id,
          message: input.message,
          is_read: input.is_read || false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      this.handleError(error, 'NotificationRepository.create');
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const { data, error } = await this.supabase
        .from('notifications')
        .update({
          is_read: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      this.handleError(error, 'NotificationRepository.markAsRead');
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsReadByUserId(userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({
          is_read: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'NotificationRepository.markAllAsReadByUserId');
    }
  }

  /**
   * Delete a notification
   */
  async delete(notificationId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'NotificationRepository.delete');
    }
  }
}
