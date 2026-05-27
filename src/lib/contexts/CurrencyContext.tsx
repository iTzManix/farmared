'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Moneda } from '@/types/database';

const CURRENCIES: Moneda[] = ['BOB', 'PEN', 'CLP'];

interface CurrencyContextType {
  selectedCurrency: Moneda;
  setSelectedCurrency: (currency: Moneda) => void;
  availableCurrencies: Moneda[];
  getCurrencySymbol: (moneda: Moneda) => string;
  formatCurrency: (amount: number, fromCurrency: Moneda) => string;
  convertCurrency: (amount: number, fromCurrency: Moneda) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

function getSymbol(moneda: Moneda): string {
  const symbols: Record<Moneda, string> = {
    BOB: 'Bs.',
    PEN: 'S/',
    CLP: '$',
  };
  return symbols[moneda];
}

function formatNumber(amount: number, currency: Moneda): string {
  if (currency === 'CLP') {
    return Math.round(amount).toLocaleString('es-CL');
  }
  return amount.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function CurrencyProvider({ 
  children,
  initialRates
}: { 
  children: ReactNode;
  initialRates: Record<Moneda, Record<Moneda, number>>;
}) {
  const [selectedCurrency, setSelectedCurrencyState] = useState<Moneda>('BOB');

  const setSelectedCurrency = useCallback((currency: Moneda) => {
    setSelectedCurrencyState(currency);
  }, []);

  const convertCurrency = useCallback(
    (amount: number, fromCurrency: Moneda) => {
      if (fromCurrency === selectedCurrency || amount === 0) return amount;
      const rate = initialRates[fromCurrency]?.[selectedCurrency] ?? 1;
      return amount * rate;
    },
    [selectedCurrency, initialRates]
  );

  const formatCurrency = useCallback(
    (amount: number, fromCurrency: Moneda) => {
      const converted = convertCurrency(amount, fromCurrency);
      return `${getSymbol(selectedCurrency)} ${formatNumber(converted, selectedCurrency)}`;
    },
    [selectedCurrency, convertCurrency]
  );

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        availableCurrencies: CURRENCIES,
        getCurrencySymbol: getSymbol,
        formatCurrency,
        convertCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
