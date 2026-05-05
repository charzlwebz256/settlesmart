import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Explore from './pages/Explore';
import Work from './pages/Work';
import Resources from './pages/Resources';
import Assistant from './pages/Assistant';
import Checklist from './pages/Checklist';
import Profile from './pages/Profile';
import TransitMap from './pages/TransitMap';
import Events from './pages/Events';
import Jobs from './pages/Jobs';
import Legal from './pages/Legal';
import Emergency from './pages/Emergency';
import NearMe from './pages/NearMe';
import CanadianNewsUpdates from './pages/CanadianNewsUpdates';
import About from './pages/About';
import Contact from './pages/Contact';
import Education from './pages/Education';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Volunteer from './pages/Volunteer';
import ResumeBuilder from './pages/ResumeBuilder';
import JobTracker from './pages/JobTracker';
import InterviewPrep from './pages/InterviewPrep';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/work" element={<Work />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/transit-map" element={<TransitMap />} />
        <Route path="/events" element={<Events />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/near-me" element={<NearMe />} />
        <Route path="/news" element={<CanadianNewsUpdates />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/education" element={<Education />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/job-tracker" element={<JobTracker />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
      </Route>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (e) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    apply(mq);
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App