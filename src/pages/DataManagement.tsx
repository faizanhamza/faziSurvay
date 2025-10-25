import { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { storage } from '../utils/storage';
import { Download, Upload, Trash2, Database, AlertTriangle } from 'lucide-react';

export function DataManagement() {
  const { currentSchool } = useSchool();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!currentSchool) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No school selected</p>
      </div>
    );
  }

  const stats = {
    surveys: storage.getSurveys(currentSchool.id).length,
    responses: storage.getResponses(currentSchool.id).length,
    files: storage.getFiles(currentSchool.id).length,
  };

  const handleExport = () => {
    const data = storage.exportSchoolData(currentSchool.id);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentSchool.name.replace(/\s+/g, '_')}_data_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAll = () => {
    const data = storage.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all_schools_data_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Are you absolutely sure? This will delete all data for this school!')) {
      storage.clearSchoolData(currentSchool.id);
      setShowClearConfirm(false);
      window.location.reload();
    }
  };

  const getStorageSize = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return (total / 1024).toFixed(2);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Data Management</h1>
        <p className="text-slate-600 mt-2">Export, import, and manage your data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Surveys</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.surveys}</p>
            </div>
            <Database className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Responses</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.responses}</p>
            </div>
            <Database className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Files</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.files}</p>
            </div>
            <Database className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Storage Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Current School</span>
              <span className="font-semibold text-slate-900">{currentSchool.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Total Storage Used</span>
              <span className="font-semibold text-slate-900">{getStorageSize()} KB</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">Storage Type</span>
              <span className="font-semibold text-slate-900">Local Storage</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Export Data</h2>
          <p className="text-slate-600 mb-4">
            Download your data as JSON for backup or analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExport}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Current School
            </button>
            <button
              onClick={handleExportAll}
              className="flex items-center justify-center px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All Schools
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Import Data</h2>
          <p className="text-slate-600 mb-4">
            Import previously exported data (UI placeholder - would need backend)
          </p>
          <button
            disabled
            className="flex items-center justify-center px-4 py-2 bg-slate-300 text-slate-600 rounded-md cursor-not-allowed"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Data (Coming Soon)
          </button>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-semibold text-red-900 mb-2">Danger Zone</h2>
              <p className="text-red-700 mb-4">
                Permanently delete all data for this school. This action cannot be undone.
              </p>
            </div>
          </div>

          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-red-900 font-semibold">
                Are you absolutely sure? This will delete:
              </p>
              <ul className="list-disc list-inside text-red-800 space-y-1 ml-2">
                <li>{stats.surveys} surveys</li>
                <li>{stats.responses} responses</li>
                <li>{stats.files} files</li>
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Yes, Delete Everything
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
