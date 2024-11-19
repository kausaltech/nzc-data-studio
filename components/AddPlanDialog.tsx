'use client';

import { useEffect, useState } from 'react';
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
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ExclamationTriangle, FileEarmarkPlus, X } from 'react-bootstrap-icons';

import NumberInput from './NumberInput';

type ClimateOption = 'warm' | 'cold';
type RenewableMixOption = 'low' | 'high';
type Option<T> = { label: string; value: T };

export type NewPlanData = {
  planName: string;
  baselineYear: number | '';
  population: number | '';
  climate: ClimateOption | null;
  renewableElectricityMix: RenewableMixOption | null;
};

const BASELINE_OPTIONS = [2018, 2019, 2020, 2021, 2022, 2023];
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

function isValid(data: NewPlanData, onlyStepOne = false): boolean {
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
  onSubmit: (data: NewPlanData) => void;
  loading: boolean;
  error?: Error;
};

export function AddPlanDialog({
  open,
  onClose,
  onSubmit,
  loading,
  error,
}: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<NewPlanData>(INITIAL_DATA);

  function resetForm() {
    setStep(0);
    setData(INITIAL_DATA);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleChange(
    field: keyof NewPlanData,
    value: NewPlanData[typeof field]
  ) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isValid(data)) {
      onSubmit(data);
    }
  }

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
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
            {step === 0 ? (
              <Typography variant="body1" color="text.secondary">
                Create a new climate action plan to track and manage your city's
                emissions data. Create multiple plans to envision various
                scenarios.
              </Typography>
            ) : (
              <Typography variant="body1" color="text.secondary">
                {data.planName} ({data.baselineYear})
              </Typography>
            )}
          </Box>

          {step === 0 ? (
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
          ) : (
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

              <FormControl required>
                <FormLabel id="electricity-select" sx={{ mb: 0.5 }}>
                  <Typography component="span" variant="body2">
                    What's the percentage of renewable plus nuclear energy in
                    your electricity mix?
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
                variant="contained"
                onClick={() => setStep(1)}
                disabled={!isValid(data, true)}
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
  );
}
