'use client';

import { useQuery } from '@apollo/client';
import {
  Button,
  Card,
  CardContent,
  Container,
  Fade,
  Link,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import * as Sentry from '@sentry/nextjs';
import { BoxArrowUpRight, Download } from 'react-bootstrap-icons';
import { serializeError } from 'serialize-error';

import CompletionScoreCard from '@/components/CompletionScoreCard';
import DataCollection from '@/components/DataCollection';
import { HelpText } from '@/components/HelpText';
import IntroSection from '@/components/IntroSection';
import { ImportExportActions } from '@/components/import-export/ImportExportActions';
import { SUPPORT_FORM_URL } from '@/components/links';
import { usePlans } from '@/components/providers/SelectedPlanProvider';
import { benefits } from '@/constants/intro-content';
import { usePermissions } from '@/hooks/use-user-profile';
import { GET_MEASURE_TEMPLATES } from '@/queries/get-measure-templates';
import type {
  GetMeasureTemplatesQuery,
  GetMeasureTemplatesQueryVariables,
} from '@/types/__generated__/graphql';

import Loading, { LoadingCard } from '../loading';

function CompletionScoreCardWrapper({ instance }: { instance: string }) {
  const { data, error, loading } = useQuery<
    GetMeasureTemplatesQuery,
    GetMeasureTemplatesQueryVariables
  >(GET_MEASURE_TEMPLATES, {
    variables: { frameworkConfigId: instance },
  });

  if (loading) {
    return <Skeleton height={100} />;
  }

  if (!data?.framework || error) {
    if (error) {
      Sentry.captureException(error, {
        extra: {
          location: 'CompletionScoreCardWrapper',
          error: JSON.stringify(serializeError(error), null, 2),
        },
      });
    }
    return <h1>Something went wrong</h1>;
  }

  return (
    <Fade in>
      <div>
        <CompletionScoreCard measureTemplates={data.framework} />
      </div>
    </Fade>
  );
}

function DataCollectionContent({ instance }: { instance: string }) {
  const { data, error, loading } = useQuery<
    GetMeasureTemplatesQuery,
    GetMeasureTemplatesQueryVariables
  >(GET_MEASURE_TEMPLATES, {
    variables: { frameworkConfigId: instance },
  });

  const permissions = usePermissions();

  if (loading) {
    return <LoadingCard />;
  }

  if (!data || error) {
    if (error) {
      Sentry.captureException(error, {
        extra: {
          location: 'DataCollectionContent',
          error: JSON.stringify(serializeError(error), null, 2),
        },
      });
    }
    return <h1>Something went wrong</h1>;
  }

  return (
    <Fade in>
      <div>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography gutterBottom variant="h3" component="h2">
            Data collection center
          </Typography>
          {!!data.framework && permissions.edit && (
            <Stack direction="row" spacing={2}>
              <ImportExportActions measureTemplates={data.framework} />
            </Stack>
          )}
        </Stack>
        {!!data.framework && (
          <DataCollection measureTemplates={data.framework} />
        )}
      </div>
    </Fade>
  );
}

export default function DashboardContent() {
  const { allPlans, selectedPlan } = usePlans();
  const permissions = usePermissions();

  if (allPlans === null) {
    return <Loading />;
  }

  if (allPlans.length === 0) {
    return (
      <Fade in>
        <Container>
          <Stack spacing={6}>
            <Card>
              <CardContent>
                <Typography variant="h2" paragraph>
                  Welcome to NetZeroPlanner
                </Typography>
                <Typography variant="subtitle1" sx={{ maxWidth: '80%' }}>
                  It looks like there aren't any plans for your city yet.{' '}
                  {!permissions.create ? (
                    <>
                      You don't currently have permission to create one. To
                      request edit access, please fill out{' '}
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={SUPPORT_FORM_URL}
                      >
                        this form
                      </Link>
                      .
                    </>
                  ) : (
                    'Get started by creating a new plan to begin your decarbonisation journey.'
                  )}
                </Typography>
              </CardContent>
            </Card>
            <IntroSection
              title="How NetZeroPlanner guides your city's decarbonisation journey"
              items={benefits}
            />
          </Stack>
        </Container>
      </Fade>
    );
  }

  return (
    <Fade in>
      <Container>
        <Stack spacing={4}>
          {!selectedPlan ? (
            <Skeleton variant="rounded" width="100%">
              <Card>
                <CardContent>
                  <Typography variant="h1">Placeholder</Typography>
                  <Typography>Placeholder</Typography>
                </CardContent>
              </Card>
            </Skeleton>
          ) : (
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <div>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h1">
                        {selectedPlan.organizationName}
                      </Typography>
                    </Stack>
                  </div>

                  {selectedPlan ? (
                    <CompletionScoreCardWrapper instance={selectedPlan.id} />
                  ) : (
                    <Skeleton />
                  )}

                  <Stack direction="row" spacing={2}>
                    {!!selectedPlan.viewUrl && (
                      <Button
                        variant="outlined"
                        rel="noopener noreferrer"
                        target="_blank"
                        endIcon={<BoxArrowUpRight size={16} />}
                        href={selectedPlan.viewUrl}
                      >
                        View Outcomes Dashboard
                      </Button>
                    )}

                    {selectedPlan.resultsDownloadUrl && (
                      <Button
                        variant="outlined"
                        endIcon={<Download size={18} />}
                        href={selectedPlan.resultsDownloadUrl}
                        download
                      >
                        Export Outcomes as Excel{' '}
                        <HelpText
                          text={
                            <>
                              Here you can download tables that are helpful in
                              building an Economic Case for your Climate Action
                              Plan. These tables display an analysis of GHG
                              reduction along with the costs and benefits by
                              sub-sector and stakeholder group. This will
                              provide you with both the GHG and financial Return
                              on Investment for better decision making in your
                              Climate Action Plan.
                            </>
                          }
                        />
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )}

          {selectedPlan ? (
            <DataCollectionContent instance={selectedPlan.id} />
          ) : (
            <LoadingCard />
          )}
        </Stack>
      </Container>
    </Fade>
  );
}
