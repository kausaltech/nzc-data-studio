import React, { useEffect, useState } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { ChevronDown, X } from 'react-bootstrap-icons';

import { FAQS as otherFAQs } from '@/constants/faqs';

import { IntroModal } from './IntroModal';

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

const FAQS = [
  {
    title: 'What is NetZeroPlanner?',
    description:
      'NetZeroPlanner is a tool designed by NetZeroCities and Kausal to help cities understand their pathways towards achieving net-zero carbon emissions. It provides a comprehensive platform for monitoring, reporting, and analyzing climate action plans.',
  },
  {
    title: 'How do I enter data for my city?',
    description:
      "To enter data, navigate to the Data Collection section of the tool. Input the relevant values for each variable based on your city's specific information. This data is crucial for accurate projections and analysis.",
  },
  {
    title: 'What is the purpose of the Baseline Year in tracking emissions?',
    description:
      'The "Baseline Year" serves as the reference point from which all emissions reduction efforts are measured. It is the starting year against which progress towards achieving climate targets is assessed. By selecting a baseline year, you establish a consistent benchmark to track changes in emissions over time, enabling accurate comparisons and evaluations of your city\'s efforts to reach net-zero emissions. This helps in understanding the impact of implemented actions and in planning future strategies effectively.',
  },
  {
    title: 'What do the priority levels (High, Moderate) mean?',
    description:
      'Priority levels indicate the importance of providing data for different measures in NetZeroPlanner. High priority measures are crucial for tracking and achieving climate goals, requiring essential data inputs. Moderate priority measures are important but not critical, enhancing the overall understanding of progress.',
  },
  ...otherFAQs,
];

const SupportModal = ({ open, onClose }: SupportModalProps) => {
  const [isQuickStartGuideOpen, setIsQuickStartGuideOpen] = useState(false);

  const handleShowQuickStartGuide = () => {
    onClose();
    setIsQuickStartGuideOpen(true);
  };

  useEffect(() => {
    if (open) {
      setIsQuickStartGuideOpen(false);
    }
  }, [open]);

  return (
    <>
      <IntroModal
        open={isQuickStartGuideOpen}
        onClose={() => setIsQuickStartGuideOpen(false)}
      />
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Support</span>
          <IconButton aria-label="close" onClick={onClose}>
            <X size={28} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          <Typography paragraph>
            Welcome to NetZeroPlanner! Here you can find answers to common
            questions and get the help you need to make the most of our tool. If
            you can't find what you're looking for, please contact our team at{' '}
            <Link href="mailto:support@kausal.tech">support@kausal.tech</Link>{' '}
            for further assistance.
          </Typography>
          <Stack spacing={2} alignItems="flex-start">
            <Button variant="outlined" onClick={handleShowQuickStartGuide}>
              Show the Quick Start Guide
            </Button>
            <div>
              <Typography variant="h5" gutterBottom>
                Frequently asked questions
              </Typography>
              {FAQS.map((faq) => (
                <Accordion disableGutters key={faq.title}>
                  <AccordionSummary
                    sx={{ pl: 0 }}
                    expandIcon={<ChevronDown size={20} />}
                  >
                    <Typography color="primary.main" variant="subtitle2">
                      {faq.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {'isList' in faq && faq.isList ? (
                      faq.description
                    ) : (
                      <Typography color="text.secondary">
                        {faq.description}
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'flex-end',
            paddingBottom: 3,
            paddingRight: 3,
          }}
        >
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SupportModal;
