import React from 'react';
import { Users, Gift, DollarSign, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getGHLValue, parseGHLNumber } from '@/lib/ghl-templates';
import { useToast } from '@/hooks/use-toast';

// GHL Template variables for referral tracking
const REFERRAL_FEE = 750;
const MAX_REFERRALS_FOR_MILESTONES = 5;

// Get referral data from GHL or use preview defaults
function getReferralData() {
  const totalReferrals = parseGHLNumber('{{contact.referral_count}}', 3);
  const pendingReferrals = parseGHLNumber('{{contact.referral_pending_count}}', 1);
  const completedReferrals = parseGHLNumber('{{contact.referral_completed_count}}', 2);
  const totalEarned = parseGHLNumber('{{contact.referral_total_earned}}', completedReferrals * REFERRAL_FEE);
  const referralCode = getGHLValue('{{contact.referral_code}}', 'GIANTS-REF-2024');
  
  // Parse individual referrals from GHL (stored as JSON or comma-separated)
  const referralsJson = getGHLValue('{{contact.referrals_list}}', '');
  let referrals: Array<{ name: string; status: 'pending' | 'completed'; date: string }> = [];
  
  if (referralsJson && !referralsJson.includes('{{')) {
    try {
      referrals = JSON.parse(referralsJson);
    } catch {
      // Fallback to preview data
    }
  }
  
  // Preview data if no GHL data
  if (referrals.length === 0) {
    referrals = [
      { name: 'Sarah Johnson', status: 'completed', date: '2024-01-15' },
      { name: 'Michael Chen', status: 'completed', date: '2024-02-20' },
      { name: 'Emily Davis', status: 'pending', date: '2024-03-10' },
    ];
  }
  
  return {
    totalReferrals,
    pendingReferrals,
    completedReferrals,
    totalEarned,
    referralCode,
    referrals,
  };
}

const milestones = [
  { count: 1, reward: '$750 Cash', description: 'Your first referral' },
  { count: 3, reward: '$2,250 Total', description: 'Bronze Referrer status' },
  { count: 5, reward: '$3,750 + Bonus', description: 'Gold Referrer status + Free book copies' },
];

const Referrals: React.FC = () => {
  const { toast } = useToast();
  const data = getReferralData();
  const [copied, setCopied] = React.useState(false);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(data.referralCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercent = Math.min((data.completedReferrals / MAX_REFERRALS_FOR_MILESTONES) * 100, 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Referral Program
        </h1>
        <p className="text-muted-foreground">
          Earn <span className="text-gold font-semibold">${REFERRAL_FEE}</span> for every author you refer who joins GIANTS!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Earned */}
        <div className="bg-card rounded-xl p-5 border border-gold/30 card-glow premium-border">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-gold/20 border border-gold/40">
              <DollarSign className="w-5 h-5 text-gold-dark" />
            </div>
            <Sparkles className="w-5 h-5 text-gold animate-pulse" />
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Total Earned</h3>
          <p className="text-2xl font-bold text-gold">${data.totalEarned.toLocaleString()}</p>
        </div>

        {/* Completed Referrals */}
        <div className="bg-card rounded-xl p-5 border border-border card-glow">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-success/20 border border-success/40">
              <Users className="w-5 h-5 text-success" />
            </div>
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Completed Referrals</h3>
          <p className="text-2xl font-bold text-foreground">{data.completedReferrals}</p>
        </div>

        {/* Pending Referrals */}
        <div className="bg-card rounded-xl p-5 border border-border card-glow">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/40">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            {data.pendingReferrals > 0 && (
              <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full animate-pulse">
                {data.pendingReferrals} pending
              </span>
            )}
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Pending Referrals</h3>
          <p className="text-2xl font-bold text-foreground">{data.pendingReferrals}</p>
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Your Referral Code</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-muted/50 rounded-lg px-4 py-3 font-mono text-lg text-foreground border border-border">
            {data.referralCode}
          </div>
          <Button
            onClick={copyReferralCode}
            variant="outline"
            className="gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Share this code with aspiring authors. When they sign up and mention your code, you'll earn ${REFERRAL_FEE}!
        </p>
      </div>

      {/* Progress to Next Milestone */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Progress to Gold Status</h2>
        <div className="relative">
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-gold to-gold-dark h-3 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Milestone markers */}
          <div className="flex justify-between mt-2">
            {milestones.map((milestone, index) => {
              const isReached = data.completedReferrals >= milestone.count;
              const position = ((milestone.count) / MAX_REFERRALS_FOR_MILESTONES) * 100;
              
              return (
                <div 
                  key={milestone.count}
                  className="flex flex-col items-center"
                  style={{ 
                    position: index === 0 ? 'relative' : 'absolute',
                    left: index === 0 ? '0' : `${position}%`,
                    transform: index === 0 ? 'none' : 'translateX(-50%)'
                  }}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold -mt-4 border-2 transition-all duration-500",
                    isReached 
                      ? 'bg-gold border-gold-dark text-card animate-pulse' 
                      : 'bg-muted border-border text-muted-foreground'
                  )}>
                    {milestone.count}
                  </div>
                  <span className={cn(
                    "text-xs mt-1 whitespace-nowrap",
                    isReached ? 'text-gold font-medium' : 'text-muted-foreground'
                  )}>
                    {milestone.reward}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          {data.completedReferrals >= MAX_REFERRALS_FOR_MILESTONES 
            ? "🎉 Congratulations! You've reached Gold Referrer status!"
            : `${MAX_REFERRALS_FOR_MILESTONES - data.completedReferrals} more referrals to reach Gold status!`}
        </p>
      </div>

      {/* Referral List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Your Referrals</h2>
        </div>
        <div className="divide-y divide-border">
          {data.referrals.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No referrals yet. Share your code to get started!</p>
            </div>
          ) : (
            data.referrals.map((referral, index) => (
              <div 
                key={index}
                className={cn(
                  "px-6 py-4 flex items-center justify-between transition-all duration-500",
                  referral.status === 'completed' && 'bg-success/5'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500",
                    referral.status === 'completed' 
                      ? 'bg-success/20 text-success ring-2 ring-success/30 animate-pulse' 
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {referral.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{referral.name}</p>
                    <p className="text-xs text-muted-foreground">Referred on {referral.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {referral.status === 'completed' && (
                    <span className="text-sm font-semibold text-gold">+${REFERRAL_FEE}</span>
                  )}
                  <span className={cn(
                    "status-badge",
                    referral.status === 'completed' ? 'status-completed' : 'status-in-progress'
                  )}>
                    {referral.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* GHL Integration Note - Only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-muted/30 rounded-xl border border-dashed border-border p-6 text-sm">
          <h3 className="font-semibold text-foreground mb-2">📋 GHL Custom Fields Required:</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li><code className="bg-muted px-1 rounded">referral_count</code> - Total referrals</li>
            <li><code className="bg-muted px-1 rounded">referral_pending_count</code> - Pending referrals</li>
            <li><code className="bg-muted px-1 rounded">referral_completed_count</code> - Completed referrals</li>
            <li><code className="bg-muted px-1 rounded">referral_total_earned</code> - Total earnings</li>
            <li><code className="bg-muted px-1 rounded">referral_code</code> - Unique referral code</li>
            <li><code className="bg-muted px-1 rounded">referrals_list</code> - JSON array of referrals</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Referrals;