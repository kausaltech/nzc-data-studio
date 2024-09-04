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
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { ExclamationTriangle, FileEarmarkPlus, X } from 'react-bootstrap-icons';

import { GET_FRAMEWORK_CONFIGS } from '@/queries/framework/get-framework-config';
import { useFrameworkInstanceStore } from '@/store/selected-framework-instance';
import useStore from '@/store/use-store';
import {
  GetFrameworkConfigsQuery,
  CreateFrameworkMutation,
  CreateFrameworkMutationVariables,
} from '@/types/__generated__/graphql';
import { CREATE_FRAMEWORK_CONFIG } from '@/queries/framework/create-framework-config';
import NumberInput from './NumberInput';

type ClimateOption = 'warm' | 'cold';
type RenewableMixOption = 'low' | 'high';
type Option<T> = { label: string; value: T };

const BASELINE_OPTIONS = [2018, 2019, 2020, 2021, 2022, 2023];
const PANDEMIC_YEARS = [2020, 2021];

const CLIMATE_OPTIONS: Option<ClimateOption>[] = [
  { label: 'Warm (Above 12°C yearly average)', value: 'warm' },
  { label: 'Cold (Below 12°C yearly average)', value: 'cold' },
];

const RENEWABLE_ELECTRICITY_OPTIONS: Option<RenewableMixOption>[] = [
  { label: 'High (50-100% renewable)', value: 'high' },
  { label: 'Low (0-50% renewable)', value: 'low' },
];

function getErrorMessage(error: Error) {
  // Hacky way to check if the error is a duplicate key error. In future, our
  // backend should return error codes to determine the type of 400 error.
  if (
    error.message.startsWith('Instance with identifier') &&
    error.message.endsWith('already exists')
  ) {
    return 'A city plan with this name already exists. Please choose a different name.';
  }

  return `Error creating plan: ${error.message}`;
}

function isValid(data: Data, onlyStepOne = false): boolean {
  const validFirstStep = !!(data.planName && data.baselineYear);

  if (onlyStepOne) {
    return validFirstStep;
  }

  return !!(
    validFirstStep &&
    data.population &&
    data.renewableElectricityMix &&
    data.climate
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
    const instance = instances.find(
      (instance) => instance.id === e.target.value
    );

    if (instance) {
      setInstance(
        instance.id,
        instance.organizationName,
        instance.baselineYear
      );
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
        {instances.map((instance) => (
          <MenuItem key={instance.id} value={instance.id}>
            {instance.organizationName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

type Data = {
  planName: string;
  baselineYear: number | '';
  population: number | '';
  climate: ClimateOption | null;
  renewableElectricityMix: RenewableMixOption | null;
};

const INITIAL_DATA: Data = {
  planName: '',
  baselineYear: '',
  population: '',
  climate: null,
  renewableElectricityMix: null,
};

export function InstanceControlBar() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(INITIAL_DATA);

  const { data: instanceData, error: instanceError } =
    useSuspenseQuery<GetFrameworkConfigsQuery>(GET_FRAMEWORK_CONFIGS);

  const [createFrameworkConfig, { loading, error }] = useMutation<
    CreateFrameworkMutation,
    CreateFrameworkMutationVariables
  >(CREATE_FRAMEWORK_CONFIG);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (data.planName && data.baselineYear) {
      try {
        const resp = await createFrameworkConfig({
          variables: {
            // TODO: Add climate, population and renewableElectricityMix to the mutation
            frameworkId: 'nzc',
            name: data.planName,
            baselineYear: Number(data.baselineYear),
            slug: kebabCase(data.planName),
          },
        });

        if (resp.data?.createFrameworkConfig?.frameworkConfig?.id) {
          const instance = resp.data.createFrameworkConfig.frameworkConfig;

          setInstance(
            instance.id,
            instance.organizationName,
            instance.baselineYear
          );
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
      const instance = instanceData.framework?.configs[0];

      if (instance) {
        setInstance(
          instance.id,
          instance.organizationName,
          instance.baselineYear
        );
      }
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
    setStep(0);
    setIsAddModalOpen(false);
    setData(INITIAL_DATA);
  }

  function handleChange(field: keyof Data, value: Data[typeof field]) {
    setData((prev) => ({ ...prev, [field]: value }));
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
              Create new plan
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
        <DialogTitle sx={{ pb: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Box sx={{ fontSize: 0 }}>
              <FileEarmarkPlus size={24} />
            </Box>
            <Box component="span" flex="1">
              <div>Create new plan</div>
            </Box>
            <IconButton aria-label="close" onClick={handleClose}>
              <X size={24} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <DialogContent sx={{ px: 3, pt: 0 }}>
            <Box sx={{ mb: 4 }}>
              {step === 0 && (
                <Typography variant="body1" color="text.secondary">
                  Create a new climate action plan to track and manage your
                  city's emissions data. Create multiple plans to envision
                  various scenarios.
                </Typography>
              )}

              {step === 1 && (
                <Typography variant="body1" color="text.secondary">
                  {data.planName} ({data.baselineYear})
                </Typography>
              )}
            </Box>

            {step === 0 && (
              <Stack spacing={2}>
                <TextField
                  required
                  label="Plan or city name"
                  value={data.planName}
                  onChange={(e) => handleChange('planName', e.target.value)}
                />
                <FormControl required>
                  <InputLabel id="baseline-select">Baseline year</InputLabel>
                  <Select
                    label="Baseline year"
                    labelId="baseline-select"
                    id="baseline-select-component"
                    renderValue={(value) => value}
                    value={data.baselineYear}
                    onChange={(e) =>
                      handleChange('baselineYear', Number(e.target.value))
                    }
                  >
                    {BASELINE_OPTIONS.map((year) => (
                      <MenuItem key={year} value={year}>
                        <Stack spacing={0.5}>
                          <Typography>{year}</Typography>
                          {PANDEMIC_YEARS.includes(year) && (
                            <Stack
                              sx={{ color: 'text.secondary' }}
                              direction="row"
                              spacing={0.5}
                              justifyContent="center"
                            >
                              <Box sx={{ color: 'warning.main' }}>
                                <ExclamationTriangle size={16} />
                              </Box>
                              <Typography variant="caption">
                                COVID-19 may have skewed data for this year
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                  {data.baselineYear &&
                  PANDEMIC_YEARS.includes(data.baselineYear) ? (
                    <FormHelperText
                      component={Stack}
                      sx={{ color: 'warning.dark', pt: 1 }}
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                    >
                      <Box>
                        <ExclamationTriangle size={18} />
                      </Box>
                      <Typography variant="caption">
                        COVID-19 may have skewed data for this year. Consider
                        another baseline year for more typical results.
                      </Typography>
                    </FormHelperText>
                  ) : (
                    <FormHelperText>
                      The baseline year is the reference point for measuring
                      future emission reductions. You must provide your city's
                      operational and statistical data for this specific year.
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            )}

            {step === 1 && (
              <Stack spacing={2}>
                <FormControl required>
                  <FormLabel id="population-input" sx={{ mb: 0.5 }}>
                    <Typography component="span" variant="body2">
                      What's your city's population?
                    </Typography>
                  </FormLabel>
                  <NumberInput
                    aria-labelledby="population-input"
                    inputProps={{
                      allowNegative: false,
                      min: 0,
                      max: 50000000,
                    }}
                    value={data.population}
                    onValueChange={(values) =>
                      handleChange('population', values.floatValue ?? '')
                    }
                  />
                </FormControl>

                <FormControl required>
                  <FormLabel id="baseline-select" sx={{ mb: 0.5 }}>
                    <Typography component="span" variant="body2">
                      Is your city warm or cold?
                    </Typography>
                  </FormLabel>
                  <Select
                    hiddenLabel
                    labelId="climate-select"
                    id="climate-select-component"
                    value={data.climate}
                    onChange={(e) => handleChange('climate', e.target.value)}
                  >
                    {CLIMATE_OPTIONS.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl required>
                  <FormLabel id="baseline-select" sx={{ mb: 0.5 }}>
                    <Typography component="span" variant="body2">
                      What's the percentage of renewable energy in your
                      electricity mix?
                    </Typography>
                  </FormLabel>
                  <Select
                    hiddenLabel
                    labelId="electricity-select"
                    id="electricity-select-component"
                    value={data.renewableElectricityMix}
                    onChange={(e) =>
                      handleChange('renewableElectricityMix', e.target.value)
                    }
                  >
                    {RENEWABLE_ELECTRICITY_OPTIONS.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <AlertTitle>{getErrorMessage(error)}</AlertTitle>
              </Alert>
            )}
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: 'flex-end',
              px: 3,
              pb: 3,
            }}
          >
            {step === 0 && (
              <>
                <Button variant="text" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setStep(1)}
                  disabled={!isValid(data, true)}
                >
                  Next
                </Button>
              </>
            )}

            {step === 1 && (
              <>
                <Button variant="text" onClick={() => setStep(0)}>
                  Previous
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading || !isValid(data)}
                  endIcon={
                    loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null
                  }
                >
                  {loading ? 'Adding...' : 'Add plan'}
                </Button>
              </>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
