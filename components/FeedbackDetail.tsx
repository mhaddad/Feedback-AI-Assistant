import React from 'react';
import { FeedbackEntry } from '../types';
import { X, Calendar, User, MessageSquare, Share2, Copy } from 'lucide-react';
import { Button } from './Button';

interface FeedbackDetailProps {
    feedback: FeedbackEntry;
    onClose: () => void;
}

export const FeedbackDetail: React.FC<FeedbackDetailProps> = ({ feedback, onClose }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(feedback.generatedText);
        // Could add a toast notification here
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Feedback Details</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Created on {new Date(feedback.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Metadata Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-2 text-blue-700 mb-1">
                                <User className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Recipient</span>
                            </div>
                            <p className="font-semibold text-gray-900 truncate">{feedback.recipientName}</p>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <div className="flex items-center gap-2 text-purple-700 mb-1">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Model</span>
                            </div>
                            <p className="font-semibold text-gray-900">{feedback.modelType}</p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <div className="flex items-center gap-2 text-green-700 mb-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Date</span>
                            </div>
                            <p className="font-semibold text-gray-900">
                                {new Date(feedback.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Generated Text */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Generated Feedback</h3>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 text-gray-600">
                                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                                    Copy
                                </Button>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                            {feedback.generatedText}
                        </div>
                    </div>

                    {/* Input Data (Optional - collapsible or separate section) */}
                    {Object.keys(feedback.inputData).length > 0 && (
                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Input Context</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(feedback.inputData).map(([key, value]) => (
                                    <div key={key} className="text-sm">
                                        <span className="text-gray-500 block mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="text-gray-900 font-medium">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Feedback
                    </Button>
                </div>
            </div>
        </div>
    );
};
