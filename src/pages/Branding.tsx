import { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Palette, Save, Check } from 'lucide-react';
import { COLOR_PRESETS } from '../utils/mockData';

export function Branding() {
  const { currentSchool, updateSchool } = useSchool();
  const [schoolData, setSchoolData] = useState(currentSchool);
  const [saved, setSaved] = useState(false);

  if (!currentSchool || !schoolData) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No school selected</p>
      </div>
    );
  }

  const handleSave = () => {
    if (schoolData) {
      updateSchool(schoolData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSchoolData({ ...schoolData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Branding</h1>
        <p className="text-slate-600 mt-2">Customize your school's appearance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  value={schoolData.name}
                  onChange={(e) => setSchoolData({ ...schoolData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={schoolData.tagline}
                  onChange={(e) => setSchoolData({ ...schoolData, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {schoolData.logo && (
                  <img
                    src={schoolData.logo}
                    alt="Logo preview"
                    className="mt-3 h-20 w-20 object-contain border border-slate-200 rounded"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Color Scheme</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setSchoolData({ ...schoolData, colorScheme: preset })}
                  className={`p-4 border-2 rounded-md transition-all ${
                    schoolData.colorScheme.name === preset.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <p className="text-sm font-medium text-slate-700">{preset.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Typography</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Font Family
              </label>
              <select
                value={schoolData.font}
                onChange={(e) => setSchoolData({ ...schoolData, font: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Inter">Inter (Modern Sans)</option>
                <option value="Georgia">Georgia (Classic Serif)</option>
                <option value="Roboto">Roboto (Clean Sans)</option>
                <option value="Merriweather">Merriweather (Elegant Serif)</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Template Style</h2>
            <div className="grid grid-cols-2 gap-3">
              {['modern', 'classic', 'minimal', 'bold'].map((template) => (
                <button
                  key={template}
                  onClick={() => setSchoolData({ ...schoolData, template })}
                  className={`p-4 border-2 rounded-md transition-all capitalize ${
                    schoolData.template === template
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {saved ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Preview</h2>
            <div
              className="border-2 border-slate-200 rounded-lg p-4"
              style={{ fontFamily: schoolData.font }}
            >
              {schoolData.logo && (
                <img
                  src={schoolData.logo}
                  alt="Logo"
                  className="h-12 w-12 object-contain mb-3"
                />
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-1">{schoolData.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{schoolData.tagline}</p>

              <div className="space-y-2">
                <button
                  className="w-full py-2 rounded text-white text-sm font-medium"
                  style={{ backgroundColor: schoolData.colorScheme.primary }}
                >
                  Primary Button
                </button>
                <button
                  className="w-full py-2 rounded text-white text-sm font-medium"
                  style={{ backgroundColor: schoolData.colorScheme.secondary }}
                >
                  Secondary Button
                </button>
                <div
                  className="p-3 rounded text-sm"
                  style={{
                    backgroundColor: `${schoolData.colorScheme.accent}20`,
                    color: schoolData.colorScheme.primary,
                  }}
                >
                  Accent Color Sample
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
