/**
 * Application Repository
 * Handles all database operations related to scholarship applications
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository';
import { Application, CreateApplicationInput, UpdateApplicationInput } from '@/models';

export class ApplicationRepository extends BaseRepository {
  constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  /**
   * Get all applications for a user
   */
  async findByUserId(userId: string): Promise<Application[]> {
    try {
      const { data, error } = await this.supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('applied_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      this.handleError(error, 'ApplicationRepository.findByUserId');
    }
  }

  /**
   * Get application by ID
   */
  async findById(applicationId: string): Promise<Application | null> {
    try {
      const { data, error } = await this.supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      this.handleError(error, 'ApplicationRepository.findById');
    }
  }

  /**
   * Check if user already applied to a scholarship
   */
  async existsByUserAndScholarship(
    userId: string,
    scholarshipId: string
  ): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('applications')
        .select('id')
        .eq('user_id', userId)
        .eq('scholarship_id', scholarshipId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      this.handleError(error, 'ApplicationRepository.existsByUserAndScholarship');
    }
  }

  /**
   * Create a new application
   */
  async create(input: CreateApplicationInput): Promise<Application> {
    try {
      const { data, error } = await this.supabase
        .from('applications')
        .insert({
          user_id: input.user_id,
          scholarship_id: input.scholarship_id,
          status: input.status || 'applied',
          applied_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      this.handleError(error, 'ApplicationRepository.create');
    }
  }

  /**
   * Update application status
   */
  async update(
    applicationId: string,
    input: UpdateApplicationInput
  ): Promise<Application> {
    try {
      const { data, error } = await this.supabase
        .from('applications')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq('id', applicationId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      this.handleError(error, 'ApplicationRepository.update');
    }
  }

  /**
   * Delete an application
   */
  async delete(applicationId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('applications')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'ApplicationRepository.delete');
    }
  }

  /**
   * Count applications for a user
   */
  async countByUserId(userId: string): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      this.handleError(error, 'ApplicationRepository.countByUserId');
    }
  }
}
