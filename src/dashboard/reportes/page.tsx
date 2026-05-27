'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { VentasChart } from '@/components/charts/VentasChart';
import { StockChart } from '@/components/charts/StockChart';
import { ComparativaPrecios } from '@/components/charts/ComparativaPrecios';

export default function ReportesPage() {
  const [ventasData, setVentasData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [preciosData, setPreciosData] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/reportes/ventas-globales').then(r => r.json()),
      fetch('/api/reportes/stock-global').then(r => r.json()),
      fetch('/api/reportes/comparativa-precios').then(r => r.json()),
    ]).then(([v, s, p]) => {
      setVentasData(v.data ?? []);
      setStockData(s.data ?? []);
      setPreciosData(p.data ?? []);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <VentasChart data={ventasData} />
        <StockChart data={stockData} />
        <ComparativaPrecios data={preciosData} />
      </div>
    </div>
  );
}