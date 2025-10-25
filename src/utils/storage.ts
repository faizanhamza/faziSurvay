import { School, Survey, SurveyResponse, FileUpload, User } from '../types';

const STORAGE_KEYS = {
  ALL_SCHOOLS: 'all_schools',
  CURRENT_SCHOOL_ID: 'current_school_id',
  AUTH_TOKEN: 'auth_token',
  USERS: 'users',
};

const getSchoolKey = (schoolId: string, type: string) => `school_${schoolId}_${type}`;

export const storage = {
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  removeItem(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  },

  getAllSchools(): School[] {
    return this.getItem<School[]>(STORAGE_KEYS.ALL_SCHOOLS) || [];
  },

  setAllSchools(schools: School[]): void {
    this.setItem(STORAGE_KEYS.ALL_SCHOOLS, schools);
  },

  getCurrentSchoolId(): string | null {
    return this.getItem<string>(STORAGE_KEYS.CURRENT_SCHOOL_ID);
  },

  setCurrentSchoolId(schoolId: string): void {
    this.setItem(STORAGE_KEYS.CURRENT_SCHOOL_ID, schoolId);
  },

  getSchool(schoolId: string): School | null {
    const schools = this.getAllSchools();
    return schools.find(s => s.id === schoolId) || null;
  },

  addSchool(school: School): void {
    const schools = this.getAllSchools();
    schools.push(school);
    this.setAllSchools(schools);
  },

  updateSchool(school: School): void {
    const schools = this.getAllSchools();
    const index = schools.findIndex(s => s.id === school.id);
    if (index !== -1) {
      schools[index] = school;
      this.setAllSchools(schools);
    }
  },

  getSurveys(schoolId: string): Survey[] {
    return this.getItem<Survey[]>(getSchoolKey(schoolId, 'surveys')) || [];
  },

  setSurveys(schoolId: string, surveys: Survey[]): void {
    this.setItem(getSchoolKey(schoolId, 'surveys'), surveys);
  },

  addSurvey(schoolId: string, survey: Survey): void {
    const surveys = this.getSurveys(schoolId);
    surveys.push(survey);
    this.setSurveys(schoolId, surveys);
  },

  updateSurvey(schoolId: string, survey: Survey): void {
    const surveys = this.getSurveys(schoolId);
    const index = surveys.findIndex(s => s.id === survey.id);
    if (index !== -1) {
      surveys[index] = survey;
      this.setSurveys(schoolId, surveys);
    }
  },

  deleteSurvey(schoolId: string, surveyId: string): void {
    const surveys = this.getSurveys(schoolId).filter(s => s.id !== surveyId);
    this.setSurveys(schoolId, surveys);
  },

  getResponses(schoolId: string): SurveyResponse[] {
    return this.getItem<SurveyResponse[]>(getSchoolKey(schoolId, 'responses')) || [];
  },

  setResponses(schoolId: string, responses: SurveyResponse[]): void {
    this.setItem(getSchoolKey(schoolId, 'responses'), responses);
  },

  addResponse(schoolId: string, response: SurveyResponse): void {
    const responses = this.getResponses(schoolId);
    responses.push(response);
    this.setResponses(schoolId, responses);
  },

  getFiles(schoolId: string): FileUpload[] {
    return this.getItem<FileUpload[]>(getSchoolKey(schoolId, 'files')) || [];
  },

  setFiles(schoolId: string, files: FileUpload[]): void {
    this.setItem(getSchoolKey(schoolId, 'files'), files);
  },

  addFile(schoolId: string, file: FileUpload): void {
    const files = this.getFiles(schoolId);
    files.push(file);
    this.setFiles(schoolId, files);
  },

  deleteFile(schoolId: string, fileId: string): void {
    const files = this.getFiles(schoolId).filter(f => f.id !== fileId);
    this.setFiles(schoolId, files);
  },

  getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS) || [];
  },

  setUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  },

  getAuthToken(): string | null {
    return this.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
  },

  setAuthToken(token: string): void {
    this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  clearAuthToken(): void {
    this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  exportSchoolData(schoolId: string) {
    return {
      school: this.getSchool(schoolId),
      surveys: this.getSurveys(schoolId),
      responses: this.getResponses(schoolId),
      files: this.getFiles(schoolId),
    };
  },

  exportAllData() {
    return {
      schools: this.getAllSchools(),
      users: this.getUsers(),
      currentSchoolId: this.getCurrentSchoolId(),
    };
  },

  clearSchoolData(schoolId: string): void {
    this.removeItem(getSchoolKey(schoolId, 'surveys'));
    this.removeItem(getSchoolKey(schoolId, 'responses'));
    this.removeItem(getSchoolKey(schoolId, 'files'));
  },
};
