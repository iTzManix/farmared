'use client';

import { useState, useEffect } from 'react';

interface Health {
  node: string;
  status: 'online' | 'offline';
  latency: number;
}

export function useNodeHealth() {
  const [health, setHealth] = useState<Health[]>([]);

  useEffect(() => {
    const check = async () => {
      const res = await fetch('/api/salud');
      const data = await res.json();
      // Cast status to proper type
      const typedData: Health[] = data.map((item: any) => ({
        ...item,
        status: item.status === 'online' ? 'online' : 'offline'
      }));
      setHealth(typedData);
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  return health;
}