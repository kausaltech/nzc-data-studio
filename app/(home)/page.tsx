'use client';

import {
  Card,
  CardContent,
  Container,
  Fade,
  Link,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { RedirectType, redirect } from 'next/navigation';
import { BoxArrowUpRight } from 'react-bootstrap-icons';
import DataCollection from '@/components/DataCollection';
import { UploadLegacyDataButton } from '@/components/UploadLegacyDataButton';
import { GET_MEASURE_TEMPLATES } from '@/queries/get-measure-templates';
import { useSession } from 'next-auth/react';
import { useQuery, useSuspenseQuery } from '@apollo/client';
import {
  GetFrameworkConfigsQuery,
  GetMeasureTemplatesQuery,
  GetMeasureTemplatesQueryVariables,
} from '@/types/__generated__/graphql';
import Loading, { LoadingCard } from '../loading';
import useStore from '@/store/use-store';
import { useFrameworkInstanceStore } from '@/store/selected-framework-instance';
import { GET_FRAMEWORK_CONFIGS } from '@/queries/framework/get-framework-config';
import CompletionScoreCard from '@/components/CompletionScoreCard';

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
            <UploadLegacyDataButton measureTemplates={data.framework} />
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

  const selectedInstance =
    instanceData.framework?.configs.find(
      (config) => config.id === selectedInstanceId
    ) ?? null;

  if (
    !instanceData ||
    instanceError ||
    (isInstanceStoreInitialized && !selectedInstance)
  ) {
    // TODO: Return error page
    console.log(`Error - Selected instance: ${selectedInstanceId}`);
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
                    <Typography variant="h1">
                      {selectedInstance.organizationName}
                    </Typography>
                    {!!selectedInstance.viewUrl && (
                      <Stack
                        component={Link}
                        href={selectedInstance.viewUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                        variant="body2"
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: 'center', display: 'inline-flex' }}
                      >
                        <span>
                          {selectedInstance.viewUrl.replace('https://', '')}
                        </span>
                        <BoxArrowUpRight size={14} />
                      </Stack>
                    )}
                  </div>

                  {selectedInstanceId ? (
                    <CompletionScoreCardWrapper instance={selectedInstanceId} />
                  ) : (
                    <Skeleton />
                  )}
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

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'unauthenticated') {
    return redirect('/welcome', RedirectType.replace);
  }

  return <DashboardContent />;
}
