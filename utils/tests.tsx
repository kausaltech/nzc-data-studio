import React, { ReactNode } from 'react';
import { RenderOptions, RenderResult, render } from '@testing-library/react';

const Providers = ({ children }: { children: ReactNode }) => {
  return children;
};
function customRender(
  ui: React.ReactNode,
  options: Omit<RenderOptions, 'queries'> = {}
): RenderResult {
  return render(ui, { wrapper: Providers, ...options });
}

export * from '@testing-library/react';

export { customRender as render };
