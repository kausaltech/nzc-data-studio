'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

interface DialogWizardProps {
  open: boolean;
  onClose: () => void;
}

interface WizardStep {
  imageSrc: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

const wizardSteps: WizardStep[] = [
  {
    imageSrc: 'https://placehold.co/600x300/png',
    title: 'The two phases of data collection',
    content: (
      <>
        <Typography variant="body1" paragraph>
          There are two phases in the data collection centre. Together, these
          are used to forecast your city&apos;s carbon reduction potential.
        </Typography>
        <Box mb={2}>
          <Typography variant="body1" component="div">
            <strong>1. Data collection:</strong> This phase gathers detailed
            information about your city&apos;s current demographics, energy
            consumption, transportation usage, and more. This foundational step
            is crucial for generating accurate forecasts and insights.
          </Typography>
        </Box>
        <Typography variant="body1" component="div">
          <strong>2. Future assumptions:</strong> In this phase, we explore
          ambitious yet realistic scenarios aligned with your city&apos;s
          Climate Action Plan. For example, assumptions may include targets for
          reducing motorised transportation or increasing renewable energy
          adoption.
        </Typography>
      </>
    ),
  },
  {
    imageSrc: 'https://placehold.co/600x300/png',
    title: (
      <>
        Focus on collecting <em>High priority</em> data first
      </>
    ),
    content: (
      <>
        <Typography variant="body1">
          To streamline your progress, look out for data which has the highest
          impact on the accuracy of your city forecast.
        </Typography>
      </>
    ),
  },
  {
    imageSrc: 'https://placehold.co/600x300/png',
    title: 'Preview your dashboard from the get-go',
    content: (
      <>
        <Typography variant="body1" paragraph>
          Even at this early stage, you can preview what your city&apos;s
          dashboard will look like based on a similar city&apos;s sample data.
          Finalising your dashboard will be an iterative process, so continue
          previewing your dashboard as you tweak your city&apos;s future
          assumptions.
        </Typography>
      </>
    ),
  },
];

const DialogWizard = ({ open, onClose }: DialogWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
    }
  }, [open]);

  const CircleIndicator = ({ active }: { active: boolean }) => (
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: active ? 'primary.main' : 'grey.400',
        margin: '0 0.25em',
      }}
    />
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', marginBottom: 2 }}>
          {wizardSteps.map((_, index) => (
            <CircleIndicator key={index} active={index === currentStep} />
          ))}
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: 3,
        }}
      >
        <Stack spacing={2} alignItems="flex-start">
          <Box
            sx={{
              width: '100%',
              paddingBottom: 3,
            }}
          >
            <Image
              src={wizardSteps[currentStep].imageSrc}
              alt={`Step ${currentStep + 1} Image`}
              layout="responsive"
              width={600}
              height={300}
              style={{ width: '100%' }}
            />
          </Box>
          <Typography variant="h6" component="div" align="left">
            {wizardSteps[currentStep].title}
          </Typography>
          <Typography variant="body1" align="left">
            {wizardSteps[currentStep].content}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'flex-end',
          paddingBottom: 3,
          paddingRight: 3,
        }}
      >
        <Button variant="text" onClick={handleSkip} aria-label="Skip wizard">
          Skip
        </Button>
        {currentStep === wizardSteps.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}
            aria-label="Get started"
          >
            Get started
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            aria-label="Next step"
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DialogWizard;
