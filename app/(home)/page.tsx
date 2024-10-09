'use client';

import { useEffect, useMemo, useState } from 'react';
import { redirect, RedirectType } from 'next/navigation';

import { useQuery, useSuspenseQuery } from '@apollo/client';
import {
  Button,
  Card,
  CardContent,
  Container,
  Fade,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import * as Sentry from '@sentry/nextjs';
import { useSession } from 'next-auth/react';
import { BoxArrowUpRight, Download } from 'react-bootstrap-icons';

import CompletionScoreCard from '@/components/CompletionScoreCard';
import DataCollection from '@/components/DataCollection';
import { ImportExportActions } from '@/components/import-export/ImportExportActions';
import { GET_FRAMEWORK_CONFIGS } from '@/queries/framework/get-framework-config';
import { GET_MEASURE_TEMPLATES } from '@/queries/get-measure-templates';
import { useFrameworkInstanceStore } from '@/store/selected-framework-instance';
import useStore from '@/store/use-store';
import type {
  GetFrameworkConfigsQuery,
  GetMeasureTemplatesQuery,
  GetMeasureTemplatesQueryVariables,
} from '@/types/__generated__/graphql';
import Loading, { LoadingCard } from '../loading';
import IntroSection from '@/components/IntroSection';
import { benefits } from '@/constants/intro-content';

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
    // TODO: Return error component
    console.log('Error', error);
    if (error) {
      Sentry.captureException(error);
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

  if (loading) {
    return <LoadingCard />;
  }

  if (!data || error) {
    // TODO: Return error page
    console.log('Error', error);
    if (error) {
      Sentry.captureException(error);
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
          {!!data.framework && (
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

function DashboardContent() {
  const {
    data: selectedInstanceId,
    isDataInitialized: isInstanceStoreInitialized,
  } = useStore(useFrameworkInstanceStore, (state) => state.selectedInstance);

  const { data: instanceData, error: instanceError } =
    useSuspenseQuery<GetFrameworkConfigsQuery>(GET_FRAMEWORK_CONFIGS);

  const frameworkConfigs = instanceData.framework?.configs;
  const selectedInstance = frameworkConfigs
    ? (frameworkConfigs.find((config) => config.id === selectedInstanceId) ??
      null)
    : null;

  if (frameworkConfigs?.length === 0) {
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
                  It looks like there aren't any plans for your city yet. Get
                  started by creating a new plan to begin your decarbonisation
                  journey.
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

  if (!isInstanceStoreInitialized || !selectedInstanceId) {
    return <Loading />;
  }

  if (!instanceData || instanceError) {
    // TODO: Return error page
    console.log(`Error - Selected instance: ${selectedInstanceId}`);
    if (instanceError) Sentry.captureException(instanceError);
    return <h1>Something went wrong: Instance not found</h1>;
  }

  return (
    <Fade in>
      <Container>
        <Stack spacing={4}>
          {!selectedInstance ? (
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
                        {selectedInstance.organizationName}
                      </Typography>
                    </Stack>
                  </div>

                  {selectedInstanceId ? (
                    <CompletionScoreCardWrapper instance={selectedInstanceId} />
                  ) : (
                    <Skeleton />
                  )}

                  <Stack direction="row" spacing={2}>
                    {!!selectedInstance.viewUrl && (
                      <Button
                        variant="outlined"
                        rel="noopener noreferrer"
                        target="_blank"
                        endIcon={<BoxArrowUpRight size={16} />}
                        href={selectedInstance.viewUrl}
                      >
                        View Outcomes Dashboard
                      </Button>
                    )}

                    {selectedInstance.resultsDownloadUrl && (
                      <Button
                        variant="outlined"
                        endIcon={<Download size={18} />}
                        href={selectedInstance?.resultsDownloadUrl}
                        download
                      >
                        Export Outcomes as Excel
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )}

          {selectedInstanceId ? (
            <DataCollectionContent instance={selectedInstanceId} />
          ) : (
            <LoadingCard />
          )}
        </Stack>
      </Container>
    </Fade>
  );
}

export default function Dashboard() {
  const { status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(
    status === 'authenticated'
  );

  useEffect(() => {
    if (status === 'authenticated') {
      setIsAuthenticated(true);
    } else if (status === 'unauthenticated') {
      setIsAuthenticated(false);
    }
  }, [status]);

  const dashboard = useMemo(() => {
    if (isAuthenticated) {
      return <DashboardContent />;
    }
  }, [isAuthenticated]);

  if (!isAuthenticated && status === 'loading') {
    return <Loading />;
  }

  if (status === 'unauthenticated') {
    return redirect('/welcome', RedirectType.replace);
  }

  return dashboard;
}
