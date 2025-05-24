import type { ReactNode } from 'react';
import type React from 'react';
import type { RenderOptions, RenderResult} from '@testing-library/react';
import { render } from '@testing-library/react';

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
