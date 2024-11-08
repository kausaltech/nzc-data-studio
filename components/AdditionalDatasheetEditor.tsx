'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Box,
  Typography,
  SxProps,
  Theme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ChevronDown } from 'react-bootstrap-icons';

import { GET_MEASURE_TEMPLATES } from '@/queries/get-measure-templates';
import { UPDATE_MEASURE_DATAPOINT } from '@/queries/update-measure-datapoint';
import { useFrameworkInstanceStore } from '@/store/selected-framework-instance';
import { useSnackbar } from './SnackbarProvider';
import { additionalMeasures } from '@/constants/measure-overrides';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  '&:first-of-type': {
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  '&:last-of-type': {
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const DATA_GRID_SX: SxProps<Theme> = (theme) => ({
  '& .MuiDataGrid-columnHeaderTitle': {
    fontSize: theme.typography.caption.fontSize,
    whiteSpace: 'normal',
    lineHeight: 'normal',
    py: 1,
    textAlign: 'center',
  },
  '& .MuiDataGrid-cell': {
    textAlign: 'center',
    padding: theme.spacing(1),
  },
});

export function AdditionalDatasheetEditor() {
  const baselineYear = useFrameworkInstanceStore((state) => state.baselineYear);
  const selectedInstanceId = useFrameworkInstanceStore(
    (state) => state.selectedInstance
  );

  const { setNotification } = useSnackbar();
  const [groupedMeasures, setGroupedMeasures] = useState({});

  const { data, loading, error } = useQuery(GET_MEASURE_TEMPLATES, {
    variables: { frameworkConfigId: selectedInstanceId },
  });

  const currentYear = new Date().getFullYear();
  const dynamicYears = Array.from(
    { length: currentYear - baselineYear - 1 },
    (_, i) => baselineYear + 1 + i
  );

  const [updateMeasureDataPoint] = useMutation(UPDATE_MEASURE_DATAPOINT);

  useEffect(() => {
    if (data && data.framework) {
      const measureIdsToLabels = additionalMeasures.reduce((acc, measure) => {
        acc[measure.id] = measure.label;
        return acc;
      }, {});

      const grouped = {};
      const allMeasureTemplates = [
        ...(data.framework.dataCollection?.descendants || []),
        ...(data.framework.futureAssumptions?.descendants || []),
      ].flatMap((section) => section.measureTemplates);

      allMeasureTemplates.forEach((measureTemplate) => {
        const label = measureIdsToLabels[measureTemplate.id];
        if (label) {
          if (!grouped[label]) grouped[label] = [];

          const baselineDataPoint = measureTemplate.measure?.dataPoints.find(
            (dp) => dp.year === baselineYear
          );

          const yearData = dynamicYears.reduce((acc, year) => {
            const dataPoint = measureTemplate.measure?.dataPoints.find(
              (dp) => dp.year === year
            );
            acc[year] = dataPoint?.value || '';
            return acc;
          }, {});

          grouped[label].push({
            id: measureTemplate.id,
            label: measureTemplate.name || 'Unnamed Measure',
            baselineYear: baselineDataPoint?.value ?? 'No Data',
            unit: measureTemplate.unit?.htmlShort ?? 'No Unit',
            ...yearData,
          });
        }
      });

      setGroupedMeasures(grouped);
    }

    if (error) {
      setNotification({
        message: 'Failed to fetch data for Additional Datasheet',
        extraDetails: error.message,
        severity: 'error',
      });
    }
  }, [data, error, setNotification, baselineYear, dynamicYears]);

  const handleProcessRowUpdateError = (error) => {
    setNotification({
      message: 'Failed to save changes',
      extraDetails: error.message,
      severity: 'error',
    });
  };

  const COLUMNS: GridColDef[] = [
    { headerName: '', field: 'label', flex: 2 },
    {
      headerName: `${baselineYear} Baseline`,
      field: 'baselineYear',
      flex: 1,
    },
    { headerName: 'Unit', field: 'unit', flex: 1 },
    ...dynamicYears.map((year) => ({
      headerName: year.toString(),
      field: year.toString(),
      editable: true,
      flex: 1,
    })),
  ];

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!Object.keys(groupedMeasures).length) {
    return <Typography>No data available</Typography>;
  }

  return (
    <div>
      {Object.entries(groupedMeasures).map(([label, measures]) => (
        <Accordion key={label}>
          <MuiAccordionSummary
            expandIcon={<ChevronDown size={18} />}
            aria-controls={`${label}-content`}
            id={`${label}-header`}
          >
            <Typography>{label}</Typography>
          </MuiAccordionSummary>
          <MuiAccordionDetails>
            <Box sx={{ height: 400 }}>
              <DataGrid
                rows={measures}
                columns={COLUMNS}
                sx={DATA_GRID_SX}
                disableColumnFilter
                disableColumnMenu
                onProcessRowUpdateError={handleProcessRowUpdateError}
              />
            </Box>
          </MuiAccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default AdditionalDatasheetEditor;
