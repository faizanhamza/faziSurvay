import { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { School as SchoolIcon, Plus, ArrowRight, BarChart3 } from 'lucide-react';
import { COLOR_PRESETS } from '../utils/mockData';
import { School, ColorScheme } from '../types';

export function SchoolManagement() {
  const { allSchools, currentSchool, switchSchool, createSchool, getSchoolStats } = useSchool();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSchool, setNewSchool] = useState({
    name: '',
    tagline: '',
    logo: '',
    colorScheme: COLOR_PRESETS[0],
    font: 'Inter',
    template: 'modern',
  });

  const handleCreateSchool = () => {
    if (!newSchool.name) return;
    createSchool(newSchool);
    setShowCreateModal(false);
    setNewSchool({
      name: '',
      tagline: '',
      logo: '',
      colorScheme: COLOR_PRESETS[0],
      font: 'Inter',
      template: 'modern',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">School Management</h1>
          <p className="text-slate-600 mt-2">Manage multiple school portals</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create School
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allSchools.map((school) => {
          const stats = getSchoolStats(school.id);
          const isActive = currentSchool?.id === school.id;

          return (
            <div
              key={school.id}
              className={`bg-white rounded-lg shadow-md p-6 transition-all ${
                isActive ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {school.logo && (
                <img
                  src={school.logo}
                  alt={school.name}
                  className="h-16 w-16 object-contain mb-4"
                />
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-1">{school.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{school.tagline}</p>

              {isActive && (
                <div className="mb-4 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full inline-block">
                  Active School
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Surveys</span>
                  <span className="font-semibold text-slate-900">{stats.surveyCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Files</span>
                  <span className="font-semibold text-slate-900">{stats.fileCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Responses</span>
                  <span className="font-semibold text-slate-900">{stats.responseCount}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: school.colorScheme.primary }}
                />
                <span className="text-sm text-slate-600">{school.colorScheme.name}</span>
              </div>

              {!isActive && (
                <button
                  onClick={() => switchSchool(school.id)}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
                >
                  Switch To
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Create New School</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  value={newSchool.name}
                  onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Lincoln Academy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={newSchool.tagline}
                  onChange={(e) => setNewSchool({ ...newSchool, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Inspiring Excellence Since 1995"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Color Scheme
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setNewSchool({ ...newSchool, colorScheme: preset })}
                      className={`p-3 border-2 rounded-md transition-all ${
                        newSchool.colorScheme.name === preset.name
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: preset.secondary }}
                        />
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <p className="text-xs font-medium text-slate-700">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSchool}
                disabled={!newSchool.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create School
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
