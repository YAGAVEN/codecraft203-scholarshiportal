/**
 * Base Repository
 * Provides common database operations and Supabase client access
 */

import { SupabaseClient } from '@supabase/supabase-js';

export abstract class BaseRepository {
  protected supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Handle database errors consistently
   */
  protected handleError(error: unknown, context: string): never {
    console.error(`[${context}] Database error:`, error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Database operation failed: ${message}`);
  }
}
