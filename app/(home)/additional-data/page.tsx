'use client';

import {
  Container,
  Typography,
  Stack,
  Box,
  Fade,
  Tooltip,
} from '@mui/material';
import { QuestionCircle } from 'react-bootstrap-icons';
import Tip from '@/components/Tip';
import { AdditionalDatasheetEditor } from '@/components/AdditionalDatasheetEditor';
import { useRouter } from 'next/navigation';
import { captureException } from '@sentry/nextjs';
import { areHistoricalYearsAvailable } from '@/utils/historical-data';
import { useSuspenseSelectedPlanConfig } from '@/components/providers/SelectedPlanProvider';

export default function AdditionalDataPage() {
  const router = useRouter();
  const plan = useSuspenseSelectedPlanConfig();
  const baselineYear = plan?.baselineYear;

  // Redirect to home if the baseline year is not set or if the historical data is not available
  if (baselineYear == null) {
    captureException(
      'No baseline year found when accessing additional data page'
    );

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
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography component="h1" variant="h3">
            Additional Historical Data
          </Typography>
          <Typography color="textSecondary">(Optional)</Typography>
        </Stack>
        <Box display="flex" alignItems="flex-start" mt={1}>
          <Typography>Baseline {baselineYear}</Typography>
          <Tooltip
            placement="top"
            arrow
            title={
              <Typography variant="body2">
                The baseline year represents the starting point for measuring
                your city's emissions. This year provides a reference for
                tracking progress over time and should ideally be a recent year
                for which accurate data is available.
              </Typography>
            }
          >
            <div style={{ marginLeft: 4, cursor: 'pointer' }}>
              <QuestionCircle size={16} />
            </div>
          </Tooltip>
        </Box>
        <Tip
          title="Estimate emissions for past years and track your progress"
          text="To understand trends and monitor year-over-year changes, you can enter historical data for previous years. We've streamlined this section to focus on 18 key drivers of emissions, making it easy to gather and review past data. This data will provide yearly estimates of your city's emissions and support tracking progress against your climate goals."
          storageKey="additionalDataTip"
        />
        <AdditionalDatasheetEditor />
      </Container>
    </Fade>
  );
}
