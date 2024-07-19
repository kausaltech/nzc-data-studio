import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ChevronDown, X } from 'react-bootstrap-icons';

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

const FAQS = [
  {
    title: 'What is the purpose of the Baseline Year in tracking emissions?',
    description:
      'The "Baseline Year" serves as the reference point from which all emissions reduction efforts are measured. It is the starting year against which progress towards achieving climate targets is assessed. By selecting a baseline year, you establish a consistent benchmark to track changes in emissions over time, enabling accurate comparisons and evaluations of your city\'s efforts to reach net-zero emissions. This helps in understanding the impact of implemented actions and in planning future strategies effectively.',
  },
  {
    title: 'What do the priority levels (High, Moderate, Low) mean?',
    description:
      'Priority levels indicate the importance of providing data for different measures in NetZeroPlanner. High priority measures are crucial for tracking and achieving climate goals, requiring essential data inputs. Moderate priority measures are important but not critical, enhancing the overall understanding of progress. Low priority measures are less critical and providing data for them is helpful but not essential for the primary evaluation of climate action progress.',
  },
];

const supportData = {
  title: 'Welcome to NetZeroPlanner',
  content:
    'Thanks for joining us on this journey towards a sustainable future for your city. Here are three quick tips to help you get started!',
  getStartedUrl: '/welcome',
};

const SupportModal = ({ open, onClose }: SupportModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          <X size={24} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: 3 }}>
        <Stack spacing={2} alignItems="flex-start">
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
                  <Typography color="primary.main" variant="subtitle1">
                    {faq.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    {faq.description}
                  </Typography>
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
  );
};

export default SupportModal;
