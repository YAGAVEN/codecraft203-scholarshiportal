export interface User {
  id: string;
  name: string;
  email: string;
  course: string;
  category: string;
  economic_background: string;
  created_at?: string;
}

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  eligibility_criteria: string;
  deadline: string;
  country: string;
  language: string;
  link: string;
  created_at?: string;
}

export interface Application {
  id: string;
  user_id: string;
  scholarship_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'applied';
  applied_at: string;
  scholarship?: Scholarship;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface UserProfile extends User {
  profile_completeness: number;
  documents_uploaded: number;
}
