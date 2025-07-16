'use client';

import { useCallback, useState } from 'react';

import { useApolloClient, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
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

import type {
  MeasureInput,
  UpdateMeasuresMutation,
  UpdateMeasuresMutationVariables,
} from '@/types/__generated__/graphql';
import type { ExportedDataV1, ExportedDataV2 } from '@/utils/measures';

import { FadeAndCollapse } from '../FadeAndCollapse';
import { FileUpload } from '../FileUpload';
import { useSnackbar } from '../SnackbarProvider';
import { useSuspenseSelectedPlanConfig } from '../providers/SelectedPlanProvider';

const UPDATE_MEASURES = gql`
  mutation UpdateMeasures($frameworkConfigId: ID!, $measures: [MeasureInput!]!) {
    updateMeasureDataPoints(frameworkConfigId: $frameworkConfigId, measures: $measures) {
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

function mapUploadToMeasures(data: ExportedDataV1 | ExportedDataV2): MeasureInput[] {
  if (data.version === 1) {
    return data.measures.map((measure) => ({
      measureTemplateId: measure.uuid,
      internalNotes: measure.notes || undefined,
      dataPoints:
        measure.value === null || typeof measure.value === 'number'
          ? [{ value: measure.value }]
          : [],
    }));
  }

  return data.measures
    .filter((measure) => !!measure.dataPoints.length || !!measure.internalNotes)
    .map((measure) => ({
      measureTemplateId: measure.measureTemplate.uuid,
      internalNotes: measure.internalNotes || undefined,
      dataPoints: measure.dataPoints.map((dataPoint) => ({
        value: dataPoint.value,
        year: dataPoint.year,
      })),
    }));
}

type Props = {
  onClose: () => void;
};

export function ImportPlanDialogContent({ onClose }: Props) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  const [fileError, setFileError] = useState(false);
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
    setFileError(false);
    if (!fileContent || !plan?.id) {
      console.log('Missing file or framework config ID for upload');
      return;
    }

    try {
      const uploadData = JSON.parse(fileContent) as ExportedDataV1 | ExportedDataV2;

      if ((uploadData.version !== 1 && uploadData.version !== 2) || !uploadData.measures?.length) {
        setFileError(true);

        return;
      }

      const measures = mapUploadToMeasures(uploadData);

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
                <AlertTitle>Warning: Your current plan will be overwritten</AlertTitle>
                Uploading this file will replace all existing data in your current plan. This action
                cannot be undone. Make sure you have a backup if needed.
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

          {(error || fileError) && (
            <Alert severity="error">
              <AlertTitle>Failed to import data</AlertTitle>
              {error?.message ??
                'We were unable to process your file. Please ensure it is a valid JSON file exported from NetZeroPlanner.'}
            </Alert>
          )}
        </Box>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => void handleUpload()}
            endIcon={
              loading ? <CircularProgress size={18} color="inherit" /> : <Upload size={18} />
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
