import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { School, SchoolContextType, SchoolStats } from '../types';
import { storage } from '../utils/storage';

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export function SchoolProvider({ children }: { children: ReactNode }) {
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);
  const [allSchools, setAllSchools] = useState<School[]>([]);

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = () => {
    const schools = storage.getAllSchools();
    setAllSchools(schools);

    const currentId = storage.getCurrentSchoolId();
    if (currentId) {
      const school = storage.getSchool(currentId);
      if (school) {
        setCurrentSchool(school);
        applySchoolBranding(school);
      }
    } else if (schools.length > 0) {
      setCurrentSchool(schools[0]);
      storage.setCurrentSchoolId(schools[0].id);
      applySchoolBranding(schools[0]);
    }
  };

  const applySchoolBranding = (school: School) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', school.colorScheme.primary);
    root.style.setProperty('--color-secondary', school.colorScheme.secondary);
    root.style.setProperty('--color-accent', school.colorScheme.accent);
  };

  const switchSchool = (schoolId: string) => {
    const school = storage.getSchool(schoolId);
    if (school) {
      setCurrentSchool(school);
      storage.setCurrentSchoolId(schoolId);
      applySchoolBranding(school);
      window.location.reload();
    }
  };

  const updateSchool = (school: School) => {
    storage.updateSchool(school);
    setCurrentSchool(school);
    applySchoolBranding(school);
    loadSchools();
  };

  const createSchool = (schoolData: Omit<School, 'id' | 'createdAt'>): School => {
    const newSchool: School = {
      ...schoolData,
      id: `school-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    storage.addSchool(newSchool);
    loadSchools();
    return newSchool;
  };

  const getSchoolStats = (schoolId: string): SchoolStats => {
    const surveys = storage.getSurveys(schoolId);
    const files = storage.getFiles(schoolId);
    const responses = storage.getResponses(schoolId);

    return {
      surveyCount: surveys.length,
      fileCount: files.length,
      responseCount: responses.length,
    };
  };

  return (
    <SchoolContext.Provider
      value={{
        currentSchool,
        allSchools,
        switchSchool,
        updateSchool,
        createSchool,
        getSchoolStats,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within SchoolProvider');
  }
  return context;
}
