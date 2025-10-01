import React, { useState } from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
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
        NetZeroPlanner helps your city collect the right data, model
        decarbonization pathways, and build a strong economic case for climate
        action. With your plan set up, you can forecast your emission
        reductions, track progress and share outcomes.
      </Typography>
    ),
  },
  {
    title: 'Create or select your plan',
    description: (
      <Typography>
        If your city already has a plan, select it to get started. If not,
        create a new plan to begin your decarbonization journey. If you don't
        have permission to create or edit, request access via the Support form.
      </Typography>
    ),
  },
  {
    title: "Enter your city's data",
    description: (
      <>
        <Typography gutterBottom>
          There are two phases in the data collection centre. Together, these
          are used to forecast your city's carbon reduction potential.
        </Typography>
        <Box component="ol" sx={{ listStylePosition: 'inside' }}>
          <Typography component="li" gutterBottom>
            <b>Data collection:</b> This phase gathers detailed information
            about your city's current demographics, energy consumption,
            transportation usage, and more. This foundational step is crucial
            for generating accurate forecasts and insights.
          </Typography>
          <Typography component="li">
            <b>Future assumptions:</b> In this phase, we explore ambitious yet
            realistic scenarios aligned with your city's Climate Action Plan.
            For example, assumptions may include targets for reducing motorized
            transportation or increasing renewable energy adoption.
          </Typography>
        </Box>
      </>
    ),
  },
  {
    title: 'Fill gaps with Comparable City Values',
    description: (
      <Typography>
        When specific data is unavailable, the platform will use Comparable City
        Values — estimates based on similar cities matched to your plan's input
        data. This ensures your forecast remains grounded in realistic
        assumptions.
      </Typography>
    ),
  },
  {
    title: 'Preview your dashboard from the start',
    description: (
      <>
        <Typography gutterBottom>
          Even in the early stages, you can preview your city's dashboard using
          sample data from a comparable city. Finalizing your dashboard will be
          an iterative process—keep previewing it as you adjust your city's
          future assumptions.
        </Typography>
        <Box component="ol" sx={{ listStylePosition: 'inside' }}>
          <Typography component="li" gutterBottom>
            <em>Export Outcomes to Excel</em> to share results and strengthen
            your economic case (ROI, costs, and benefits by sub-sector).
          </Typography>
          <Typography component="li">
            Open the <em>Outcomes Dashboard</em> to track decarbonization
            forecast and monitor progress.
          </Typography>
        </Box>
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
