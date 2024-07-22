'use client';

import kebabCase from 'lodash/kebabCase';
import { useSuspenseQuery } from '@apollo/client';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { X } from 'react-bootstrap-icons';

import { GET_FRAMEWORK_CONFIGS } from '@/queries/framework/get-framework-config';
import { useFrameworkInstanceStore } from '@/store/selected-framework-instance';
import useStore from '@/store/use-store';
import {
  GetFrameworkConfigsQuery,
  CreateFrameworkMutation,
  CreateFrameworkMutationVariables,
} from '@/types/__generated__/graphql';
import { CREATE_FRAMEWORK_CONFIG } from '@/queries/framework/create-framework-config';

const BASELINE_OPTIONS = [2018, 2019, 2020, 2021, 2022, 2023];

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
        required
        size="small"
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

export function InstanceControlBar() {
  const [planName, setPlanName] = useState('');
  const [baselineYear, setBaselineYear] = useState<number | ''>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: instanceData, error: instanceError } =
    useSuspenseQuery<GetFrameworkConfigsQuery>(GET_FRAMEWORK_CONFIGS);

  const [createFrameworkConfig, { loading, error }] = useMutation<
    CreateFrameworkMutation,
    CreateFrameworkMutationVariables
  >(CREATE_FRAMEWORK_CONFIG);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (planName && baselineYear) {
      try {
        const resp = await createFrameworkConfig({
          variables: {
            frameworkId: 'nzc',
            name: planName,
            baselineYear: Number(baselineYear),
            slug: kebabCase(planName),
          },
        });

        if (resp.data?.createFrameworkConfig?.frameworkConfig?.id) {
          setInstance(resp.data.createFrameworkConfig.frameworkConfig.id);
        }

        handleClose();
      } catch (error) {
        // TODO: Handle error
        console.error('Error creating framework config:', error);
      }
    }
  }

  const {
    data: selectedInstanceId,
    isDataInitialized: isInstanceStoreInitialized,
  } = useStore(useFrameworkInstanceStore, (state) => state.selectedInstance);
  const setInstance = useFrameworkInstanceStore((state) => state.setInstance);

  useEffect(() => {
    if (
      // If an instance is not selected, select the first one
      (isInstanceStoreInitialized &&
        !selectedInstanceId &&
        (instanceData.framework?.configs.length ?? 0 > 0)) ||
      // If the selected instance is not in the list of instances, select the first one
      (isInstanceStoreInitialized &&
        !instanceData.framework?.configs.find(
          (config) => config.id === selectedInstanceId
        ))
    ) {
      setInstance(instanceData.framework?.configs[0]?.id ?? null);
    }
  }, [
    instanceData,
    setInstance,
    isInstanceStoreInitialized,
    selectedInstanceId,
  ]);

  if (instanceError) {
    // TODO: Error page
    return <div>Error: {instanceError.message}</div>;
  }

  const instanceConfigs = instanceData.framework?.configs ?? [];
  const hasMultipleInstances = instanceConfigs.length > 1;

  function handleClose() {
    setIsAddModalOpen(false);
    setPlanName('');
    setBaselineYear('');
  }

  return (
    <>
      <Box
        sx={{
          bgcolor: (theme) => theme.palette.brand[50],
          height: 64,
          pt: 2,
          pb: 1,
        }}
      >
        <Container>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            {hasMultipleInstances && selectedInstanceId && (
              <InstanceSelector
                selectedInstanceId={selectedInstanceId}
                instances={instanceConfigs}
              />
            )}
            <Button onClick={() => setIsAddModalOpen(true)} variant="outlined">
              Add a plan
            </Button>
          </Stack>
        </Container>
      </Box>

      <Dialog
        open={isAddModalOpen}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Add a new plan</span>
          <IconButton aria-label="close" onClick={handleClose}>
            <X size={24} />
          </IconButton>
        </DialogTitle>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <DialogContent sx={{ px: 3 }}>
            <Stack spacing={2}>
              <TextField
                required
                label="Plan or city name"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />

              <FormControl required>
                <InputLabel id="baseline-select">Baseline year</InputLabel>
                <Select
                  label="Baseline year"
                  labelId="baseline-select"
                  id="baseline-select-component"
                  value={baselineYear}
                  onChange={(e) => setBaselineYear(Number(e.target.value))}
                >
                  {BASELINE_OPTIONS.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  The baseline year is the reference year against which future
                  emission reductions are measured.
                </FormHelperText>
              </FormControl>

              {error && (
                <Alert severity="error">
                  <AlertTitle>Error creating plan: {error.message}</AlertTitle>
                </Alert>
              )}
            </Stack>
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: 'flex-end',
              px: 3,
              pb: 3,
            }}
          >
            <Button variant="text" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={loading || !planName || !baselineYear}
              endIcon={
                loading ? <CircularProgress color="inherit" size={20} /> : null
              }
            >
              {loading ? 'Adding...' : 'Add plan'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
