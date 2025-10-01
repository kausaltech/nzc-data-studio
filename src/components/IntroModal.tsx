import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Link,
  MobileStepper,
  Stack,
  Typography,
} from '@mui/material';

export interface IntroModalProps {
  open: boolean;
  onClose: () => void;
}

export const INTRO_MODAL_VIEWED_KEY = 'introModalViewed';

export function persistIntroModalViewed() {
  try {
    localStorage.setItem(INTRO_MODAL_VIEWED_KEY, 'true');
  } catch {}
}

const STEPS = [
  {
    title: 'Welcome to NetZeroPlanner',
    description: (
      <Typography>
        NetZeroPlanner helps your city design and track its Climate Action Plan
        (CAP). By entering baseline data and future assumptions, you can model
        decarbonization pathways, forecast emission reductions, and monitor real
        progress over time.
      </Typography>
    ),
  },
  {
    title: 'Create or select your Climate Action Plan (CAP)',
    description: (
      <Typography>
        If your city already has a plan, select it to get started. If not,
        create a new CAP by answering a few setup questions. NetZeroPlanner will
        generate default values from comparable cities to help you begin.
      </Typography>
    ),
  },
  {
    title: "Enter your city's data",
    description: (
      <>
        <Typography gutterBottom>
          Data entry has two main phases. Together they provide the foundation
          for your forecast and pathway to climate neutrality:
        </Typography>
        <Box component="ol" sx={{ listStylePosition: 'inside' }}>
          <Typography component="li" gutterBottom>
            <b>Baseline data:</b> Provide emissions-related data for your chosen
            baseline year. Comparable City Values will be used where local data
            is missing.
          </Typography>
          <Typography component="li">
            <b>Future assumptions:</b> Add your city's goals (e.g. reduced car
            travel, increased renewable energy). These targets shape your
            forecast scenario.
          </Typography>
        </Box>
      </>
    ),
  },
  {
    title: 'Use Comparable City Values where needed',
    description: (
      <Typography>
        If specific data isn't available, NetZeroPlanner fills the gap with
        values from similar cities in Europe. These{' '}
        <em>Comparable City Values</em> are automatically applied and clearly
        indicated, helping keep your forecast realistic while you gather more
        precise inputs.
      </Typography>
    ),
  },
  {
    title: 'View results and track progress',
    description: (
      <>
        <Typography gutterBottom>
          From the start, you can preview your Outcomes Dashboard to see your
          city's projected emissions pathway. Over time, you can:
        </Typography>
        <Box component="ul" sx={{ listStylePosition: 'inside' }}>
          <Typography component="li" gutterBottom>
            <em>View Outcomes Dashboard</em> - Visualise emissions reductions
            and sector breakdowns compared to your baseline.
          </Typography>
          <Typography component="li" gutterBottom>
            <em>Export Outcomes to Excel</em> - Share results, including
            economic case, ROI, and co-benefits, or generate Climate City
            Contract tables.
          </Typography>
          <Typography component="li">
            <em>Use the Progress Tracker</em> - Add observed yearly data to
            compare actual performance against your plan and stay on target.
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Want more detail? See the full{' '}
          <Link
            href="https://netzerocities.app/netzeroplanner"
            target="_blank"
            rel="noopener noreferrer"
          >
            NetZeroPlanner Quick Start Guide
          </Link>{' '}
          on the NetZeroCities portal.
        </Typography>
      </>
    ),
  },
];

export const IntroModal = ({ open, onClose }: IntroModalProps) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    }

    if (activeStep === STEPS.length - 1) {
      onClose();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  useEffect(() => {
    if (open) {
      setActiveStep(0);
    }
  }, [open]);

  return (
    <Dialog maxWidth="sm" open={open} onClose={onClose} fullWidth>
      <DialogContent sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          {STEPS[activeStep].title}
        </Typography>
        <div>{STEPS[activeStep].description}</div>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', p: 0 }}>
        <MobileStepper
          variant="dots"
          steps={STEPS.length}
          position="static"
          activeStep={activeStep}
          sx={{ flexGrow: 1, m: 0 }}
          nextButton={
            <Stack direction="row" spacing={1}>
              {activeStep < STEPS.length - 1 && (
                <Button size="small" onClick={onClose} variant="text">
                  Skip
                </Button>
              )}
              <Button
                size="small"
                onClick={handleNext}
                variant={
                  activeStep === STEPS.length - 1 ? 'contained' : 'outlined'
                }
              >
                {activeStep === STEPS.length - 1 ? 'Get started' : 'Next'}
              </Button>
            </Stack>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
          }
        />
      </DialogActions>
    </Dialog>
  );
};
