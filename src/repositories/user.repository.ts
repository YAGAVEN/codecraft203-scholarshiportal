/**
 * User Repository
 * Handles all database operations related to users
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository';
import { User, CreateUserInput, UpdateUserInput } from '@/models';

export class UserRepository extends BaseRepository {
  constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  /**
   * Get user by ID
   */
  async findById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      this.handleError(error, 'UserRepository.findById');
    }
  }

  /**
   * Get user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      this.handleError(error, 'UserRepository.findByEmail');
    }
  }

  /**
   * Create a new user
   */
  async create(input: CreateUserInput): Promise<User> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .insert({
          id: input.id,
          email: input.email,
          name: input.name,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      this.handleError(error, 'UserRepository.create');
    }
  }

  /**
   * Update user information
   */
  async update(userId: string, input: UpdateUserInput): Promise<User> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      this.handleError(error, 'UserRepository.update');
    }
  }

  /**
   * Delete a user
   */
  async delete(userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'UserRepository.delete');
    }
  }

  /**
   * Check if user profile is complete
   */
  async isProfileComplete(userId: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user) return false;

    return !!(
      user.name &&
      user.email &&
      user.course &&
      user.category &&
      user.economic_background
    );
  }
}
