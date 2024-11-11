'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  IconButton,
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
    const savedTipState = localStorage.getItem(storageKey);
    if (savedTipState === 'closed') {
      setIsTextVisible(false);
    }
  }, [storageKey]);

  const handleDismiss = () => {
    setIsTextVisible(false);
    setIsTipOpen(false);
    localStorage.setItem(storageKey, 'closed');
  };

  const handleToggleTip = () => {
    const newTipState = !isTextVisible;
    setIsTextVisible(newTipState);
    localStorage.setItem(storageKey, newTipState ? 'open' : 'closed');
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        marginY: 2,
        backgroundColor: theme.palette.brand[50],
        borderRadius: 1,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Lightbulb size={24} color={theme.palette.text.primary} />
          <Typography variant="h7">{title}</Typography>
        </Stack>
        <IconButton size="small" onClick={handleToggleTip}>
          <ChevronDown size={16} />
        </IconButton>
      </Stack>
      {isTextVisible && (
        <>
          <Typography variant="body2" mt={1}>
            {text}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={handleDismiss}
            sx={{ marginTop: 1 }}
          >
            Dismiss this tip
          </Button>
        </>
      )}
    </Paper>
  );
};

export default Tip;
