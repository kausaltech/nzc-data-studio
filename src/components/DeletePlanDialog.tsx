'use client';

import { useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { Trash } from 'react-bootstrap-icons';

import { DELETE_FRAMEWORK_CONFIG } from '@/queries/framework/delete-framework-config';
import { GET_FRAMEWORK_CONFIGS } from '@/queries/framework/get-framework-config';
import type {
  DeleteFrameworkMutation,
  DeleteFrameworkMutationVariables,
} from '@/types/__generated__/graphql';

import { useSnackbar } from './SnackbarProvider';

type Props = {
  open: boolean;
  planId: string | null;
  planName: string | null;
  onClose: () => void;
  onSuccess: (deletedId: string) => void;
};

export function DeletePlanDialog({ open, planId, planName, onClose, onSuccess }: Props) {
  const [typedName, setTypedName] = useState('');
  const { setNotification } = useSnackbar();

  const [deletePlan, { loading }] = useMutation<
    DeleteFrameworkMutation,
    DeleteFrameworkMutationVariables
  >(DELETE_FRAMEWORK_CONFIG, {
    refetchQueries: [GET_FRAMEWORK_CONFIGS],
  });

  useEffect(() => {
    if (open) {
      setTypedName('');
    }
  }, [open, planId]);

  const nameMatches = typedName.trim() === (planName ?? '');

  async function handleConfirm() {
    if (!planId || !nameMatches) {
      return;
    }

    try {
      await deletePlan({ variables: { id: planId } });

      setNotification({
        message: `"${planName}" was deleted.`,
        severity: 'success',
      });

      onSuccess(planId);
    } catch {
      setNotification({
        message: 'Failed to delete the plan. Please try again.',
        severity: 'error',
      });
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              color: 'error.dark',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Trash size={20} />
          </Box>
          <Typography variant="h5" component="span">
            Delete "{planName}"?
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          This plan and all its collected data will be permanently deleted.{' '}
          <Box component="span" sx={{ fontWeight: 700 }}>
            This action can't be undone.
          </Box>
        </Typography>

        <Alert severity="warning" icon={false} sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={700} gutterBottom>
            You will lose:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>All baseline and assumption data</li>
            <li>Outcomes dashboard projections</li>
          </Box>
        </Alert>

        <Typography variant="body2" color="text.secondary">
          To confirm, type the plan name:{' '}
          <Box
            component="code"
            sx={{
              bgcolor: 'grey.200',
              px: 1,
              py: 0.25,
              borderRadius: 1,
            }}
          >
            {planName}
          </Box>
        </Typography>
        <TextField
          autoFocus
          fullWidth
          size="small"
          value={typedName}
          onChange={(e) => setTypedName(e.target.value)}
          placeholder={planName ?? undefined}
          sx={{ mt: 1 }}
          focused={nameMatches || undefined}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="text" color="primary" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          disabled={!nameMatches || loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Trash size={16} />}
          onClick={() => void handleConfirm()}
        >
          Delete plan
        </Button>
      </DialogActions>
    </Dialog>
  );
}
