/**
 * Notification Controller
 * Handles HTTP requests for notifications
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { NotificationService } from '@/services';
import { MarkNotificationReadDTO } from '@/dtos';

/**
 * GET /api/notifications
 * Get all notifications for the authenticated user
 */
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notificationService = new NotificationService(supabase);
    const result = await notificationService.getUserNotifications(user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * Mark a notification as read
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: MarkNotificationReadDTO = await request.json();

    if (!body.notification_id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const notificationService = new NotificationService(supabase);
    const result = await notificationService.markAsRead(body.notification_id);

    return NextResponse.json({ success: true, notification: result });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
