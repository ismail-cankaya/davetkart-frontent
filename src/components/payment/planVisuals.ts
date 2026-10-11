import { Crown, Feather, Gem } from 'lucide-react';
import { SubscriptionTier } from '../../types';

/** Paketlerin ikonu — plan duvarı ve ödeme sayfası aynı dili konuşur. */
export const PLAN_ICONS: Record<SubscriptionTier, typeof Crown> = {
  standart: Feather,
  gold: Crown,
  elit: Gem
};

/** İkon karosunun zemin/ön plan renkleri. */
export const PLAN_ICON_TONES: Record<SubscriptionTier, string> = {
  standart: 'bg-stone-100 text-stone-500',
  gold: 'bg-amber-100 text-amber-600',
  elit: 'bg-ink text-champagne'
};
