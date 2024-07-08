'use client';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Upload } from 'react-bootstrap-icons';
import { FileUpload } from './FileUpload';

export function UploadLegacyDataButton() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  function handleClickUpload() {
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
  }

  return (
    <div>
      <IconButton color="primary" onClick={handleClickUpload}>
        <Upload size={24} />
      </IconButton>

      <Dialog maxWidth="lg" onClose={handleClose} open={isModalOpen}>
        <DialogTitle>Import city data</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Mission cities can import data previously collected in Excel in
            collaboration with NetZeroCities.
          </Typography>

          <Box
            component="ol"
            sx={{
              listStylePosition: 'inside',
              mb: 2,
            }}
          >
            <Typography component="li">
              Open the{' '}
              <Typography component="em" color="primary.dark">
                City data - Data request
              </Typography>{' '}
              tab on your city's Economic Case spreadsheet
            </Typography>
            <Typography component="li">
              Download or export the tab as a{' '}
              <Typography component="em" color="primary.dark">
                Comma Separated Values (.csv)
              </Typography>{' '}
              file
            </Typography>
          </Box>

          <FileUpload />
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button disabled>Import</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
