'use client';

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { Upload } from 'react-bootstrap-icons';
import { FileUpload } from './FileUpload';
import { ParsedCsvResponse, parseMeasuresCsv } from '@/utils/csv-import';

export function UploadLegacyDataButton() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [status, setStatus] = useState<
    'PENDING' | 'IMPORTING' | 'SUCCESS' | 'ERROR'
  >('PENDING');
  const [parsedCsv, setParsedCsv] = useState<ParsedCsvResponse>();

  function handleClickUpload() {
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
  }

  function reset() {
    if (!isModalOpen) {
      setStatus('PENDING');
      setFileContent(null);
    }
  }

  function handleUpload() {
    if (!fileContent) {
      setStatus('ERROR');
      return;
    }

    setStatus('IMPORTING');

    const parsedCsv = parseMeasuresCsv(fileContent);

    setTimeout(() => {
      setParsedCsv(parsedCsv);
      setStatus(parsedCsv.measures.size > 0 ? 'SUCCESS' : 'ERROR');
    }, 2000);
  }

  function handleImport() {}

  const handleChangeFileContent = useCallback((fileContent: string | null) => {
    setFileContent(fileContent);
  }, []);

  return (
    <div>
      <IconButton color="primary" onClick={handleClickUpload}>
        <Upload size={24} />
      </IconButton>

      <Dialog
        onTransitionEnd={reset}
        fullWidth
        maxWidth="md"
        onClose={handleClose}
        open={isModalOpen}
      >
        <DialogTitle>Import city data</DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative' }}>
            {status === 'SUCCESS' && (
              <Fade in>
                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    zIndex: 10,
                    overflowY: 'scroll',
                  }}
                >
                  <Stack spacing={1}>
                    {parsedCsv?.measures && parsedCsv.measures.size > 0 && (
                      <Alert severity="success">
                        <AlertTitle>
                          Successfully processed {parsedCsv.measures.size} rows.
                        </AlertTitle>
                        <Typography variant="body2">
                          Click 'Import' to complete the process.
                        </Typography>
                      </Alert>
                    )}

                    {!!parsedCsv?.errors.length && (
                      <Alert severity="warning">
                        <AlertTitle>
                          {parsedCsv.errors.length} rows could not be processed
                          due to errors.
                        </AlertTitle>
                        <Typography variant="body2" paragraph>
                          You can still import the successful rows and manually
                          add the remaining data later.
                        </Typography>
                        <Box>
                          {parsedCsv.errors.map((error, i) => (
                            <Typography key={i} component="li" variant="body2">
                              {error.type === 'MEASURE_ERROR'
                                ? error.row.label
                                : error.message}
                            </Typography>
                          ))}
                        </Box>
                      </Alert>
                    )}
                  </Stack>
                </Box>
              </Fade>
            )}

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
                tab on your city's Economic Case spreadsheet.
              </Typography>
              <Typography component="li">
                Download or export the tab as a{' '}
                <Typography component="em" color="primary.dark">
                  Comma Separated Values (.csv)
                </Typography>{' '}
                file.
              </Typography>
              <Typography component="li">
                Upload the file here and complete the import process.
              </Typography>
            </Box>

            <FileUpload onChangeFileContent={handleChangeFileContent} />
          </Box>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            {status !== 'SUCCESS' && (
              <Button
                disabled={!fileContent || status === 'IMPORTING'}
                onClick={handleUpload}
                endIcon={
                  status === 'IMPORTING' && (
                    <CircularProgress size={18} color="inherit" />
                  )
                }
              >
                Upload
              </Button>
            )}
            {status === 'SUCCESS' && (
              <Button onClick={handleUpload}>Import</Button>
            )}
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
