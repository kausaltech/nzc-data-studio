'use client';

import type { ReactNode} from 'react';
import { createContext, useContext } from 'react';

const PreferredLocaleContext = createContext('en');

type Props = {
  children: ReactNode;
  locale: string;
};

export const usePreferredLocale = () => useContext(PreferredLocaleContext);

export function PreferredLocaleProvider({ children, locale }: Props) {
  return (
    <PreferredLocaleContext.Provider value={locale}>
      {children}
    </PreferredLocaleContext.Provider>
  );
}
