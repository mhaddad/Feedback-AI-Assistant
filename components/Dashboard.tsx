import React from 'react';
import { FeedbackEntry } from '../types';
import { Plus, Search, MoreHorizontal } from 'lucide-react';
import { Button } from './Button';

interface DashboardProps {
  feedbacks: FeedbackEntry[];
  onCreateNew: () => void;
  onViewFeedback: (feedback: FeedbackEntry) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ feedbacks, onCreateNew, onViewFeedback }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredFeedbacks = feedbacks.filter(f => 
    f.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.generatedText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">All Feedback</h1>
          <p className="text-gray-500 mt-1">Manage and review your feedback history.</p>
        </div>
        <Button onClick={onCreateNew} className="md:w-auto w-full">
          <Plus className="w-4 h-4 mr-2" />
          Create New Feedback
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or content..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No feedback found</h3>
            <p className="text-gray-500 mt-1 mb-6">Get started by creating your first structured feedback.</p>
            <Button variant="outline" onClick={onCreateNew}>Create Feedback</Button>
          </div>
        ) : (
          filteredFeedbacks.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => onViewFeedback(item)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.recipientName}</h3>
                  <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded uppercase tracking-wider">
                    {item.modelType}
                  </span>
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                {item.generatedText}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};