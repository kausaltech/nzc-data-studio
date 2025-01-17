'use client';

import { useState } from 'react';

import { useMutation, useSuspenseQuery } from '@apollo/client';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Link as MuiLink,
  SxProps,
  Theme,
} from '@mui/material';
import kebabCase from 'lodash/kebabCase';

import { usePermissions } from '@/hooks/use-user-profile';
import { CREATE_NZC_FRAMEWORK_CONFIG } from '@/queries/framework/create-framework-config';
import { GET_FRAMEWORK_CONFIGS } from '@/queries/framework/get-framework-config';
import {
  CreateNzcFrameworkMutation,
  CreateNzcFrameworkMutationVariables,
  GetFrameworkConfigsQuery,
  LowHigh,
} from '@/types/__generated__/graphql';
import { AddPlanDialog, NewPlanData } from './AddPlanDialog';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { areHistoricalYearsAvailable } from '@/utils/historical-data';
import {
  useSelectedPlanId,
  useSuspenseSelectedPlanConfig,
} from './providers/SelectedPlanProvider';

function InstanceSelector({
  selectedInstanceId,
  instances,
}: {
  selectedInstanceId: string;
  instances: NonNullable<GetFrameworkConfigsQuery['framework']>['configs'];
}) {
  const { setSelectedPlanId } = useSelectedPlanId();

  const sortedInstances = [...instances].sort(
    (a, b) => parseInt(a.id) - parseInt(b.id)
  );

  function handleChange(e: SelectChangeEvent<string>) {
    const instance = instances.find(
      (instance) => instance.id === e.target.value
    );

    if (instance) {
      setSelectedPlanId(instance.id);
    }
  }

  return (
    <FormControl>
      <InputLabel id="select-instance">City plan</InputLabel>
      <Select
        required
        size="small"
        labelId="select-instance-label"
        id="select-instance"
        value={selectedInstanceId}
        label="City plan"
        onChange={handleChange}
      >
        {sortedInstances.map((instance) => (
          <MenuItem key={instance.id} value={instance.id}>
            {instance.organizationName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function getNavStyles(isActive: boolean): SxProps<Theme> {
  return {
    color: 'primary.dark',
    transition: 'border-width 0.1s',
    borderColor: (theme) => theme.palette.primary.dark,
    borderWidth: 0,
    borderStyle: 'solid',
    borderBottomWidth: isActive ? 2 : 0,
    fontWeight: (theme) =>
      isActive
        ? theme.typography.fontWeightBold
        : theme.typography.fontWeightRegular,
    '&:hover': {
      borderBottomWidth: 2,
    },
  };
}

export function InstanceControlBar() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const permissions = usePermissions();
  const { data: instanceData, error: instanceError } =
    useSuspenseQuery<GetFrameworkConfigsQuery>(GET_FRAMEWORK_CONFIGS);

  const [createFrameworkConfig, { loading, error }] = useMutation<
    CreateNzcFrameworkMutation,
    CreateNzcFrameworkMutationVariables
  >(CREATE_NZC_FRAMEWORK_CONFIG);

  const { setSelectedPlanId } = useSelectedPlanId();
  const plan = useSuspenseSelectedPlanConfig();

  const pathname = usePathname();

  if (instanceError) {
    return <div>Error: {instanceError.message}</div>;
  }

  const instanceConfigs = instanceData.framework?.configs ?? [];
  const hasMultipleInstances = instanceConfigs.length > 1;

  async function handleSubmit(data: NewPlanData) {
    try {
      const resp = await createFrameworkConfig({
        variables: {
          frameworkId: 'nzc',
          name: data.planName,
          baselineYear: Number(data.baselineYear),
          targetYear: Number(data.targetYear),
          slug: kebabCase(data.planName),
          population: Number(data.population),
          renewableMix:
            data.renewableElectricityMix === 'high'
              ? LowHigh.High
              : LowHigh.Low,
          temperature: data.climate === 'warm' ? LowHigh.High : LowHigh.Low,
        },
      });

      if (resp.data?.createNzcFrameworkConfig?.frameworkConfig?.id) {
        const instance = resp.data.createNzcFrameworkConfig.frameworkConfig;

        setSelectedPlanId(instance.id);
      }

      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error creating framework config:', error);
    }
  }

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: (theme) => theme.palette.brand[50],
          height: 64,
          pt: 1,
          pb: 1,
        }}
      >
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {!!plan && areHistoricalYearsAvailable(plan.baselineYear) && (
            <Stack direction="row" spacing={2}>
              <MuiLink
                href="/"
                component={Link}
                underline="none"
                sx={getNavStyles(isActive('/'))}
              >
                Overview
              </MuiLink>

              <MuiLink
                href="/additional-data"
                component={Link}
                underline="none"
                sx={getNavStyles(isActive('/additional-data'))}
              >
                Additional historical data
              </MuiLink>
            </Stack>
          )}

          <Stack
            direction="row"
            justifyContent="flex-end"
            ml="auto"
            spacing={2}
          >
            {hasMultipleInstances && plan?.id && (
              <InstanceSelector
                selectedInstanceId={plan.id}
                instances={instanceConfigs}
              />
            )}
            {!permissions.isLoading && permissions.create && (
              <Button
                onClick={() => setIsAddModalOpen(true)}
                variant="outlined"
              >
                Create new plan
              </Button>
            )}
          </Stack>
        </Container>
      </Box>

      <AddPlanDialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </>
  );
}
