import { useAuth } from '../context/AuthContext';
import { useSchool } from '../context/SchoolContext';
import { storage } from '../utils/storage';
import { BarChart3, FileText, Upload as UploadIcon, Users } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const { currentSchool, allSchools } = useSchool();

  const stats = currentSchool
    ? {
        surveys: storage.getSurveys(currentSchool.id).length,
        publishedSurveys: storage.getSurveys(currentSchool.id).filter(s => s.status === 'published').length,
        responses: storage.getResponses(currentSchool.id).length,
        files: storage.getFiles(currentSchool.id).length,
      }
    : { surveys: 0, publishedSurveys: 0, responses: 0, files: 0 };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Welcome back, {user?.name}
        </p>
      </div>

      {user?.role === 'superadmin' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">School Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Schools</p>
                    <p className="text-3xl font-bold text-blue-900 mt-1">{allSchools.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Active School</p>
                    <p className="text-sm font-bold text-green-900 mt-1">{currentSchool?.name}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Surveys</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.surveys}</p>
              </div>
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Published</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.publishedSurveys}</p>
              </div>
              <BarChart3 className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Responses</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.responses}</p>
              </div>
              <Users className="w-10 h-10 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Files</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.files}</p>
              </div>
              <UploadIcon className="w-10 h-10 text-orange-600" />
            </div>
          </div>
        </div>
      )}

      {currentSchool && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Current School</span>
              <span className="font-semibold text-slate-900">{currentSchool.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Color Scheme</span>
              <span className="font-semibold text-slate-900">{currentSchool.colorScheme.name}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">Your Role</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
