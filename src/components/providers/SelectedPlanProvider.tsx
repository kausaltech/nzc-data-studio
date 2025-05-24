'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

import { useQuery } from '@apollo/client';
import { Typography } from '@mui/material';
import * as Sentry from '@sentry/nextjs';
import Cookies from 'js-cookie';

import { PLAN_COOKIE_KEY } from '@/constants/plan';
import { GET_FRAMEWORK_CONFIGS } from '@/queries/framework/get-framework-config';
import type { GetFrameworkConfigsQuery } from '@/types/__generated__/graphql';

import { useSnackbar } from '../SnackbarProvider';
import { useSession } from 'next-auth/react';

type SelectedPlanContextType = {
  selectedPlanId: string | undefined;
  selectedPlan: FrameworkConfig | null;
  allPlans: FrameworkConfig[] | null;
  setSelectedPlanId: (plan: string | undefined) => void;
};

const SelectedPlanContext = createContext<SelectedPlanContextType>({
  selectedPlanId: undefined,
  selectedPlan: null,
  allPlans: null,
  setSelectedPlanId: () => {},
});

type Props = {
  children: ReactNode;
  plan?: string;
};

export const usePlans = () => useContext(SelectedPlanContext);

type FrameworkConfig = NonNullable<GetFrameworkConfigsQuery['framework']>['configs'][0];

export function useSuspenseSelectedPlanConfig(): FrameworkConfig | null {
  const { selectedPlan } = usePlans();

  return selectedPlan;
}

export function SelectedPlanProvider({ children, plan: initialPlan }: Props) {
  const { setNotification } = useSnackbar();
  const session = useSession();
  const { data, error } = useQuery<GetFrameworkConfigsQuery>(GET_FRAMEWORK_CONFIGS, {skip: session.status !== 'authenticated'});

  if (error) {
    Sentry.captureException(error, {
      extra: {
        location: 'DashboardContent',
        error: JSON.stringify(error, null, 2),
      },
    });
  }

  const planCount = data?.framework?.configs.length ?? 0;
  if (planCount === 0 && initialPlan) {
    Cookies.remove(PLAN_COOKIE_KEY);
    initialPlan = undefined;
  }

  const [planId, setPlanId] = useState<string | undefined>(initialPlan);

  const selectedPlan = planId
    ? data?.framework?.configs.find((config) => config.id === planId)
    : undefined;

  const firstPlan = data?.framework?.configs[0];
  if (firstPlan && !selectedPlan) {
    setPlanId(firstPlan.id);
    if (planCount > 1) {
      setNotification({
        message: 'Plan selection updated',
        extraDetails: (
          <>
            <Typography
              variant="body2"
              component="span"
              fontWeight="fontWeightBold"
              color="primary.dark"
            >
              {firstPlan.organizationName}
            </Typography>{' '}
            has been automatically set as your active plan
          </>
        ),
        severity: 'info',
      });
    }
  }

  const setSelectedPlanId = (newPlan: string | undefined) => {
    setPlanId(newPlan);
    if (newPlan) {
      Cookies.set(PLAN_COOKIE_KEY, newPlan);
    } else {
      Cookies.remove(PLAN_COOKIE_KEY);
    }
  };

  return (
    <SelectedPlanContext.Provider
      value={{
        selectedPlanId: planId,
        selectedPlan: selectedPlan ?? null,
        allPlans: data?.framework?.configs ?? null,
        setSelectedPlanId,
      }}
    >
      {children}
    </SelectedPlanContext.Provider>
  );
}
