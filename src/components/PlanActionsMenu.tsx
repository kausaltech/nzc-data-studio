'use client';

import { useState } from 'react';

import { useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { Gear, Lock, ThreeDots, Trash, Unlock } from 'react-bootstrap-icons';

import {
  LOCK_FRAMEWORK_CONFIG,
  type LockFrameworkConfigMutation,
  type LockFrameworkConfigMutationVariables,
} from '@/queries/framework/lock-framework-config';

import { useSnackbar } from './SnackbarProvider';

type Props = {
  planId: string;
  planName: string;
  isLocked: boolean;
  onDeleteClick: () => void;
};

export function PlanActionsMenu({ planId, planName, isLocked, onDeleteClick }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = !!anchorEl;
  const { setNotification } = useSnackbar();

  // TODO: Update this when the backend is ready
  const [lockPlan, { loading }] = useMutation<
    LockFrameworkConfigMutation,
    LockFrameworkConfigMutationVariables
  >(LOCK_FRAMEWORK_CONFIG);

  function handleOpen(e: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(e.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  async function handleLockToggle() {
    handleClose();
    try {
      await lockPlan({ variables: { id: planId, locked: !isLocked } });
      setNotification({
        message: isLocked
          ? `"${planName}" unlocked — editing enabled.`
          : `"${planName}" locked — editing disabled.`,
        severity: 'success',
      });
    } catch {
      setNotification({
        message: 'Failed to update plan lock status. Please try again.',
        severity: 'error',
      });
    }
  }

  function handleDeleteClick() {
    handleClose();
    onDeleteClick();
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconButton color="inherit" onClick={handleOpen} disabled={loading}>
        <ThreeDots size={22} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 240, mt: 0.75 } } }}
      >
        <MenuItem onClick={() => void handleLockToggle()}>
          <ListItemIcon>{isLocked ? <Unlock size={16} /> : <Lock size={16} />}</ListItemIcon>
          <ListItemText
            primary={isLocked ? 'Unlock plan' : 'Lock plan'}
            secondary={isLocked ? 'Allow edits again' : 'Prevent edits until unlocked'}
          />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.dark' }}>
          <ListItemIcon sx={{ color: 'error.dark' }}>
            <Trash size={16} />
          </ListItemIcon>
          <ListItemText
            primary="Delete plan"
            secondary="Permanently remove this plan"
            slotProps={{ secondary: { color: 'error.dark', sx: { opacity: 0.8 } } }}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
}
