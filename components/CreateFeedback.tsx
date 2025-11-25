import React, { useState } from 'react';
import { FeedbackModelType, FeedbackEntry, User } from '../types';
import { FEEDBACK_MODELS } from '../constants';
import { generateFeedbackWithGemini } from '../services/geminiService';
import { ArrowLeft, Check, RefreshCcw, Sparkles, Copy, Save } from 'lucide-react';
import { Button } from './Button';

interface CreateFeedbackProps {
  user: User;
  onCancel: () => void;
  onSave: (feedback: Omit<FeedbackEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

type Step = 'model' | 'input' | 'review';

export const CreateFeedback: React.FC<CreateFeedbackProps> = ({ user, onCancel, onSave }) => {
  const [step, setStep] = useState<Step>('model');
  const [selectedModelType, setSelectedModelType] = useState<FeedbackModelType | null>(null);

  // Form State
  const [recipientName, setRecipientName] = useState('');
  const [relationship, setRelationship] = useState('Colleague');
  const [inputData, setInputData] = useState<Record<string, string>>({});

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const selectedModelDef = FEEDBACK_MODELS.find(m => m.type === selectedModelType);

  const handleModelSelect = (type: FeedbackModelType) => {
    setSelectedModelType(type);
    setStep('input');
    // Reset inputs when model changes
    setInputData({});
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setInputData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedModelType || !recipientName) return;

    setIsGenerating(true);
    setError(null);
    try {
      const text = await generateFeedbackWithGemini(
        recipientName,
        user.name,
        relationship,
        selectedModelType,
        inputData
      );
      setGeneratedText(text);
      setStep('review');
    } catch (e) {
      setError("Something went wrong while generating feedback. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!selectedModelType) return;

    const newFeedback: Omit<FeedbackEntry, 'id' | 'createdAt' | 'updatedAt'> = {
      recipientName,
      authorName: user.name,
      relationship,
      modelType: selectedModelType,
      inputData,
      generatedText,
    };

    onSave(newFeedback);
  };

  // Render Step 1: Model Selection
  if (step === 'model') {
    return (
      <div className="max-w-5xl mx-auto fade-in">
        <div className="mb-8">
          <Button variant="ghost" onClick={onCancel} className="mb-4 pl-0">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Choose Your Feedback Model</h1>
          <p className="text-gray-500 text-lg">Select a framework to structure your feedback with AI assistance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEEDBACK_MODELS.map((model) => (
            <div
              key={model.type}
              onClick={() => handleModelSelect(model.type)}
              className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-primary/50 cursor-pointer transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center mb-6">
                  {/* Icons would ideally be dynamic here, mapping strings to components */}
                  <span className="font-bold text-xl">{model.type.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{model.title}</h3>
                <p className="text-gray-500 leading-relaxed">{model.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render Step 2: Input Form
  if (step === 'input' && selectedModelDef) {
    return (
      <div className="max-w-3xl mx-auto fade-in pb-20">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" onClick={() => setStep('model')} className="h-10 w-10 p-0 rounded-full border border-gray-200">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Generate Structured Feedback</h1>
            <p className="text-sm text-gray-500">Using {selectedModelDef.title}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-8">
          {/* Metadata Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Recipient Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="e.g. John Doe"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Relationship</label>
              <select
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
              >
                <option value="Colleague">Colleague</option>
                <option value="Direct Report">Direct Report</option>
                <option value="Manager">Manager</option>
                <option value="Client">Client</option>
              </select>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Dynamic Model Fields */}
          <div className="space-y-8">
            {selectedModelDef.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-semibold text-gray-900">
                    {field.label} {field.isOptional && <span className="text-gray-400 font-normal">(Optional)</span>}
                  </label>
                </div>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all min-h-[100px] resize-y"
                  placeholder={field.placeholder}
                  value={inputData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
                <p className="text-xs text-gray-500">{field.description}</p>
              </div>
            ))}
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="pt-4">
            <Button
              onClick={handleGenerate}
              isLoading={isGenerating}
              disabled={!recipientName || Object.keys(inputData).length === 0}
              className="w-full py-4 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Feedback
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render Step 3: Review
  if (step === 'review') {
    return (
      <div className="max-w-4xl mx-auto fade-in">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setStep('input')} className="h-10 w-10 p-0 rounded-full border border-gray-200">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Review Your Feedback</h1>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 uppercase tracking-wide">
              {selectedModelDef?.title}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="p-8">
            <p className="text-sm text-gray-500 mb-4">
              Review the generated text below. You can save it directly or edit it first.
            </p>
            <textarea
              className="w-full min-h-[400px] p-6 bg-gray-50 border border-gray-100 rounded-xl text-gray-800 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y font-sans"
              value={generatedText}
              onChange={(e) => setGeneratedText(e.target.value)}
            />
          </div>
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <Button variant="ghost" onClick={handleGenerate} isLoading={isGenerating}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>

            <div className="flex gap-3 w-full md:w-auto">
              <Button variant="outline" onClick={() => { navigator.clipboard.writeText(generatedText) }}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={handleSave} className="flex-1 md:flex-none">
                <Save className="w-4 h-4 mr-2" />
                Save Feedback
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};