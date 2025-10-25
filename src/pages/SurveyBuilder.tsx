import { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  FileText,
  X,
} from 'lucide-react';
import { Survey, Question } from '../types';

export function SurveyBuilder() {
  const { currentSchool } = useSchool();
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<Survey[]>(
    currentSchool ? storage.getSurveys(currentSchool.id) : []
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  const [viewingResponses, setViewingResponses] = useState<string | null>(null);

  const [newSurvey, setNewSurvey] = useState<Partial<Survey>>({
    title: '',
    description: '',
    questions: [],
    status: 'draft',
  });

  const addQuestion = () => {
    if (!newSurvey.questions) return;
    const question: Question = {
      id: `q${newSurvey.questions.length + 1}`,
      type: 'text',
      question: '',
      required: false,
    };
    setNewSurvey({
      ...newSurvey,
      questions: [...newSurvey.questions, question],
    });
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    if (!newSurvey.questions) return;
    const updated = [...newSurvey.questions];
    updated[index] = { ...updated[index], [field]: value };
    setNewSurvey({ ...newSurvey, questions: updated });
  };

  const removeQuestion = (index: number) => {
    if (!newSurvey.questions) return;
    setNewSurvey({
      ...newSurvey,
      questions: newSurvey.questions.filter((_, i) => i !== index),
    });
  };

  const saveSurvey = () => {
    if (!currentSchool || !user || !newSurvey.title) return;

    if (editingSurvey) {
      const updated: Survey = {
        ...editingSurvey,
        title: newSurvey.title,
        description: newSurvey.description || '',
        questions: newSurvey.questions || [],
        status: newSurvey.status as 'draft' | 'published',
      };
      storage.updateSurvey(currentSchool.id, updated);
    } else {
      const survey: Survey = {
        id: `survey-${Date.now()}`,
        schoolId: currentSchool.id,
        title: newSurvey.title,
        description: newSurvey.description || '',
        questions: newSurvey.questions || [],
        status: newSurvey.status as 'draft' | 'published',
        createdAt: new Date().toISOString(),
        createdBy: user.id,
      };
      storage.addSurvey(currentSchool.id, survey);
    }

    setSurveys(storage.getSurveys(currentSchool.id));
    closeModal();
  };

  const deleteSurvey = (id: string) => {
    if (currentSchool && confirm('Delete this survey?')) {
      storage.deleteSurvey(currentSchool.id, id);
      setSurveys(storage.getSurveys(currentSchool.id));
    }
  };

  const openEditModal = (survey: Survey) => {
    setEditingSurvey(survey);
    setNewSurvey({
      title: survey.title,
      description: survey.description,
      questions: survey.questions,
      status: survey.status,
    });
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingSurvey(null);
    setNewSurvey({
      title: '',
      description: '',
      questions: [],
      status: 'draft',
    });
  };

  const getResponses = (surveyId: string) => {
    if (!currentSchool) return [];
    return storage.getResponses(currentSchool.id).filter((r) => r.surveyId === surveyId);
  };

  if (!currentSchool) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No school selected</p>
      </div>
    );
  }

  if (viewingResponses) {
    const survey = surveys.find((s) => s.id === viewingResponses);
    const responses = getResponses(viewingResponses);

    return (
      <div>
        <button
          onClick={() => setViewingResponses(null)}
          className="mb-4 text-blue-600 hover:text-blue-700"
        >
          ← Back to Surveys
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{survey?.title}</h1>
          <p className="text-slate-600 mt-2">{responses.length} responses</p>
        </div>

        <div className="space-y-4">
          {responses.map((response, idx) => (
            <div key={response.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-900">
                  Response #{idx + 1}
                </span>
                <div className="flex items-center space-x-3 text-sm text-slate-600">
                  {response.anonymous && (
                    <span className="px-2 py-1 bg-slate-100 rounded">Anonymous</span>
                  )}
                  <span>{new Date(response.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                {survey?.questions.map((q) => (
                  <div key={q.id}>
                    <p className="text-sm font-medium text-slate-700">{q.question}</p>
                    <p className="text-sm text-slate-900 mt-1">
                      {response.answers[q.id] || '(No answer)'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {responses.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No responses yet</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Survey Builder</h1>
          <p className="text-slate-600 mt-2">Create and manage surveys</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Survey
        </button>
      </div>

      <div className="space-y-4">
        {surveys.map((survey) => {
          const responses = getResponses(survey.id);
          return (
            <div key={survey.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-slate-900">{survey.title}</h3>
                    {survey.status === 'published' ? (
                      <span className="flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Published
                      </span>
                    ) : (
                      <span className="flex items-center px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                        <Clock className="w-3 h-3 mr-1" />
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 mb-3">{survey.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <span>{survey.questions.length} questions</span>
                    <span>•</span>
                    <span>{responses.length} responses</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewingResponses(survey.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="View Responses"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openEditModal(survey)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteSurvey(survey.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {surveys.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No surveys yet</h3>
            <p className="text-slate-600">Create your first survey to get started</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full my-8">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingSurvey ? 'Edit Survey' : 'Create Survey'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newSurvey.title}
                  onChange={(e) => setNewSurvey({ ...newSurvey, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Survey title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newSurvey.description}
                  onChange={(e) => setNewSurvey({ ...newSurvey, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Survey description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={newSurvey.status}
                  onChange={(e) =>
                    setNewSurvey({ ...newSurvey, status: e.target.value as 'draft' | 'published' })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-slate-700">Questions</label>
                  <button
                    onClick={addQuestion}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Question
                  </button>
                </div>

                <div className="space-y-4">
                  {newSurvey.questions?.map((q, idx) => (
                    <div key={q.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-slate-700">
                          Question {idx + 1}
                        </span>
                        <button
                          onClick={() => removeQuestion(idx)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <select
                          value={q.type}
                          onChange={(e) => updateQuestion(idx, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="text">Text</option>
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="rating">Rating (1-5)</option>
                          <option value="yes-no">Yes/No</option>
                        </select>

                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => updateQuestion(idx, 'question', e.target.value)}
                          placeholder="Enter question"
                          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {q.type === 'multiple-choice' && (
                          <textarea
                            value={q.options?.join('\n') || ''}
                            onChange={(e) =>
                              updateQuestion(idx, 'options', e.target.value.split('\n'))
                            }
                            placeholder="Enter options (one per line)"
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}

                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={(e) => updateQuestion(idx, 'required', e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700">Required</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSurvey}
                disabled={!newSurvey.title}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingSurvey ? 'Update' : 'Create'} Survey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
