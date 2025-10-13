/**
 * User Model
 * Represents a user in the scholarship portal system
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  course?: string;
  category?: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  economic_background?: 'Below Poverty Line' | 'Low Income' | 'Middle Income' | 'High Income';
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserInput {
  id: string;
  email: string;
  name?: string;
}

export interface UpdateUserInput {
  name?: string;
  course?: string;
  category?: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  economic_background?: 'Below Poverty Line' | 'Low Income' | 'Middle Income' | 'High Income';
}
