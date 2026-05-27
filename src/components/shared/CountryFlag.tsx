'use client';

import { Badge, getBadgeVariantForPais, getCountryName } from '@/components/ui/Badge';
import type { Pais } from '@/types/database';

interface CountryFlagProps {
  pais: Pais;
  showBadge?: boolean;
  showName?: boolean;
}

const countryEmojis: Record<Pais, string> = {
  BO: '🇧🇴',
  PE: '🇵🇪',
  CL: '🇨🇱',
};

export function CountryFlag({ pais, showBadge = false, showName = true }: CountryFlagProps) {
  const emoji = countryEmojis[pais];
  const name = getCountryName(pais);

  if (showBadge) {
    return (
      <Badge variant={getBadgeVariantForPais(pais)}>
        <span className="mr-1">{emoji}</span>
        {showName && name}
      </Badge>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{emoji}</span>
      {showName && <span className="text-sm">{name}</span>}
    </span>
  );
}
