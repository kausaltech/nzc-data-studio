import React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  IconButton,
  Box,
} from '@mui/material';
import { X } from 'react-bootstrap-icons';

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

const supportData = {
  imageSrc: 'https://placehold.co/600x400/000000/FFFFFF/png',
  title: 'Welcome to NetZeroPaths',
  content:
    'Thanks for joining us on this journey towards a sustainable future for your city. Here are three quick tips to help you get started!',
  getStartedUrl: '/welcome',
};

const SupportModal = ({ open, onClose }: SupportModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
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
              src={supportData.imageSrc}
              alt="Support Image"
              layout="responsive"
              width={200}
              height={100}
              style={{ width: '100%' }}
            />
          </Box>
          <Typography variant="h6" component="div" align="left">
            {supportData.title}
          </Typography>
          <Typography variant="body1" align="left">
            {supportData.content}
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
        <Button
          variant="contained"
          color="primary"
          href={supportData.getStartedUrl}
        >
          Get started
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupportModal;
