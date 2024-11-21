'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Box,
  Typography,
  SxProps,
  Theme,
  Skeleton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRenderEditCellParams,
} from '@mui/x-data-grid';
import { ChevronDown } from 'react-bootstrap-icons';

import { GET_MEASURE_TEMPLATES } from '@/queries/get-measure-templates';
import { UPDATE_MEASURE_DATAPOINT } from '@/queries/update-measure-datapoint';
import {
  UpdateMeasureDataPointMutation,
  UpdateMeasureDataPointMutationVariables,
  GetMeasureTemplatesQuery,
} from '@/types/__generated__/graphql';
import { useFrameworkInstanceStore } from '@/store/selected-framework-instance';
import { useSnackbar } from './SnackbarProvider';
import { additionalMeasures } from '@/constants/measure-overrides';
import CustomEditComponent from './DatasheetEditor';
import { CustomFooter } from './DatasheetEditor';

const Accordion = styled(MuiAccordion)(({ theme }) => ({
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
  '& .MuiDataGrid-columnHeaderTitle, & .MuiDataGrid-cell': {
    display: 'flex',
    fontSize: theme.typography.caption.fontSize,
    whiteSpace: 'normal',
    lineHeight: 'normal',
    py: 1,
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  '& .MuiDataGrid-cell': {
    textAlign: 'left',
  },
});

interface KeyMeasure {
  label: string;
  question: string;
}

interface MeasureDataPoint {
  id: string;
  uuid: string;
  question: string;
  baselineYear: string | number;
  unit: string;
  [year: number]: string | number;
}

type MeasureSection = Record<string, MeasureDataPoint[]>;

const keyMeasures: Record<string, KeyMeasure> = additionalMeasures.reduce(
  (acc: Record<string, KeyMeasure>, measure) => {
    acc[String(measure.uuid)] = {
      label: measure.label,
      question: measure.question,
    };
    return acc;
  },
  {}
);

function NumericEditComponent(props: GridRenderEditCellParams) {
  const { colDef } = props;

  if (colDef.type === 'number') {
    return <CustomEditComponent {...props} />;
  }

  return null;
}

export function AdditionalDatasheetEditor() {
  const baselineYear =
    useFrameworkInstanceStore((state) => state.baselineYear) ?? 0;
  const selectedInstanceId = useFrameworkInstanceStore(
    (state) => state.selectedInstance
  );

  const { setNotification } = useSnackbar();
  const [measureSection, setMeasureSection] = useState<MeasureSection>({});
  const [expanded, setExpanded] = useState<number | null>(0);

  const { data, loading, error } = useQuery<GetMeasureTemplatesQuery>(
    GET_MEASURE_TEMPLATES,
    {
      variables: { frameworkConfigId: selectedInstanceId },
    }
  );

  const currentYear = new Date().getFullYear();

  const additionalYears = useMemo(
    () =>
      Array.from(
        { length: currentYear - baselineYear - 1 },
        (_, i) => baselineYear + 1 + i
      ),
    [currentYear, baselineYear]
  );

  const [updateMeasureDataPoint, { loading: mutationLoading }] = useMutation<
    UpdateMeasureDataPointMutation,
    UpdateMeasureDataPointMutationVariables
  >(UPDATE_MEASURE_DATAPOINT);

  useEffect(() => {
    if (data && data.framework) {
      const grouped: MeasureSection = {};
      const allMeasureTemplates = [
        ...(data.framework.dataCollection?.descendants || []),
        ...(data.framework.futureAssumptions?.descendants || []),
      ].flatMap((section) => section.measureTemplates);

      allMeasureTemplates.forEach((measureTemplate) => {
        const keyDriver = keyMeasures[measureTemplate.uuid];
        if (keyDriver) {
          const { label, question } = keyDriver;
          if (!grouped[label]) grouped[label] = [];

          const baselineDataPoint = measureTemplate.measure?.dataPoints.find(
            (dp) => dp.year === baselineYear
          );

          const yearData = additionalYears.reduce(
            (acc, year) => {
              const dataPoint = measureTemplate.measure?.dataPoints.find(
                (dp) => dp.year === year
              );
              acc[year] = dataPoint?.value || '';
              return acc;
            },
            {} as Record<number, string | number>
          );

          grouped[label].push({
            id: measureTemplate.id,
            uuid: measureTemplate.uuid,
            question,
            baselineYear: baselineDataPoint?.value ?? 'No Data',
            unit: measureTemplate.unit?.htmlShort ?? 'No data',
            ...yearData,
          });
        }
      });

      setMeasureSection(grouped);
    }

    if (error) {
      setNotification({
        message: 'Failed to fetch data for Additional Datasheet',
        extraDetails: error.message,
        severity: 'error',
      });
    }
  }, [data, error, setNotification, baselineYear, additionalYears]);

  const processRowUpdate = useCallback(
    async (updatedRow: MeasureDataPoint, originalRow: MeasureDataPoint) => {
      const changedYearField = Object.keys(updatedRow).find(
        (key) =>
          updatedRow[key as keyof MeasureDataPoint] !==
          originalRow[key as keyof MeasureDataPoint]
      );

      if (changedYearField) {
        const year = parseInt(changedYearField, 10);

        const newValue =
          (
            updatedRow[changedYearField as keyof MeasureDataPoint] as {
              floatValue?: number;
            }
          )?.floatValue ??
          parseFloat(
            updatedRow[changedYearField as keyof MeasureDataPoint] as string
          );

        if (!selectedInstanceId) {
          console.error('Instance ID is missing.');
          return updatedRow;
        }

        try {
          await updateMeasureDataPoint({
            variables: {
              frameworkInstanceId: selectedInstanceId,
              measureTemplateId: updatedRow.id,
              year,
              value: newValue,
            },
          });
        } catch (error) {
          setNotification({
            message: 'Failed to save, please try again',
            extraDetails: (error as Error).message,
            severity: 'error',
          });
          throw error;
        }
      }
      return updatedRow;
    },
    [updateMeasureDataPoint, setNotification, selectedInstanceId]
  );

  const COLUMNS: GridColDef[] = useMemo(
    () => [
      {
        headerName: '',
        field: 'question',
        flex: 3,
        renderCell: (params: GridRenderCellParams) => (
          <Typography
            variant="body2"
            style={{ whiteSpace: 'normal', lineHeight: 1.5 }}
            sx={{ pr: 5 }}
          >
            {params.value}
          </Typography>
        ),
      },
      {
        headerName: 'Baseline',
        field: 'baselineYear',
        flex: 1,
        renderCell: (params: GridRenderCellParams) => {
          const value = params.value;
          const formattedValue =
            typeof value === 'number'
              ? new Intl.NumberFormat(undefined, {
                  maximumFractionDigits: 0,
                }).format(value)
              : value;
          return <Typography variant="body2">{formattedValue}</Typography>;
        },
        renderHeader: () => (
          <Box sx={{ textAlign: 'center', lineHeight: 1.5 }}>
            <Typography variant="body2" component="div">
              {baselineYear}
            </Typography>
            <Typography variant="caption" component="div">
              Baseline
            </Typography>
          </Box>
        ),
      },
      { headerName: 'Unit', field: 'unit', flex: 1 },
      ...additionalYears.map(
        (year) =>
          ({
            headerName: year.toString(),
            field: year.toString(),
            editable: true,
            flex: 1,
            type: 'number',
            headerAlign: 'left',
            renderCell: (params: GridRenderCellParams) => (
              <NumericEditComponent {...params} />
            ),
            renderEditCell: (params: GridRenderEditCellParams) => (
              <NumericEditComponent {...params} />
            ),
          }) as GridColDef
      ),
    ],
    [baselineYear, additionalYears]
  );

  return (
    <div>
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={400} />
      ) : Object.keys(measureSection).length === 0 ? (
        <Typography>No data available</Typography>
      ) : (
        Object.entries(measureSection).map(([label, measures], index) => {
          const validMeasures = measures.filter((measure) => !!measure);
          if (!validMeasures.length) return null;

          return (
            <Accordion
              key={`${label}-${index}`}
              expanded={expanded === index}
              onChange={(_event, isExpanded) =>
                setExpanded(isExpanded ? index : null)
              }
            >
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
                    rows={validMeasures}
                    columns={COLUMNS}
                    sx={DATA_GRID_SX}
                    loading={loading || mutationLoading}
                    getRowHeight={() => 'auto'}
                    disableColumnSorting
                    disableColumnFilter
                    disableColumnMenu
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={(error) =>
                      setNotification({
                        message: 'Failed to save, please try again',
                        extraDetails: error.message,
                        severity: 'error',
                      })
                    }
                    slots={{ footer: CustomFooter }}
                    slotProps={{ footer: { count: validMeasures.length } }}
                    hideFooterPagination
                  />
                </Box>
              </MuiAccordionDetails>
            </Accordion>
          );
        })
      )}
    </div>
  );
}

export default AdditionalDatasheetEditor;
