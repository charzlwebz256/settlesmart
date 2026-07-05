import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { LocationProvider } from '@/lib/LocationContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';
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
import ShopSmart from './pages/ShopSmart';
import SupportUs from './pages/SupportUs';
import MeetTheDeveloper from './pages/MeetTheDeveloper';
import JobCoach from './pages/JobCoach';
import Scholarships from './pages/Scholarships';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedSignInPrompt from '@/components/ProtectedSignInPrompt';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Only block the whole app for unregistered users. An "auth_required" app
  // state just means the visitor isn't signed in — public pages stay
  // accessible; protected routes show a sign-in prompt via ProtectedRoute.
  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<AppLayout />}>
        {/* Publicly browseable without sign-in */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/work" element={<Work />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/transit-map" element={<TransitMap />} />
        <Route path="/events" element={<Events />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/near-me" element={<NearMe />} />
        <Route path="/news" element={<CanadianNewsUpdates />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/education" element={<Education />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/shop-smart" element={<ShopSmart />} />
        <Route path="/support-us" element={<SupportUs />} />
        <Route path="/meet-the-developer" element={<MeetTheDeveloper />} />

        {/* Sign in required — personal data & tracked actions */}
        <Route element={<ProtectedRoute unauthenticatedElement={<ProtectedSignInPrompt />} />}>
          <Route path="/services" element={<Services />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/job-tracker" element={<JobTracker />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/job-coach" element={<JobCoach />} />
        </Route>
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
        <LocationProvider>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </LocationProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App