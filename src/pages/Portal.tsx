import { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';
import { FileText, CheckCircle, X } from 'lucide-react';
import { Survey, Question, SurveyResponse } from '../types';

export function Portal() {
  const { currentSchool } = useSchool();
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<Survey[]>(
    currentSchool ? storage.getSurveys(currentSchool.id).filter((s) => s.status === 'published') : []
  );
  const [takingSurvey, setTakingSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const startSurvey = (survey: Survey) => {
    setTakingSurvey(survey);
    setAnswers({});
    setAnonymous(false);
    setSubmitted(false);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const submitSurvey = () => {
    if (!takingSurvey || !currentSchool || !user) return;

    const requiredQuestions = takingSurvey.questions.filter((q) => q.required);
    const allRequiredAnswered = requiredQuestions.every((q) => answers[q.id]?.trim());

    if (!allRequiredAnswered) {
      alert('Please answer all required questions');
      return;
    }

    const response: SurveyResponse = {
      id: `resp-${Date.now()}`,
      surveyId: takingSurvey.id,
      schoolId: currentSchool.id,
      answers,
      anonymous,
      submittedBy: anonymous ? undefined : user.id,
      submittedAt: new Date().toISOString(),
    };

    storage.addResponse(currentSchool.id, response);
    setSubmitted(true);
  };

  const closeSurvey = () => {
    setTakingSurvey(null);
    setAnswers({});
    setAnonymous(false);
    setSubmitted(false);
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'text':
        return (
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your answer"
          />
        );

      case 'multiple-choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'rating':
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleAnswerChange(question.id, rating.toString())}
                className={`w-12 h-12 rounded-md border-2 transition-all ${
                  answers[question.id] === rating.toString()
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-slate-300 hover:border-blue-300 text-slate-700'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        );

      case 'yes-no':
        return (
          <div className="flex space-x-3">
            {['Yes', 'No'].map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerChange(question.id, option)}
                className={`px-6 py-2 rounded-md border-2 transition-all ${
                  answers[question.id] === option
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-slate-300 hover:border-blue-300 text-slate-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentSchool) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No school selected</p>
      </div>
    );
  }

  if (takingSurvey) {
    if (submitted) {
      return (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
            <p className="text-slate-600 mb-6">Your response has been submitted successfully.</p>
            <button
              onClick={closeSurvey}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Portal
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-slate-200 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{takingSurvey.title}</h2>
              <p className="text-slate-600 mt-1">{takingSurvey.description}</p>
            </div>
            <button
              onClick={closeSurvey}
              className="p-2 hover:bg-slate-100 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {takingSurvey.questions.map((question, idx) => (
              <div key={question.id} className="pb-6 border-b border-slate-200 last:border-0">
                <label className="block text-sm font-medium text-slate-900 mb-3">
                  {idx + 1}. {question.question}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderQuestion(question)}
              </div>
            ))}

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Submit anonymously</span>
            </label>
          </div>

          <div className="p-6 border-t border-slate-200 flex justify-end">
            <button
              onClick={submitSurvey}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit Survey
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allSurveys = showPreview
    ? storage.getSurveys(currentSchool.id)
    : storage.getSurveys(currentSchool.id).filter((s) => s.status === 'published');

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Portal</h1>
          <p className="text-slate-600 mt-2">Available surveys and resources</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPreview}
              onChange={(e) => setShowPreview(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Preview Mode (show drafts)</span>
          </label>
        )}
      </div>

      <div className="space-y-4">
        {allSurveys.map((survey) => {
          const responses = storage
            .getResponses(currentSchool.id)
            .filter((r) => r.surveyId === survey.id);

          return (
            <div key={survey.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-slate-900">{survey.title}</h3>
                    {survey.status === 'draft' && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
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

                {survey.status === 'published' && (
                  <button
                    onClick={() => startSurvey(survey)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Take Survey
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {allSurveys.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No surveys available</h3>
            <p className="text-slate-600">Check back later for new surveys</p>
          </div>
        )}
      </div>
    </div>
  );
}
