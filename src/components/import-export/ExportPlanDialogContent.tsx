import { useEffect, useMemo } from 'react';

import { useQuery } from '@apollo/client';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Typography,
} from '@mui/material';
import { captureException } from '@sentry/nextjs';
import { kebabCase } from 'lodash';
import { useSession } from 'next-auth/react';
import { ChevronDown, Download } from 'react-bootstrap-icons';
import { serializeError } from 'serialize-error';

import { type Notification, useSnackbar } from '@/components/SnackbarProvider';
import { GET_MEASURES } from '@/queries/get-measures';
import type {
  GetMeasureTemplatesQuery,
  GetMeasuresQuery,
  GetMeasuresQueryVariables,
  MeasureFragmentFragment,
} from '@/types/__generated__/graphql';
import type { ExportedDataV2 } from '@/utils/measures';

import { usePlans, useSuspenseSelectedPlanConfig } from '../providers/SelectedPlanProvider';

function getLocalISODateTime() {
  // Sweden uses a date format similar to ISO, hacky but works
  return new Date().toLocaleString('sv').replace(' ', 'T').replaceAll(':', '-');
}

function mapMeasureTemplatesToDownload(
  planName: string,
  measures: MeasureFragmentFragment[],
  baselineYear: number
): ExportedDataV2 {
  return {
    version: 2,
    planName,
    baselineYear,
    measures,
  };
}

type Props = {
  measureTemplates: NonNullable<GetMeasureTemplatesQuery['framework']>;
  onClose: () => void;
};

export function ExportPlanDialogContent({ onClose }: Props) {
  const { setNotification } = useSnackbar();
  const { selectedPlanId } = usePlans();
  const session = useSession();
  const plan = useSuspenseSelectedPlanConfig();
  const planName = plan?.organizationName;
  const baselineYear = plan?.baselineYear;
  const { data, loading, error } = useQuery<GetMeasuresQuery, GetMeasuresQueryVariables>(
    GET_MEASURES,
    {
      variables: { id: selectedPlanId! },
    }
  );
  const hasError = error || (!loading && !data?.framework?.config?.measures.length);

  const extra = useMemo(
    () => ({
      planId: selectedPlanId,
      planName,
      user: JSON.stringify(session.data?.user),
      error: error ? JSON.stringify(serializeError(error), null, 2) : null,
    }),
    [error, session.data?.user, selectedPlanId, planName]
  );

  useEffect(() => {
    if (hasError) {
      console.log('REPORT ERROR', error, extra);
      captureException(error || new Error('No measures found while exporting'), {
        extra,
      });
    }
  }, [hasError, error, extra]);

  function handleDownload() {
    const ERROR_NOTIFICATION: Notification = {
      message: 'Something went wrong while exporting your plan.',
      extraDetails:
        "We've logged the error and our team will look into it shortly. Please try again later.",
      severity: 'error',
    };

    if (!planName) {
      captureException(new Error('Missing plan name for download'), { extra });
      setNotification(ERROR_NOTIFICATION);
      return;
    }

    if (!baselineYear) {
      captureException(new Error('Missing baseline for download'), { extra });
      setNotification(ERROR_NOTIFICATION);
      return;
    }

    if (!data?.framework?.config?.measures) {
      captureException(new Error('Missing measures for download'), { extra });
      setNotification(ERROR_NOTIFICATION);
      return;
    }

    const blob = new Blob(
      [
        JSON.stringify(
          mapMeasureTemplatesToDownload(
            planName,
            data?.framework?.config?.measures ?? [],
            baselineYear
          )
        ),
      ],
      {
        type: 'application/json',
      }
    );
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = `NZC-export_${kebabCase(planName)}_${getLocalISODateTime()}.json`;
    link.click();
  }

  return (
    <>
      <DialogTitle>Export plan data</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography color="text.secondary" paragraph>
            Export a file containing all the data for this plan. Use the import function to return
            to this data later or to incorporate it into a new plan.
          </Typography>
          <Card variant="outlined" elevation={0} sx={{ boxShadow: 'none' }}>
            <Accordion sx={{ bgcolor: 'background.neutral' }}>
              <AccordionSummary color="primary.main" expandIcon={<ChevronDown />}>
                <Typography variant="subtitle2" color="text.secondary">
                  How does exporting help my workflow?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Downloading your climate plan data offers several advantages:
                </Typography>
                <Box component="ul" sx={{ paddingLeft: 2 }}>
                  <Typography component="li" variant="body2">
                    Save different versions of your plan for future reference
                  </Typography>
                  <Typography component="li" variant="body2">
                    Experiment with different scenarios by tweaking numbers without losing your
                    original data
                  </Typography>
                  <Typography component="li" variant="body2">
                    Share your plan data with colleagues or transfer it to another city
                  </Typography>
                  <Typography component="li" variant="body2" paragraph>
                    Create a new plan and use uploaded data as a starting point
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Card>
        </Box>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          {loading ? (
            <Skeleton variant="rounded">
              <Button endIcon={<Download size={18} />}>Export data</Button>
            </Skeleton>
          ) : (
            <Button variant="contained" onClick={handleDownload} endIcon={<Download size={18} />}>
              Export data
            </Button>
          )}
        </DialogActions>
      </DialogContent>
    </>
  );
}
