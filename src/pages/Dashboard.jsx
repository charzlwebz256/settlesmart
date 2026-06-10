import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowRight, CheckCircle2, MapPin, Sparkles, BookOpen, Briefcase,
  Home as HomeIcon, Scale, Heart, Loader2, MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardCalendar from '@/components/dashboard/DashboardCalendar';
import AIRecommendations from '@/components/dashboard/AIRecommendations';
import WeatherWidget from '@/components/news/WeatherWidget';

const interestConfig = {
  education: { icon: BookOpen, color: 'text-blue-600 bg-blue-500/10', label: 'Education & Language' },
  employment: { icon: Briefcase, color: 'text-amber-600 bg-amber-500/10', label: 'Jobs & Career' },
  housing: { icon: HomeIcon, color: 'text-emerald-600 bg-emerald-500/10', label: 'Housing' },
  legal: { icon: Scale, color: 'text-purple-600 bg-purple-500/10', label: 'Legal & Immigration' },
  health: { icon: Heart, color: 'text-rose-600 bg-rose-500/10', label: 'Health & Wellness' },
  volunteering: { icon: Sparkles, color: 'text-orange-600 bg-orange-500/10', label: 'Volunteering' },
};

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const results = await base44.entities.UserProfile.filter({ created_by: user.email });
      return results[0] || null;
    },
  });

  const { data: checklist } = useQuery({
    queryKey: ['myChecklist'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.ChecklistItem.filter({ created_by: user.email }, 'order');
    },
    initialData: [],
  });

  const { data: savedResources } = useQuery({
    queryKey: ['savedResources'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.SavedResource.filter({ created_by: user.email });
    },
    initialData: [],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    navigate('/onboarding');
    return null;
  }

  const completedChecklist = checklist.filter(c => c.is_completed).length;
  const totalChecklist = checklist.length;
  const checklistProgress = totalChecklist > 0 ? (completedChecklist / totalChecklist) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-8">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
          <MapPin className="w-4 h-4" />
          {profile.city}, {profile.province}
        </div>
        <h1 className="font-heading font-bold text-2xl md:text-3xl">
          Welcome to your settlement journey 🍁
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here's your personalized dashboard based on your goals
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Checklist Progress */}
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading font-bold text-lg">Settlement Checklist</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {completedChecklist}/{totalChecklist} steps completed
                </p>
              </div>
              <Link to="/checklist">
                <Button variant="outline" size="sm" className="rounded-lg text-xs gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <Progress value={checklistProgress} className="h-2 mb-4" />
            <div className="space-y-2">
              {checklist.slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${item.is_completed ? 'text-primary' : 'text-muted-foreground/30'}`} />
                  <span className={`text-sm ${item.is_completed ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                    {item.title}
                  </span>
                </div>
              ))}
              {totalChecklist === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">Start your checklist to track your progress</p>
                  <Link to="/checklist">
                    <Button size="sm" className="mt-3 rounded-lg gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate My Checklist
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* AI Recommendations */}
          <AIRecommendations profile={profile} />

          {/* Interest-based quick links */}
          {(profile.interests || []).length > 0 && (
            <div className="bg-card rounded-2xl border border-border/50 p-6">
              <h2 className="font-heading font-bold text-lg mb-4">Your Interest Areas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(profile.interests || []).map(interest => {
                  const config = interestConfig[interest];
                  if (!config) return null;
                  const Icon = config.icon;
                  return (
                    <Link key={interest} to={`/services?category=${interest}`}>
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/20 hover:shadow-md transition-all group">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{config.label}</p>
                          <p className="text-xs text-muted-foreground">Explore services</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <h3 className="font-heading font-bold text-base mb-4">Your Profile</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status</span>
                <Badge variant="secondary" className="capitalize text-xs">
                  {profile.immigration_status?.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Location</span>
                <span className="text-xs font-medium">{profile.city}, {profile.province}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">English</span>
                <Badge variant="outline" className="capitalize text-xs">{profile.english_level}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Saved Services</span>
                <span className="text-xs font-medium">{savedResources.length}</span>
              </div>
            </div>
            <Link to="/profile" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full rounded-lg text-xs">
                Edit Profile
              </Button>
            </Link>
          </div>

          {/* Live Weather */}
          <div>
            <h3 className="font-heading font-bold text-base mb-3">Live Weather</h3>
            <WeatherWidget city={profile.city} province={profile.province} />
          </div>

          {/* Calendar */}
          <DashboardCalendar />

          {/* AI Assistant CTA */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/10 p-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-base mb-2">Need Help?</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Ask our AI assistant anything about settling in Canada
            </p>
            <Link to="/assistant">
              <Button size="sm" className="w-full rounded-lg gap-2 bg-primary hover:bg-primary/90">
                <Sparkles className="w-3.5 h-3.5" />
                Chat with AI
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}