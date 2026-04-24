import type { ReactNode } from 'react';
import type React from 'react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import type { MockedResponse } from '@apollo/client/testing';

import { SnackbarProvider } from '@/components/SnackbarProvider';

type CustomRenderOptions = Omit<RenderOptions, 'queries'> & {
  mocks?: MockedResponse[];
};

const Providers = ({ children, mocks }: { children: ReactNode; mocks?: MockedResponse[] }) => (
  <MockedProvider mocks={mocks ?? []} addTypename={false}>
    <SnackbarProvider>{children}</SnackbarProvider>
  </MockedProvider>
);

function customRender(
  ui: React.ReactNode,
  { mocks, ...options }: CustomRenderOptions = {}
): RenderResult {
  return render(ui, {
    wrapper: ({ children }) => <Providers mocks={mocks}>{children}</Providers>,
    ...options,
  });
}

export * from '@testing-library/react';

export { customRender as render };
