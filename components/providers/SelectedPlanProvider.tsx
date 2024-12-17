'use client';

import Cookies from 'js-cookie';
import { ReactNode, createContext, useContext, useState } from 'react';
import { PLAN_COOKIE_KEY } from '@/constants/plan';
import { useSuspenseQuery } from '@apollo/client';
import { GET_FRAMEWORK_CONFIGS } from '@/queries/framework/get-framework-config';
import { GetFrameworkConfigsQuery } from '@/types/__generated__/graphql';
import { Typography } from '@mui/material';
import { useSnackbar } from '../SnackbarProvider';

type SelectedPlanContextType = {
  selectedPlanId: string | undefined;
  setSelectedPlanId: (plan: string | undefined) => void;
};

const SelectedPlanContext = createContext<SelectedPlanContextType>({
  selectedPlanId: undefined,
  setSelectedPlanId: () => {},
});

type Props = {
  children: ReactNode;
  plan?: string;
};

export const useSelectedPlanId = () => useContext(SelectedPlanContext);

type FrameworkConfig = NonNullable<
  GetFrameworkConfigsQuery['framework']
>['configs'][0];

export function useSuspenseSelectedPlanConfig(): FrameworkConfig | null {
  const { selectedPlanId, setSelectedPlanId } = useSelectedPlanId();
  const { setNotification } = useSnackbar();
  const plans = useSuspenseQuery<GetFrameworkConfigsQuery>(
    GET_FRAMEWORK_CONFIGS
  );

  const planCount = plans.data?.framework?.configs.length ?? 0;

  if (planCount === 0) {
    setSelectedPlanId(undefined);
    return null;
  }

  const selectedPlan = selectedPlanId
    ? plans.data.framework?.configs.find(
        (config) => config.id === selectedPlanId
      )
    : undefined;

  if (selectedPlan) {
    return selectedPlan;
  }

  const firstPlan = plans.data?.framework?.configs[0];

  if (firstPlan) {
    setSelectedPlanId(firstPlan.id);

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

    return firstPlan;
  }

  return null;
}

export function SelectedPlanProvider({ children, plan: initialPlan }: Props) {
  const [plan, setPlan] = useState<string | undefined>(initialPlan);

  const setSelectedPlanId = (newPlan: string | undefined) => {
    setPlan(newPlan);

    if (newPlan) {
      Cookies.set(PLAN_COOKIE_KEY, newPlan);
    } else {
      Cookies.remove(PLAN_COOKIE_KEY);
    }
  };

  return (
    <SelectedPlanContext.Provider
      value={{ selectedPlanId: plan, setSelectedPlanId }}
    >
      {children}
    </SelectedPlanContext.Provider>
  );
}
