import React from 'react';
import { FeedbackEntry } from '../types';
import { Plus } from 'lucide-react';
import { Button } from './Button';

interface DashboardProps {
    feedbacks: FeedbackEntry[];
    onCreateNew: () => void;
    onViewFeedback: (feedback: FeedbackEntry) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ feedbacks, onCreateNew, onViewFeedback }) => {
    // Stats Logic
    const totalFeedbacks = feedbacks.length;

    const last30DaysCount = feedbacks.filter(f => {
        const date = new Date(f.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return date >= thirtyDaysAgo;
    }).length;

    const modelBreakdown = feedbacks.reduce((acc, curr) => {
        acc[curr.modelType] = (acc[curr.modelType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Recent Feedback (Top 3)
    // Assuming feedbacks are not guaranteed to be sorted, we sort them by date desc
    const recentFeedbacks = [...feedbacks]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                <Button onClick={onCreateNew} className="md:w-auto w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Feedback
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Feedbacks */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-40">
                    <span className="text-sm font-medium text-gray-500">Total Feedbacks</span>
                    <span className="text-5xl font-bold text-gray-900">{totalFeedbacks}</span>
                </div>

                {/* Last 30 Days */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-40">
                    <span className="text-sm font-medium text-gray-500">Last 30 Days</span>
                    <span className="text-5xl font-bold text-gray-900">{last30DaysCount}</span>
                </div>

                {/* Model Breakdown */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-40 overflow-y-auto">
                    <span className="text-sm font-medium text-gray-500 block mb-3">Model Breakdown</span>
                    <div className="space-y-2">
                        {Object.entries(modelBreakdown).map(([model, count]) => (
                            <div key={model} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">{model}</span>
                                <span className="font-semibold text-gray-900">{count}</span>
                            </div>
                        ))}
                        {Object.keys(modelBreakdown).length === 0 && (
                            <p className="text-gray-400 text-sm">No data yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Feedback Section */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Feedback</h2>
                <div className="space-y-4">
                    {recentFeedbacks.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No recent feedback found.</p>
                        </div>
                    ) : (
                        recentFeedbacks.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                                onClick={() => onViewFeedback(item)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">{item.recipientName}</h3>
                                    <span className="text-sm text-gray-500">
                                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="mb-3">
                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded uppercase tracking-wider">
                                        {item.modelType}
                                    </span>
                                </div>
                                <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                                    {item.generatedText}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
