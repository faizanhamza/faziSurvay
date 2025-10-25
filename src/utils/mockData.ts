import { User, School, Survey, SurveyResponse, FileUpload, ColorScheme } from '../types';

export const COLOR_PRESETS: ColorScheme[] = [
  { name: 'Ocean Blue', primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa' },
  { name: 'Forest Green', primary: '#15803d', secondary: '#22c55e', accent: '#86efac' },
  { name: 'Sunset Orange', primary: '#c2410c', secondary: '#f97316', accent: '#fb923c' },
  { name: 'Royal Purple', primary: '#6b21a8', secondary: '#a855f7', accent: '#c084fc' },
  { name: 'Crimson Red', primary: '#b91c1c', secondary: '#ef4444', accent: '#f87171' },
  { name: 'Slate Gray', primary: '#475569', secondary: '#64748b', accent: '#94a3b8' },
];

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'superadmin@portal.com',
    password: 'super123',
    role: 'superadmin',
    name: 'Super Admin',
  },
  {
    id: 'user-2',
    email: 'admin@school.edu',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    schoolId: 'school-1',
  },
  {
    id: 'user-3',
    email: 'teacher@school.edu',
    password: 'teacher123',
    role: 'teacher',
    name: 'Teacher User',
    schoolId: 'school-1',
  },
  {
    id: 'user-4',
    email: 'viewer@school.edu',
    password: 'viewer123',
    role: 'viewer',
    name: 'Viewer User',
    schoolId: 'school-1',
  },
];

export const DEFAULT_SCHOOL: School = {
  id: 'school-1',
  name: 'Riverside High School',
  tagline: 'Excellence in Education',
  colorScheme: COLOR_PRESETS[0],
  font: 'Inter',
  template: 'modern',
  createdAt: new Date().toISOString(),
};

export const DEMO_SURVEYS: Survey[] = [
  {
    id: 'survey-1',
    schoolId: 'school-1',
    title: 'Student Feedback Survey',
    description: 'Help us improve our school programs',
    status: 'published',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-2',
    questions: [
      {
        id: 'q1',
        type: 'rating',
        question: 'How satisfied are you with the overall school experience?',
        required: true,
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'Which subject do you enjoy the most?',
        required: true,
        options: ['Mathematics', 'Science', 'English', 'History', 'Arts'],
      },
      {
        id: 'q3',
        type: 'text',
        question: 'What improvements would you suggest?',
        required: false,
      },
    ],
  },
  {
    id: 'survey-2',
    schoolId: 'school-1',
    title: 'Parent-Teacher Communication',
    description: 'Your feedback on our communication efforts',
    status: 'published',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-2',
    questions: [
      {
        id: 'q1',
        type: 'yes-no',
        question: 'Do you feel informed about your child\'s progress?',
        required: true,
      },
      {
        id: 'q2',
        type: 'rating',
        question: 'Rate the quality of teacher communication',
        required: true,
      },
      {
        id: 'q3',
        type: 'text',
        question: 'How can we improve communication?',
        required: false,
      },
    ],
  },
  {
    id: 'survey-3',
    schoolId: 'school-1',
    title: 'Facility Improvement Survey',
    description: 'Help us prioritize facility upgrades',
    status: 'draft',
    createdAt: new Date().toISOString(),
    createdBy: 'user-2',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Which facility needs the most improvement?',
        required: true,
        options: ['Library', 'Cafeteria', 'Gymnasium', 'Classrooms', 'Restrooms'],
      },
      {
        id: 'q2',
        type: 'text',
        question: 'Please describe the specific improvements needed',
        required: true,
      },
    ],
  },
];

export const DEMO_RESPONSES: SurveyResponse[] = [
  {
    id: 'resp-1',
    surveyId: 'survey-1',
    schoolId: 'school-1',
    anonymous: false,
    submittedBy: 'user-4',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    answers: {
      q1: '5',
      q2: 'Science',
      q3: 'More hands-on activities',
    },
  },
  {
    id: 'resp-2',
    surveyId: 'survey-1',
    schoolId: 'school-1',
    anonymous: true,
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    answers: {
      q1: '4',
      q2: 'Mathematics',
      q3: '',
    },
  },
  {
    id: 'resp-3',
    surveyId: 'survey-2',
    schoolId: 'school-1',
    anonymous: false,
    submittedBy: 'user-4',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    answers: {
      q1: 'Yes',
      q2: '5',
      q3: 'Keep up the great work!',
    },
  },
  {
    id: 'resp-4',
    surveyId: 'survey-2',
    schoolId: 'school-1',
    anonymous: true,
    submittedAt: new Date().toISOString(),
    answers: {
      q1: 'No',
      q2: '3',
      q3: 'More frequent updates needed',
    },
  },
];

export const DEMO_FILES: FileUpload[] = [
  {
    id: 'file-1',
    schoolId: 'school-1',
    name: 'Student_Handbook_2024.pdf',
    type: 'application/pdf',
    size: 245000,
    data: 'data:application/pdf;base64,JVBERi0xLjQK',
    uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: 'user-2',
  },
  {
    id: 'file-2',
    schoolId: 'school-1',
    name: 'School_Calendar.pdf',
    type: 'application/pdf',
    size: 189000,
    data: 'data:application/pdf;base64,JVBERi0xLjQK',
    uploadedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: 'user-2',
  },
  {
    id: 'file-3',
    schoolId: 'school-1',
    name: 'Campus_Map.png',
    type: 'image/png',
    size: 567000,
    data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: 'user-2',
  },
  {
    id: 'file-4',
    schoolId: 'school-1',
    name: 'Contact_Information.pdf',
    type: 'application/pdf',
    size: 123000,
    data: 'data:application/pdf;base64,JVBERi0xLjQK',
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: 'user-3',
  },
  {
    id: 'file-5',
    schoolId: 'school-1',
    name: 'School_Logo.png',
    type: 'image/png',
    size: 89000,
    data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: 'user-2',
  },
];

export function initializeDemoData() {
  const { storage } = require('./storage');

  const existingSchools = storage.getAllSchools();
  if (existingSchools.length === 0) {
    storage.addSchool(DEFAULT_SCHOOL);
    storage.setCurrentSchoolId(DEFAULT_SCHOOL.id);
  }

  const existingUsers = storage.getUsers();
  if (existingUsers.length === 0) {
    storage.setUsers(MOCK_USERS);
  }

  const existingSurveys = storage.getSurveys(DEFAULT_SCHOOL.id);
  if (existingSurveys.length === 0) {
    storage.setSurveys(DEFAULT_SCHOOL.id, DEMO_SURVEYS);
  }

  const existingResponses = storage.getResponses(DEFAULT_SCHOOL.id);
  if (existingResponses.length === 0) {
    storage.setResponses(DEFAULT_SCHOOL.id, DEMO_RESPONSES);
  }

  const existingFiles = storage.getFiles(DEFAULT_SCHOOL.id);
  if (existingFiles.length === 0) {
    storage.setFiles(DEFAULT_SCHOOL.id, DEMO_FILES);
  }
}
