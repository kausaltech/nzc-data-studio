'use client';

import { useState, useEffect } from 'react';
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

export const Tip = ({ title, text, storageKey }: TipProps) => {
  const theme = useTheme();
  const [isTextVisible, setIsTextVisible] = useState(true);
  const [isTipOpen, setIsTipOpen] = useState(true);

  useEffect(() => {
    try {
      const savedTipState = localStorage.getItem(storageKey);
      if (savedTipState === 'closed') {
        setIsTextVisible(false);
      }
    } catch {}
  }, [storageKey]);

  const handleDismiss = () => {
    setIsTextVisible(false);
    setIsTipOpen(false);
    try {
      localStorage.setItem(storageKey, 'closed');
    } catch {}
  };

  const handleToggleTip = () => {
    const newTipState = !isTextVisible;
    setIsTextVisible(newTipState);
    try {
      localStorage.setItem(storageKey, newTipState ? 'open' : 'closed');
    } catch {}
  };

  return (
    <Accordion
      expanded={isTextVisible}
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
          Dismiss this tip
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

export default Tip;
