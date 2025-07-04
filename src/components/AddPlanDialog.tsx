'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ExclamationTriangle, FileEarmarkPlus, X } from 'react-bootstrap-icons';
import type { NumberFormatValues } from 'react-number-format';

import NumberInput from './NumberInput';
import { useSuspenseFrameworkSettings } from '@/hooks/use-framework-settings';
import { captureException } from '@sentry/nextjs';
import { useSnackbar } from './SnackbarProvider';

type ClimateOption = 'warm' | 'cold';
type RenewableMixOption = 'low' | 'high';
type Option<T> = { label: string; value: T };

export type NewPlanData = {
  planName: string;
  baselineYear: number | '';
  population: number | '';
  targetYear: number | '';
  climate: ClimateOption | null;
  renewableElectricityMix: RenewableMixOption | null;
};

const PANDEMIC_YEARS = [2020, 2021];

const CLIMATE_OPTIONS: Option<ClimateOption>[] = [
  { label: 'Warm (Above 12°C yearly average)', value: 'warm' },
  { label: 'Cold (Below 12°C yearly average)', value: 'cold' },
];

const RENEWABLE_ELECTRICITY_OPTIONS: Option<RenewableMixOption>[] = [
  { label: 'High (50-100% renewable & nuclear)', value: 'high' },
  { label: 'Low (0-50% renewable & nuclear)', value: 'low' },
];

const INITIAL_DATA: NewPlanData = {
  planName: '',
  baselineYear: '',
  targetYear: '',
  population: '',
  climate: null,
  renewableElectricityMix: null,
};

function getErrorMessage(error: Error) {
  // Temporary hack to override non-user friendly error message
  if (
    error.message.startsWith('Instance with identifier') &&
    error.message.endsWith('already exists')
  ) {
    return 'A city plan with this name already exists. Please choose a different name.';
  }
  return `Error creating plan: ${error.message}`;
}

/**
 * Check if the form is ready to be submitted or move to the next step.
 * For targetYear, we validate the value after the user clicks "Next".
 */
function isSubmitEnabled(data: NewPlanData, onlyStepOne = false): boolean {
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

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewPlanData) => Promise<void>;
  loading: boolean;
  error?: Error;
};

function useFrameworkSettings() {
  const { setNotification } = useSnackbar();
  const { data: frameworkSettings, error: frameworkSettingsError } =
    useSuspenseFrameworkSettings();

  const minTargetYear = frameworkSettings.framework?.defaults.targetYear.min;
  const maxTargetYear = frameworkSettings.framework?.defaults.targetYear.max;
  const minBaseline = frameworkSettings.framework?.defaults.baselineYear.min;
  const maxBaseline = frameworkSettings.framework?.defaults.baselineYear.max;

  const baselineYears = useMemo(() => {
    if (typeof minBaseline === 'number' && typeof maxBaseline === 'number') {
      return new Array(maxBaseline - minBaseline + 1)
        .fill(undefined)
        .map((_, i) => minBaseline + i);
    }

    return [];
  }, [minBaseline, maxBaseline]);

  useEffect(() => {
    let errorMessage: string | null = null;

    if (frameworkSettingsError) {
      errorMessage = 'Error fetching framework settings';
    } else if (baselineYears.length === 0) {
      errorMessage = 'Error fetching possible baseline years';
    } else if (!minTargetYear || !maxTargetYear) {
      errorMessage = 'Error fetching possible target years';
    }

    if (errorMessage) {
      captureException(errorMessage, {
        extra: {
          error: frameworkSettingsError,
          minTargetYear,
          maxTargetYear,
          frameworkSettings,
          baselineYears,
        },
      });
      setNotification({
        message: 'Sorry, something went wrong on our end',
        extraDetails:
          'Our team has been notified. Please refresh the page and try again, if the problem persists, contact support for assistance.',
        severity: 'error',
      });
    }
  }, [
    frameworkSettingsError,
    minTargetYear,
    maxTargetYear,
    frameworkSettings,
    baselineYears,
    setNotification,
  ]);

  return {
    // Provide sane defaults if the framework settings are not available, an error is already captured
    minTargetYear: minTargetYear ?? 2000,
    maxTargetYear: maxTargetYear ?? 2100,
    baselineYears,
  };
}

export function AddPlanDialog({
  open,
  onClose,
  onSubmit,
  loading,
  error,
}: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<NewPlanData>(INITIAL_DATA);
  const [targetYearError, setTargetYearError] = useState<string | null>(null);
  const { minTargetYear, maxTargetYear, baselineYears } =
    useFrameworkSettings();

  function resetForm() {
    setStep(0);
    setData(INITIAL_DATA);
  }

  function isTargetYearValid(targetYear: number | ''): boolean {
    return (
      typeof targetYear === 'number' &&
      targetYear >= minTargetYear &&
      targetYear <= maxTargetYear
    );
  }

  function handleClose() {
    onClose();
    setTimeout(resetForm, 400);
  }

  function handleChange(
    field: keyof NewPlanData,
    value: NewPlanData[typeof field]
  ) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function handleTargetYearChange(values: NumberFormatValues) {
    setTargetYearError(null);
    handleChange('targetYear', values.floatValue ?? '');
  }

  function handleNext() {
    if (!isTargetYearValid(data.targetYear)) {
      setTargetYearError(
        `Target year must be between ${minTargetYear} and ${maxTargetYear}`
      );

      return;
    }

    setStep(1);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitEnabled(data)) {
      void onSubmit(data);
    }
  }

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
        <Fade in key={step}>
          <DialogContent sx={{ px: 3, pt: 0 }}>
            <Box sx={{ mb: 4 }}>
              {step === 0 ? (
                <Typography variant="body1" color="text.secondary">
                  Create a new climate action plan to track and manage your
                  city&apos;s emissions data. Create multiple plans to envision
                  various scenarios.
                </Typography>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  {data.planName} ({data.baselineYear}-{data.targetYear})
                </Typography>
              )}
            </Box>

            {step === 0 ? (
              <Grid container spacing={2}>
                <Grid size={{xs: 12}}>
                  <TextField
                    fullWidth
                    label="Plan or city name"
                    value={data.planName}
                    onChange={(e) => handleChange('planName', e.target.value)}
                  />
                </Grid>
                <Grid size={{xs: 6}}>
                  <FormControl fullWidth>
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
                      {baselineYears.map((year) => (
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
                        All data you enter will refer to this year, which serves
                        as the starting point for tracking your city's emissions
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{xs: 6}}>
                  <NumberInput
                    fullWidth
                    label="Target year"
                    inputProps={{
                      decimalScale: 0,
                      thousandSeparator: false,
                      allowNegative: false,
                      maxLength: 4,
                    }}
                    value={data.targetYear}
                    error={!!targetYearError}
                    helperText={
                      targetYearError ||
                      `The year your city aims to achieve net zero emissions (between 2030 and 2050)`
                    }
                    onValueChange={handleTargetYearChange}
                  />
                </Grid>
              </Grid>
            ) : (
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel id="population-input" sx={{ mb: 0.5 }}>
                    <Typography component="span" variant="body2">
                      {"What's your city's population?"}
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

                <FormControl>
                  <FormLabel id="climate-select" sx={{ mb: 0.5 }}>
                    <Typography component="span" variant="body2">
                      Is your city warm or cold?
                    </Typography>
                  </FormLabel>
                  <Select
                    hiddenLabel
                    labelId="climate-select"
                    id="climate-select-component"
                    value={data.climate ?? ''}
                    onChange={(e) => handleChange('climate', e.target.value)}
                  >
                    {CLIMATE_OPTIONS.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel id="electricity-select" sx={{ mb: 0.5 }}>
                    <Typography component="span" variant="body2">
                      {"What's the percentage of renewable plus nuclear energy in your electricity mix?"}
                    </Typography>
                  </FormLabel>
                  <Select
                    hiddenLabel
                    labelId="electricity-select"
                    id="electricity-select-component"
                    value={data.renewableElectricityMix ?? ''}
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
        </Fade>

        <DialogActions
          sx={{
            justifyContent: 'flex-end',
            px: 3,
            pb: 3,
          }}
        >
          {step === 0 ? (
            <>
              <Button variant="text" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                key="next" // Force the button to remount when the step changes, prevents a bug where this button receives the submit handler when going back a step
                variant="contained"
                onClick={handleNext}
                disabled={!isSubmitEnabled(data, true)}
              >
                Next
              </Button>
            </>
          ) : (
            <>
              <Button variant="text" onClick={() => setStep(0)}>
                Previous
              </Button>
              <Button
                key="submit"
                variant="contained"
                type="submit"
                disabled={loading || !isSubmitEnabled(data)}
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
  );
}
