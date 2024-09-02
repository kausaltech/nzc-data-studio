'use client';

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { Upload } from 'react-bootstrap-icons';
import { FileUpload } from './FileUpload';
import { ParsedCsvResponse, parseMeasuresCsv } from '@/utils/csv-import';
import { useApolloClient, useMutation } from '@apollo/client';
import { UPDATE_MEASURE_DATAPOINT } from '@/queries/update-measure-datapoint';
import {
  GetMeasureTemplatesQuery,
  UpdateMeasureDataPointMutation,
  UpdateMeasureDataPointMutationVariables,
} from '@/types/__generated__/graphql';
import useStore from '@/store/use-store';
import { useFrameworkInstanceStore } from '@/store/selected-framework-instance';

type Props = {
  measureTemplates: NonNullable<GetMeasureTemplatesQuery['framework']>;
};

function getMeasureTemplateId(
  uuid: string,
  name: string,
  measureTemplates: NonNullable<GetMeasureTemplatesQuery['framework']>
): string {
  const sections = [
    ...(measureTemplates.dataCollection?.descendants ?? []),
    ...(measureTemplates.futureAssumptions?.descendants ?? []),
  ];

  for (const section of sections) {
    const measureTemplate = section.measureTemplates.find(
      (template) => template.uuid === uuid
    );

    if (measureTemplate) {
      return measureTemplate.id;
    }
  }

  throw new Error(`No datapoint found for: "${name}"`);
}

type ImportError = {
  measureLabel: string;
  error: string;
};

type Count = {
  total: number;
  error: number;
  success: number;
};

type Status = 'IDLE' | 'IMPORTING' | 'COMPLETED' | 'ERROR';

export function UploadLegacyDataButton({ measureTemplates }: Props) {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('IDLE');
  const [count, setCount] = useState<Count>({ error: 0, success: 0, total: 0 });
  const [parsedCsv, setParsedCsv] = useState<ParsedCsvResponse>();
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const client = useApolloClient();
  const [updateMeasureDataPoint] = useMutation<
    UpdateMeasureDataPointMutation,
    UpdateMeasureDataPointMutationVariables
  >(UPDATE_MEASURE_DATAPOINT);

  const { data: selectedInstanceId } = useStore(
    useFrameworkInstanceStore,
    (state) => state.selectedInstance
  );

  function handleClickUpload() {
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
  }

  function reset() {
    if (status !== 'IMPORTING') {
      setStatus('IDLE');
      setFileContent(null);
      setImportErrors([]);
      setCount({ error: 0, success: 0, total: 0 });
      setParsedCsv(undefined);
    }
  }

  async function handleImport(parsedCsv: ParsedCsvResponse) {
    if (!parsedCsv || !parsedCsv.measures) {
      console.error('No parsed CSV data available');
      return;
    }

    setStatus('IMPORTING');
    setImportErrors([]);
    setCount({
      error: 0,
      success: 0,
      total: parsedCsv.measures.size,
    });

    const updatePromises = Array.from(parsedCsv.measures.entries()).map(
      async ([measureTemplateId, measure]) => {
        try {
          const id = getMeasureTemplateId(
            measureTemplateId,
            measure.label,
            measureTemplates
          );

          if (!selectedInstanceId) {
            throw new Error('No plan selected');
          }

          await updateMeasureDataPoint({
            variables: {
              frameworkInstanceId: selectedInstanceId,
              measureTemplateId: id,
              internalNotes: measure.comment || '',
              value: measure.value,
            },
          });

          setCount((count) => ({ ...count, success: count.success + 1 }));
        } catch (error) {
          setCount((count) => ({ ...count, error: count.error + 1 }));
          setImportErrors((errors) => [
            {
              measureLabel: measure.label,
              error: (error as Error).message,
            },
            ...errors,
          ]);

          return {
            measureLabel: measure.label,
            error: (error as Error).message,
          };
        }
      }
    );

    try {
      await Promise.all(updatePromises);
      await client.refetchQueries({ include: ['GetMeasureTemplates'] });
      setStatus('COMPLETED');
    } catch (error) {
      console.error('Unexpected error during import:', error);
      setStatus('ERROR');
    }
  }

  function handleUpload() {
    if (!fileContent) {
      setStatus('ERROR');
      return;
    }

    setStatus('IMPORTING');

    const parsedCsv = parseMeasuresCsv(fileContent);

    if (parsedCsv.measures.size === 0) {
      setStatus('ERROR');
    }

    setParsedCsv(parsedCsv);
    handleImport(parsedCsv);
  }

  const handleChangeFileContent = useCallback((fileContent: string | null) => {
    setFileContent(fileContent);
  }, []);

  return (
    <div>
      <IconButton color="primary" onClick={handleClickUpload}>
        <Upload size={24} />
      </IconButton>

      <Dialog
        onTransitionExited={reset}
        fullWidth
        maxWidth="md"
        onClose={handleClose}
        open={isModalOpen}
      >
        {status === 'IMPORTING' && (
          <LinearProgress
            variant="determinate"
            value={((count.error + count.success) * 100) / count.total}
          />
        )}

        <DialogTitle>Import city data</DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative' }}>
            {status !== 'IDLE' && (
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
                  {status === 'IMPORTING' && (
                    <>
                      <Typography variant="h4" component="h2">
                        Importing {count.success}/{count.total} rows
                      </Typography>
                      {count.error > 0 && (
                        <Typography variant="subtitle1">
                          Failed to import {count.error} rows
                        </Typography>
                      )}
                    </>
                  )}
                  {status === 'COMPLETED' && (
                    <Typography variant="h4" component="h2">
                      Import complete
                    </Typography>
                  )}
                  <Stack spacing={1} mt={2}>
                    {status === 'IMPORTING' && (
                      <>
                        <Skeleton variant="rounded" height={80} />
                        {count.error === 0 && (
                          <Skeleton variant="rounded" height={80} />
                        )}
                      </>
                    )}

                    {status === 'COMPLETED' && count.success > 0 && (
                      <Collapse in>
                        <Alert severity="success">
                          <AlertTitle>
                            Successfully imported {count.success}/{count.total}{' '}
                            rows.
                          </AlertTitle>
                        </Alert>
                      </Collapse>
                    )}

                    {importErrors.map((error, index) => (
                      <Collapse in key={index}>
                        <Alert severity="error">
                          <AlertTitle>
                            Failed to import row "{error.measureLabel}"
                          </AlertTitle>
                          <Typography variant="body2">{error.error}</Typography>
                        </Alert>
                      </Collapse>
                    ))}

                    {parsedCsv?.errors.map((error, index) => (
                      <Collapse in key={index}>
                        <Alert severity="error">
                          {error.type === 'MEASURE_ERROR' ? (
                            <>
                              <AlertTitle>
                                Failed to import row "{error.row.label}"
                              </AlertTitle>
                              <Typography variant="body2">
                                {error.message}
                              </Typography>
                            </>
                          ) : (
                            <AlertTitle>{error.message}</AlertTitle>
                          )}
                        </Alert>
                      </Collapse>
                    ))}
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

            <FileUpload
              onChangeFileContent={handleChangeFileContent}
              acceptedFileType="text/csv"
              fileType="csv"
              invalidContentMessage="Failed to process the file. It might be corrupt or in an invalid format. Please contact support for assistance."
              invalidFileMessage="Invalid file selected. Please upload a valid CSV file."
              description={
                <>
                  Upload a <em>.csv</em> file from the data request sheet in
                  collaboration with NetZeroCities
                </>
              }
            />
          </Box>

          <DialogActions>
            {status !== 'COMPLETED' && (
              <>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                  disabled={!fileContent || status === 'IMPORTING'}
                  onClick={handleUpload}
                  endIcon={
                    status === 'IMPORTING' && (
                      <CircularProgress size={18} color="inherit" />
                    )
                  }
                >
                  {status === 'IMPORTING' ? 'Importing' : 'Import'}
                </Button>
              </>
            )}
            {status === 'COMPLETED' && (
              <Button onClick={handleClose}>Done</Button>
            )}
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
