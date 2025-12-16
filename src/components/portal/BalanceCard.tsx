import React from 'react';
import { DollarSign, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BalanceCardProps {
  balance: number;
  className?: string;
  onPayNow?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, className, onPayNow }) => {
  const hasBalance = balance > 0;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl p-4 transition-all duration-300',
        'bg-card border border-border',
        hasBalance && 'premium-border',
        className
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-giants-red/5 via-transparent to-gold/5 pointer-events-none" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-giants-red/10">
            <DollarSign className="w-4 h-4 text-giants-red" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">Balance Due</span>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <span className={cn(
            'text-2xl font-bold font-serif',
            hasBalance ? 'text-giants-red' : 'text-success'
          )}>
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Pay button */}
        {hasBalance && (
          <Button
            onClick={onPayNow}
            className="w-full bg-gradient-premium hover:opacity-90 text-primary-foreground"
            size="sm"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Pay Now
          </Button>
        )}

        {!hasBalance && (
          <div className="flex items-center gap-2 text-success text-sm">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            All caught up!
          </div>
        )}
      </div>
    </div>
  );
};
