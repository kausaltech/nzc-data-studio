'use client';

import { useCallback, useState } from 'react';
import type { MeasureForDownload } from '@/utils/measures';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { Upload } from 'react-bootstrap-icons';
import { useApolloClient, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import type {
  MeasureInput,
  UpdateMeasuresMutation,
  UpdateMeasuresMutationVariables,
} from '@/types/__generated__/graphql';
import { FileUpload } from '../FileUpload';
import { FadeAndCollapse } from '../FadeAndCollapse';
import { useSnackbar } from '../SnackbarProvider';
import { useSuspenseSelectedPlanConfig } from '../providers/SelectedPlanProvider';

const UPDATE_MEASURES = gql`
  mutation UpdateMeasures(
    $frameworkConfigId: ID!
    $measures: [MeasureInput!]!
  ) {
    updateMeasureDataPoints(
      frameworkConfigId: $frameworkConfigId
      measures: $measures
    ) {
      ok
      updatedDataPoints {
        id
        year
        value
      }
      createdDataPoints {
        id
        year
        value
      }
      deletedDataPointCount
    }
  }
`;

type Props = {
  onClose: () => void;
};

export function ImportPlanDialogContent({ onClose }: Props) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  const { setNotification } = useSnackbar();

  const plan = useSuspenseSelectedPlanConfig();
  const planName = plan?.organizationName;

  const client = useApolloClient();

  const [updateMeasures, { error }] = useMutation<
    UpdateMeasuresMutation,
    UpdateMeasuresMutationVariables
  >(UPDATE_MEASURES);

  const handleChangeFileContent = useCallback((fileContent: string | null) => {
    setFileContent(fileContent);
  }, []);

  async function handleUpload() {
    if (!fileContent || !plan?.id) {
      console.log('Missing file or framework config ID for upload');
      return;
    }

    try {
      const uploadData = JSON.parse(fileContent) as {
        measures: MeasureForDownload[];
      };

      const measures: MeasureInput[] = uploadData.measures.map((measure) => ({
        measureTemplateId: measure.uuid,
        internalNotes: measure.notes || undefined,
        dataPoints:
          measure.value === null || typeof measure.value === 'number'
            ? [{ value: measure.value }]
            : [],
      }));

      setLoading(true);

      const result = await updateMeasures({
        variables: {
          frameworkConfigId: plan.id,
          measures,
        },
      });

      if (result.data?.updateMeasureDataPoints?.ok) {
        await client.refetchQueries({ include: ['GetMeasureTemplates'] });
        setNotification({
          severity: 'success',
          message: 'Plan data imported successfully',
        });
        onClose();
      } else {
        console.error('Error uploading data:', result.errors);
      }
    } catch (err) {
      console.error('Error processing file:', err);
    }

    setLoading(false);
  }

  return (
    <>
      <DialogTitle>Import plan data</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography color="text.secondary" paragraph>
            Upload a previously exported plan to import into{' '}
            <Typography
              component="span"
              sx={{ fontWeight: 'fontWeightMedium', color: 'primary.dark' }}
            >
              {planName}
            </Typography>
            .
          </Typography>

          <FileUpload
            onChangeFileContent={handleChangeFileContent}
            acceptedFileType="application/json"
            fileType="csv"
            invalidContentMessage="Failed to process the file. It might be corrupt or in an invalid format. Please contact support for assistance."
            invalidFileMessage="Invalid file selected. Please upload a valid JSON file."
            description={
              <>
                Upload a <em>.json</em> file exported from NetZeroPlanner
              </>
            }
          />

          <FadeAndCollapse in={!!(fileContent && !error)}>
            <div>
              <Alert severity="warning" sx={{ mt: 2 }}>
                <AlertTitle>
                  Warning: Your current plan will be overwritten
                </AlertTitle>
                Uploading this file will replace all existing data in your
                current plan. This action cannot be undone. Make sure you have a
                backup if needed.
              </Alert>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={confirmOverwrite}
                    onChange={(e) => setConfirmOverwrite(e.target.checked)}
                  />
                }
                label="I understand that this action will overwrite my current plan data"
              />
            </div>
          </FadeAndCollapse>

          {error && (
            <Alert severity="error">
              <AlertTitle>Failed to import data</AlertTitle>
              {error.message}
            </Alert>
          )}
        </Box>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => void handleUpload()}
            endIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Upload size={18} />
              )
            }
            disabled={!fileContent || loading || !confirmOverwrite}
          >
            Import plan data
          </Button>
        </DialogActions>
      </DialogContent>
    </>
  );
}
