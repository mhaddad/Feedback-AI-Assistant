import React, { useState, useEffect } from 'react';
import { User, AppState, FeedbackEntry } from './types';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CreateFeedback } from './components/CreateFeedback';
import { Menu } from 'lucide-react';
import { getCurrentUser, onAuthStateChange, signOut } from './services/authService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AppState>('dashboard');
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    initAuth();

    // Listen for auth state changes
    const subscription = onAuthStateChange((authUser) => {
      setUser(authUser);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load feedbacks from local storage on mount (Mock persistence)
  useEffect(() => {
    const saved = localStorage.getItem('feedback_app_data');
    if (saved) {
      try {
        setFeedbacks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved feedback", e);
      }
    }
  }, []);

  // Save feedbacks whenever they change
  useEffect(() => {
    if (feedbacks.length > 0) {
      localStorage.setItem('feedback_app_data', JSON.stringify(feedbacks));
    }
  }, [feedbacks]);

  const handleLogin = () => {
    // Auth state will be updated by the listener
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setMobileMenuOpen(false);
  };

  const handleCreateNew = () => {
    setActiveTab('create');
    setMobileMenuOpen(false);
  };

  const handleSaveFeedback = (newFeedback: FeedbackEntry) => {
    setFeedbacks(prev => [newFeedback, ...prev]);
    setActiveTab('dashboard');
  };

  const handleViewFeedback = (feedback: FeedbackEntry) => {
    // In a real app, this might open a detail view. 
    // For now, we'll just log it or could implement a detail modal.
    console.log("View feedback", feedback);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-slate-900">
      <Sidebar
        activeTab={activeTab}
        onNavigate={(tab) => { setActiveTab(tab); setMobileMenuOpen(false); }}
        onLogout={handleLogout}
        user={user}
      />

      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-20">
        <span className="font-bold text-lg tracking-tight">Feedback AI</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-30 md:hidden pt-20 px-6">
          <button
            className="absolute top-4 right-4 text-gray-500"
            onClick={() => setMobileMenuOpen(false)}
          >Close</button>
          <nav className="flex flex-col gap-4">
            <button onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false) }} className="text-xl font-medium text-left">Dashboard</button>
            <button onClick={() => { setActiveTab('create'); setMobileMenuOpen(false) }} className="text-xl font-medium text-left">Create Feedback</button>
            <button onClick={handleLogout} className="text-xl font-medium text-left text-red-600 mt-8">Sign Out</button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="md:pl-64 min-h-screen transition-all duration-300 ease-in-out">
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              feedbacks={feedbacks}
              onCreateNew={handleCreateNew}
              onViewFeedback={handleViewFeedback}
            />
          )}
          {activeTab === 'create' && (
            <CreateFeedback
              user={user}
              onCancel={() => setActiveTab('dashboard')}
              onSave={handleSaveFeedback}
            />
          )}
          {activeTab === 'history' && (
            <Dashboard
              feedbacks={feedbacks}
              onCreateNew={handleCreateNew}
              onViewFeedback={handleViewFeedback}
            />
          )}
          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              <p className="text-gray-500 mt-2">Configuration options would go here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;