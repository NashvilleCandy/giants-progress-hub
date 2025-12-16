import React from 'react';
import { Promotion } from '@/types/portal';
import { Megaphone, Gift, Bell, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface PromotionsCardProps {
  promotions: Promotion[];
  className?: string;
}

export const PromotionsCard: React.FC<PromotionsCardProps> = ({ promotions, className }) => {
  const activePromotions = promotions.filter(p => p.isActive);

  const getIcon = (type: Promotion['type']) => {
    switch (type) {
      case 'announcement':
        return Megaphone;
      case 'bonus':
        return Gift;
      case 'reminder':
        return Bell;
      case 'upsell':
        return Tag;
    }
  };

  const getIconBg = (type: Promotion['type']) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-500/10 text-blue-600';
      case 'bonus':
        return 'bg-gold/10 text-gold-dark';
      case 'reminder':
        return 'bg-giants-red/10 text-giants-red';
      case 'upsell':
        return 'bg-success/10 text-success';
    }
  };

  if (activePromotions.length === 0) return null;

  return (
    <div className={cn('rounded-xl border border-border bg-card overflow-hidden', className)}>
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-gold/10 to-transparent border-b border-border">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-gold" />
          Updates & Offers
        </h3>
      </div>

      {/* Promotions list */}
      <div className="divide-y divide-border">
        {activePromotions.map((promo) => {
          const Icon = getIcon(promo.type);
          return (
            <div key={promo.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex gap-3">
                <div className={cn('p-2 rounded-lg shrink-0', getIconBg(promo.type))}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-foreground mb-1">{promo.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{promo.content}</p>
                  <span className="text-[10px] text-muted-foreground mt-2 block">
                    {format(promo.createdAt, 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
