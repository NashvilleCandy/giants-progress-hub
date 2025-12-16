import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ProgressBar } from './ProgressBar';
import { BalanceCard } from './BalanceCard';
import { PromotionsCard } from './PromotionsCard';
import { mockClient, mockProgressSteps, mockPromotions } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export const PortalLayout: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  const handlePayNow = () => {
    toast({
      title: "Payment",
      description: "Redirecting to payment portal...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Fixed Left */}
      <Sidebar client={mockClient} onLogout={handleLogout} />

      {/* Main content area */}
      <div className="pl-64">
        {/* Top Progress Bar - Always Visible */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="px-6 py-4">
            <ProgressBar steps={mockProgressSteps} />
          </div>
        </header>

        {/* Content with right sidebar */}
        <div className="flex">
          {/* Main content */}
          <main className="flex-1 p-6 min-h-[calc(100vh-120px)]">
            <Outlet />
          </main>

          {/* Right sidebar - Balance & Promotions */}
          <aside className="w-72 shrink-0 p-6 space-y-4 border-l border-border bg-muted/30">
            <BalanceCard balance={mockClient.balanceDue} onPayNow={handlePayNow} />
            <PromotionsCard promotions={mockPromotions} />
          </aside>
        </div>
      </div>
    </div>
  );
};
