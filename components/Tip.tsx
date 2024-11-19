'use client';

import { useState } from 'react';
import {
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  useTheme,
} from '@mui/material';
import { Lightbulb, ChevronDown } from 'react-bootstrap-icons';

interface TipProps {
  title: string;
  text: string;
  storageKey: string;
}

function getStoredTipState(storageKey: string) {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return 'open';
  }
}

function storeTipState(storageKey: string, state: 'open' | 'closed') {
  try {
    localStorage.setItem(storageKey, state);
  } catch {}
}

export const Tip = ({ title, text, storageKey }: TipProps) => {
  const theme = useTheme();
  const [isTipOpen, setIsTipOpen] = useState(
    () => getStoredTipState(storageKey) === 'open'
  );

  const handleDismiss = () => {
    setIsTipOpen(false);
    storeTipState(storageKey, 'closed');
  };

  const handleToggleTip = () => {
    const newTipState = !isTipOpen;
    setIsTipOpen(newTipState);
    storeTipState(storageKey, newTipState ? 'open' : 'closed');
  };

  return (
    <Accordion
      expanded={isTipOpen}
      onChange={handleToggleTip}
      sx={{
        marginY: 2,
        backgroundColor: theme.palette.brand[50],
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={18} />}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Lightbulb size={24} color={theme.palette.text.primary} />
          <Typography variant="h6">{title}</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2">{text}</Typography>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={handleDismiss}
          sx={{ marginTop: 1 }}
        >
          Hide this tip
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

export default Tip;
