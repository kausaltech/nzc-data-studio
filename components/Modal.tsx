'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  SxProps,
  Theme,
} from '@mui/material';
import Image from 'next/image';
import { X } from 'react-bootstrap-icons';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  headerImage: string;
  headerImageAlt: string;
  headerTitle: string;
  headerSubtitle: string;
  showCloseIcon?: boolean;
  sx?: SxProps<Theme>;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  headerImage,
  headerImageAlt,
  headerTitle,
  headerSubtitle,
  showCloseIcon = true,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack direction="row" alignItems="flex-start" spacing={2}>
          <Image
            style={{ height: '50px' }}
            src={headerImage}
            alt={headerImageAlt}
            width={80}
            height={40}
          />
          <Stack>
            <Typography variant="h6" component="div">
              {headerTitle}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              {headerSubtitle}
            </Typography>
          </Stack>
        </Stack>
        {showCloseIcon && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <X size={24} />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        <Typography variant="h5" component="div" sx={{ mb: 2, mt: 4 }}>
          {title}
        </Typography>
        {children}
      </DialogContent>
    </Dialog>
  );
};
