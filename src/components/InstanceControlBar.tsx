'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useMutation } from '@apollo/client';
import type { SelectChangeEvent, SxProps, Theme } from '@mui/material';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Link as MuiLink,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import kebabCase from 'lodash/kebabCase';
import { Lock } from 'react-bootstrap-icons';

import { usePermissions } from '@/hooks/use-user-profile';
import { CREATE_NZC_FRAMEWORK_CONFIG } from '@/queries/framework/create-framework-config';
import type {
  CreateNzcFrameworkMutation,
  CreateNzcFrameworkMutationVariables,
  GetFrameworkConfigsQuery,
} from '@/types/__generated__/graphql';
import { LowHigh } from '@/types/__generated__/graphql';
import { areHistoricalYearsAvailable } from '@/utils/historical-data';

import type { NewPlanData } from './AddPlanDialog';
import { AddPlanDialog } from './AddPlanDialog';
import { SUPPORT_FORM_URL } from './links';
import {
  usePlans,
  useSuspenseSelectedPlanConfig,
} from './providers/SelectedPlanProvider';

function isTestInstance(name: string) {
  // Note that this is a best guess of test instances until we have a better way to identify them
  // Genuine cities with 'test' in the name will be false positives
  return name.startsWith('[') || name.toLocaleLowerCase().includes('test');
}

function sortTestInstancesToBottom(
  instances: NonNullable<GetFrameworkConfigsQuery['framework']>['configs']
) {
  return [...instances].sort((a, b) => {
    const aName = a.organizationName ?? '';
    const bName = b.organizationName ?? '';
    const aIsTest = isTestInstance(aName);
    const bIsTest = isTestInstance(bName);

    if (aIsTest && !bIsTest) {
      return 1;
    } else if (!aIsTest && bIsTest) {
      return -1;
    } else {
      return aName.localeCompare(bName);
    }
  });
}

function InstanceSelector({
  onInstanceChange,
  selectedInstanceId,
  instances,
}: {
  onInstanceChange: (instanceId: string) => void;
  selectedInstanceId: string;
  instances: NonNullable<GetFrameworkConfigsQuery['framework']>['configs'];
}) {
  // In cases where there are many instances (common for some users who have access
  // to many city plans), we want to sort the test instances to the bottom of the list
  const sortTestInstancesLast = instances.length > 10;

  const sortedInstances = sortTestInstancesLast
    ? sortTestInstancesToBottom(instances)
    : [...instances].sort((a, b) =>
        (a.organizationName ?? '').localeCompare(b.organizationName ?? '')
      );

  const firstTestInstance = sortTestInstancesLast
    ? sortedInstances.findIndex((instance) =>
        isTestInstance(instance.organizationName ?? '')
      )
    : -1;

  function handleChange(e: SelectChangeEvent<string>) {
    const instance = instances.find(
      (instance) => instance.id === e.target.value
    );

    if (instance) {
      onInstanceChange(instance.id);
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
        {sortedInstances.map((instance, index) => [
          sortTestInstancesLast && index === firstTestInstance ? (
            <Divider key={`divider-${instance.id}`} />
          ) : undefined,
          <MenuItem key={instance.id} value={instance.id}>
            {instance.organizationName}
          </MenuItem>,
        ])}
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
  const [isRequestEditTooltipOpen, setIsRequestEditTooltipOpen] =
    useState(true); // Initially true, but will only be shown if the user has no create permissions

  const permissions = usePermissions();

  const [createFrameworkConfig, { loading, error }] = useMutation<
    CreateNzcFrameworkMutation,
    CreateNzcFrameworkMutationVariables
  >(CREATE_NZC_FRAMEWORK_CONFIG);

  const { setSelectedPlanId, allPlans } = usePlans();
  const plan = useSuspenseSelectedPlanConfig();

  const pathname = usePathname();

  const instanceConfigs = allPlans ?? [];
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
                onInstanceChange={setSelectedPlanId}
              />
            )}
            {!permissions.isLoading && (
              <>
                {permissions.create ? (
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    variant="outlined"
                  >
                    Create new plan
                  </Button>
                ) : (
                  <Tooltip
                    placement="bottom-end"
                    open={isRequestEditTooltipOpen}
                    onOpen={() => setIsRequestEditTooltipOpen(true)}
                    onClose={() => setIsRequestEditTooltipOpen(false)}
                    arrow
                    title={
                      <Typography variant="body2">
                        You don't have permission to create a plan. To request
                        edit access, please fill out{' '}
                        <MuiLink
                          target="_blank"
                          rel="noopener noreferrer"
                          href={SUPPORT_FORM_URL}
                          color="inherit"
                          sx={{ fontWeight: 'bold' }}
                        >
                          this form
                        </MuiLink>
                      </Typography>
                    }
                  >
                    <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
                      <Button
                        variant="outlined"
                        disabled
                        startIcon={<Lock size={18} />}
                      >
                        Create new plan
                      </Button>
                    </Box>
                  </Tooltip>
                )}
              </>
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
