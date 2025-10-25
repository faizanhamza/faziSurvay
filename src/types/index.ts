export type UserRole = 'superadmin' | 'admin' | 'teacher' | 'viewer';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  schoolId?: string;
}

export interface School {
  id: string;
  name: string;
  tagline: string;
  logo?: string;
  colorScheme: ColorScheme;
  font: string;
  template: string;
  createdAt: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  name: string;
}

export interface Survey {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  questions: Question[];
  status: 'draft' | 'published';
  createdAt: string;
  createdBy: string;
}

export interface Question {
  id: string;
  type: 'text' | 'multiple-choice' | 'rating' | 'yes-no';
  question: string;
  required: boolean;
  options?: string[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  schoolId: string;
  answers: Record<string, string>;
  anonymous: boolean;
  submittedBy?: string;
  submittedAt: string;
}

export interface FileUpload {
  id: string;
  schoolId: string;
  name: string;
  type: string;
  size: number;
  data: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface SchoolContextType {
  currentSchool: School | null;
  allSchools: School[];
  switchSchool: (schoolId: string) => void;
  updateSchool: (school: School) => void;
  createSchool: (school: Omit<School, 'id' | 'createdAt'>) => School;
  getSchoolStats: (schoolId: string) => SchoolStats;
}

export interface SchoolStats {
  surveyCount: number;
  fileCount: number;
  responseCount: number;
}
