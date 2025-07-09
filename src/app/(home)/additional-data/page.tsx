'use client';

import { Suspense } from 'react';

import { useRouter } from 'next/navigation';

import { Container, Fade, Stack, Typography } from '@mui/material';
import { captureException } from '@sentry/nextjs';

import { LoadingCard } from '@/app/loading';
import { AdditionalDatasheetEditor } from '@/components/AdditionalDatasheetEditor';
import Tip from '@/components/Tip';
import { useSuspenseSelectedPlanConfig } from '@/components/providers/SelectedPlanProvider';
import { areHistoricalYearsAvailable } from '@/utils/historical-data';

export default function AdditionalDataPage() {
  const router = useRouter();
  const plan = useSuspenseSelectedPlanConfig();
  const baselineYear = plan?.baselineYear;

  // Redirect to home if the baseline year is not set or if the historical data is not available
  if (baselineYear == null) {
    captureException('No baseline year found when accessing additional data page');

    router.replace('/');

    return null;
  }

  if (!areHistoricalYearsAvailable(baselineYear)) {
    router.replace('/');

    return null;
  }

  return (
    <Fade in>
      <Container>
        <Stack spacing={2}>
          <Typography component="h1" variant="h3">
            Additional Historical Data
          </Typography>
          <div>
            <Tip
              title="Estimate emissions for past years and track your progress"
              text={
                <>
                  To understand trends and monitor year-over-year changes, you can enter historical
                  data for previous years. We&apos;ve streamlined this section to focus on 18 key
                  drivers of emissions, making it easy to gather and review past data. This data
                  will provide yearly estimates of your city&apos;s emissions and support tracking
                  progress against your climate goals.
                  <br />
                  <br />
                  Placeholder values reflect your expected or planned values. If you enter any
                  observed values for a specific year, the dashboard will use them to calculate and
                  plot actual emissions for that sector in that year.
                </>
              }
              storageKey="additionalDataTip"
            />
          </div>
          <Suspense fallback={<LoadingCard />}>
            <AdditionalDatasheetEditor />
          </Suspense>
        </Stack>
      </Container>
    </Fade>
  );
}
