'use client';

import {
  Card,
  CardContent,
  Container,
  Fade,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
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
import Loading, { LoadingCard } from './loading';
import useStore from '@/store/use-store';
import { useFrameworkInstanceStore } from '@/store/selected-framework-instance';
import { GET_FRAMEWORK_CONFIGS } from '@/queries/framework/get-framework-config';
import { useEffect } from 'react';

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

function InstanceSelector({
  selectedInstanceId,
  instances,
}: {
  selectedInstanceId: string;
  instances: NonNullable<GetFrameworkConfigsQuery['framework']>['configs'];
}) {
  const setInstance = useFrameworkInstanceStore((state) => state.setInstance);

  function handleChange(e: SelectChangeEvent<string>) {
    setInstance(e.target.value);
  }

  return (
    <FormControl>
      <InputLabel id="select-instance">City plan</InputLabel>
      <Select
        labelId="select-instance-label"
        id="select-instance"
        value={selectedInstanceId}
        label="City plan"
        onChange={handleChange}
      >
        {instances.map((instance) => (
          <MenuItem key={instance.id} value={instance.id}>
            {instance.organizationName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function DashboardContent() {
  const {
    data: selectedInstanceId,
    isDataInitialized: isInstanceStoreInitialized,
  } = useStore(useFrameworkInstanceStore, (state) => state.selectedInstance);
  const setInstance = useFrameworkInstanceStore((state) => state.setInstance);

  const { data: instanceData, error: instanceError } =
    useSuspenseQuery<GetFrameworkConfigsQuery>(GET_FRAMEWORK_CONFIGS);

  useEffect(() => {
    if (
      // If an instance is not selected, select the first one
      (isInstanceStoreInitialized &&
        !selectedInstanceId &&
        instanceData.framework?.configs.length) ||
      // If the selected instance is not in the list of instances, select the first one
      (isInstanceStoreInitialized &&
        !instanceData.framework?.configs.find(
          (config) => config.id === selectedInstanceId
        ))
    ) {
      setInstance(instanceData.framework?.configs[0].id ?? null);
    }
  }, [
    instanceData,
    setInstance,
    isInstanceStoreInitialized,
    selectedInstanceId,
  ]);

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
    console.log('Error');
    return <h1>Something went wrong: Instance not found</h1>;
  }

  const instanceConfigs = instanceData.framework?.configs ?? [];
  const hasMultipleInstances = instanceConfigs.length > 1;

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
                {hasMultipleInstances && selectedInstanceId && (
                  <InstanceSelector
                    selectedInstanceId={selectedInstanceId}
                    instances={instanceConfigs}
                  />
                )}
                <Typography variant="h1">
                  {selectedInstance.organizationName}
                </Typography>
                <Stack
                  component={Link}
                  href="#"
                  rel="noopener noreferrer"
                  target="_blank"
                  variant="body2"
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
                  <span>
                    netzero.kausal.tech/{selectedInstance.organizationName}
                  </span>
                  <BoxArrowUpRight size={14} />
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
  const { status, data } = useSession();

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'unauthenticated') {
    return redirect('/welcome', RedirectType.replace);
  }

  return <DashboardContent />;
}
