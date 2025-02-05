'use client';

import { useCallback, useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  AccordionSummary as MuiAccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { ChevronDown } from 'react-bootstrap-icons';
import {
  getDecimalPrecisionByUnit,
  getMeasureValue,
  getUnitName,
  isYearMeasure,
  mapMeasureTemplatesToRows,
  Section,
} from '@/utils/measures';

import { GET_MEASURE_TEMPLATES } from '@/queries/get-measure-templates';
import { UPDATE_MEASURE_DATAPOINT } from '@/queries/update-measure-datapoint';
import {
  UpdateMeasureDataPointMutation,
  UpdateMeasureDataPointMutationVariables,
  GetMeasureTemplatesQuery,
  UnitType,
  MeasureTemplateFragmentFragment,
} from '@/types/__generated__/graphql';
import { useSnackbar } from './SnackbarProvider';
import CustomEditComponent, {
  Accordion,
  AccordionDetails,
  DATA_GRID_SX,
  formatNumericValue,
  useSingleClickEdit,
} from './DatasheetEditor';
import { CustomFooter } from './DatasheetEditor';
import { ADDITIONAL_MEASURES } from '@/constants/measure-overrides';
import { usePermissions } from '@/hooks/use-user-profile';
import { GET_MEASURE_TEMPLATE } from '@/queries/get-measure-template';
import { LoadingCard } from '@/app/loading';
import { default as ErrorComponent } from '@/app/error';
import { captureException } from '@sentry/nextjs';
import {
  useSelectedPlanId,
  useSuspenseSelectedPlanConfig,
} from './providers/SelectedPlanProvider';
import { serializeError } from 'serialize-error';

type MeasureDataPoint = {
  type: 'MEASURE';
  id: string;
  isTitle: false;
  label: string;
  baselineValue: number | null;
  unit: UnitType;
  originalId: string;
  depth: number;
  placeholderDataPoints: Record<number, null | number>;
  originalMeasureTemplate: MeasureTemplateFragmentFragment;
  [year: number]: null | number;
};

type SectionRow = {
  type: 'SECTION';
  isTitle: boolean;
  id: string;
  label: string;
  depth: number;
};

type Row = MeasureDataPoint | SectionRow;

const currentYear = new Date().getFullYear();

function getPlaceholderValue(row: Row, year: number) {
  if (row.type === 'MEASURE') {
    return row.placeholderDataPoints[year] ?? undefined;
  }

  return undefined;
}

function getRowsFromSection(
  { childSections = [], measureTemplates = [], ...section }: Section,
  depth = 0,
  isRoot: boolean = false,
  baselineYear: number | null = null
): Row[] {
  const sectionRow: SectionRow = {
    type: 'SECTION',
    isTitle: true,
    label: section.name,
    id: section.id,
    depth,
  };

  function reduceDataPoints(
    acc: Record<number, null | number>,
    dataPoint: {
      year?: number | null | undefined;
      value?: number | null | undefined;
    } | null
  ) {
    if (typeof dataPoint?.year !== 'number') {
      return acc;
    }

    return {
      ...acc,
      [dataPoint.year]: dataPoint.value ?? null,
    };
  }

  return [
    ...(isRoot ? [] : [sectionRow]),
    ...measureTemplates.flatMap(
      (measure): MeasureDataPoint => ({
        isTitle: false,
        type: 'MEASURE',
        id: measure.uuid,
        originalId: measure.id,
        label: measure.name,
        baselineValue: getMeasureValue(measure, baselineYear),
        unit: measure.unit,
        depth: depth + 1,
        originalMeasureTemplate: measure,
        placeholderDataPoints:
          measure.measure?.placeholderDataPoints?.reduce(
            reduceDataPoints,
            {} as Record<number, null | number>
          ) ?? {},
        ...measure.measure?.dataPoints.reduce(
          reduceDataPoints,
          {} as Record<number, null | number>
        ),
      })
    ),
    ...childSections.flatMap((section) =>
      getRowsFromSection(section, depth + 1, false, baselineYear)
    ),
  ];
}

/**
 * Filter the measure templates to only include the additional
 * measures used to calculate historical emissions.
 */
function filterMeasureTemplates(
  data: GetMeasureTemplatesQuery | undefined,
  allowedMeasureTemplateUuids: Set<string>
) {
  if (!data?.framework) {
    return undefined;
  }

  const dataCollectionMap = new Map(
    data.framework.dataCollection?.descendants.map((section) => [
      section.uuid,
      section,
    ])
  );

  function getAncestorUuids(parent: { uuid: string } | undefined): string[] {
    if (!parent?.uuid) {
      return [];
    }

    const nextParent = dataCollectionMap.get(parent.uuid);

    return [parent.uuid, ...getAncestorUuids(nextParent?.parent ?? undefined)];
  }

  const allowedSectionUuids = data.framework.dataCollection?.descendants
    .map((section) => {
      if (
        section.measureTemplates.some((template) =>
          allowedMeasureTemplateUuids.has(template.uuid)
        )
      ) {
        return [
          section.uuid,
          ...getAncestorUuids(section?.parent ?? undefined),
        ];
      }

      return undefined;
    })
    .flat()
    .filter(Boolean);

  const allowedSectionUuidsSet = new Set(
    allowedSectionUuids?.map((uuid) => uuid) ?? []
  );

  const filteredSections = data.framework.dataCollection?.descendants
    .filter((section) => allowedSectionUuidsSet.has(section.uuid))
    .map((section) => ({
      ...section,
      measureTemplates: section.measureTemplates.filter((template) =>
        allowedMeasureTemplateUuids.has(template.uuid)
      ),
    }));

  return filteredSections;
}

type DatasheetSectionProps = {
  section: Section;
  baselineYear: number;
};

function isValidYear(yearString: string) {
  const yearRegex = /^\d{4}$/;
  if (!yearRegex.test(yearString)) {
    return false;
  }

  const year = parseInt(yearString, 10);

  const currentYear = new Date().getFullYear();

  return year >= 1000 && year <= currentYear;
}

function DatasheetSection({ section, baselineYear }: DatasheetSectionProps) {
  const [rowsFailedToSave, setRowsFailedToSave] = useState<
    { year: string; uuid: string }[]
  >([]);
  const { setNotification } = useSnackbar();
  const singleClickEditProps = useSingleClickEdit();
  const permissions = usePermissions();
  const { selectedPlanId } = useSelectedPlanId();

  const additionalYears = useMemo(
    () =>
      Array.from(
        { length: currentYear - baselineYear - 1 },
        (_, i) => baselineYear + 1 + i
      ),
    [baselineYear]
  );

  const rows = useMemo(
    () => getRowsFromSection(section, 0, true, baselineYear),
    [section, baselineYear]
  );

  const [updateMeasureDataPoint, { loading }] = useMutation<
    UpdateMeasureDataPointMutation,
    UpdateMeasureDataPointMutationVariables
  >(UPDATE_MEASURE_DATAPOINT);

  const handleProcessRowUpdateError = useCallback(
    (error: Error) => {
      setNotification({
        message: 'Failed to save, please try again',
        extraDetails: error.message,
        severity: 'error',
      });
    },
    [setNotification]
  );

  const processRowUpdate = useCallback(
    async (updatedRow: Row, originalRow: Row): Promise<Row> => {
      if (updatedRow.type !== 'MEASURE' || originalRow.type !== 'MEASURE') {
        return originalRow;
      }

      const changedYearField = Object.keys(updatedRow).find(
        (key) =>
          isValidYear(key) &&
          updatedRow[key as keyof Row] !== originalRow[key as keyof Row]
      );

      if (changedYearField) {
        const year = parseInt(changedYearField, 10);
        const newValue = updatedRow[changedYearField as keyof Row] ?? null;

        if (!selectedPlanId) {
          throw new Error('No plan selected');
        }

        if (typeof newValue !== 'number' && newValue !== null) {
          // Shouldn't occur, the input should always be a number
          throw new Error('Invalid value');
        }

        try {
          await updateMeasureDataPoint({
            variables: {
              frameworkInstanceId: selectedPlanId,
              measureTemplateId: updatedRow.originalId,
              year,
              value: newValue,
            },
            refetchQueries() {
              return [
                {
                  query: GET_MEASURE_TEMPLATE,
                  variables: {
                    id: updatedRow.originalId,
                    frameworkConfigId: selectedPlanId,
                  },
                },
              ];
            },
          });

          if (rowsFailedToSave.find((row) => row.uuid === updatedRow.id)) {
            setRowsFailedToSave((rows) => [
              ...rows.filter((row) => row.uuid !== updatedRow.id),
            ]);
          }
        } catch (error) {
          setRowsFailedToSave((rows) => [
            ...rows,
            { uuid: updatedRow.id, year: changedYearField },
          ]);

          // Rethrow the error to be caught by onProcessRowUpdateError and prevent exiting edit mode
          throw error;
        }

        return updatedRow;
      }
      return updatedRow;
    },
    [updateMeasureDataPoint, selectedPlanId, rowsFailedToSave]
  );

  const COLUMNS: GridColDef[] = useMemo(
    () => [
      {
        display: 'flex',
        headerName: 'Label',
        field: 'label',
        flex: 2,
        renderCell: (params: GridRenderCellParams<Row>) => {
          const isSmallText = params.row.type === 'SECTION';

          return (
            <Typography
              sx={{
                my: 1,
                ml: params.row.depth,
                fontWeight: isSmallText ? 'fontWeightMedium' : undefined,
              }}
              variant={isSmallText ? 'caption' : 'body2'}
            >
              {params.value}
            </Typography>
          );
        },
        // Stretch title rows to the full width of the table
        colSpan: (_: any, row: Row) => {
          if (row.type === 'SECTION') {
            return COLUMNS.length;
          }

          return undefined;
        },
      },
      {
        display: 'flex',
        headerName: 'Baseline',
        field: 'baselineValue',
        flex: 1,
        renderCell: (params: GridRenderCellParams<Row>) => {
          const value = params.value;
          const row = params.row;

          if (row.type === 'SECTION') {
            return null;
          }

          return (
            <Typography variant="body2">
              {formatNumericValue(value, row)}
            </Typography>
          );
        },

        renderHeader: () => (
          <Box sx={{ lineHeight: 1.5 }}>
            <Typography variant="body2" component="span">
              {baselineYear}
            </Typography>
            <Typography variant="caption" component="div">
              Baseline
            </Typography>
          </Box>
        ),
      },
      {
        headerName: 'Unit',
        field: 'unit',
        flex: 1,
        display: 'flex',
        valueFormatter: (value: UnitType, row: MeasureDataPoint) =>
          row.type === 'MEASURE' ? value.long : undefined,
        renderCell: (params: GridRenderCellParams<Row>) => {
          return (
            <Typography key={'unit'} sx={{ my: 1 }} variant={'caption'}>
              {getUnitName(params.value.long)}
            </Typography>
          );
        },
      },
      ...additionalYears.map(
        (year) =>
          ({
            headerName: year.toString(),
            field: year.toString(),
            flex: 1,
            type: 'number',
            headerAlign: 'left',
            editable: true,
            renderCell: (params: GridRenderCellParams<Row>) => {
              const placeholderValue = getPlaceholderValue(params.row, year);

              return (
                <CustomEditComponent
                  {...params}
                  sx={{ mx: 0, my: 1 }}
                  placeholderValue={placeholderValue}
                />
              );
            },
            renderEditCell: (params: GridRenderCellParams<Row>) => {
              const placeholderValue = getPlaceholderValue(params.row, year);

              return (
                <CustomEditComponent
                  {...params}
                  placeholderValue={placeholderValue}
                />
              );
            },
          }) as GridColDef
      ),
    ],
    [baselineYear, additionalYears]
  );

  return (
    <DataGrid
      {...(permissions.edit ? singleClickEditProps : {})}
      loading={loading}
      slots={{ footer: CustomFooter }}
      slotProps={{
        footer: { count: rows.filter((row) => row.type === 'MEASURE').length },
      }}
      sx={DATA_GRID_SX}
      isCellEditable={(params) =>
        !!(permissions.edit && params.colDef.editable)
      }
      getRowClassName={(params) => {
        if (params.row.type === 'SECTION') {
          const { depth } = params.row;
          return `row-title ${depth > 1 ? 'row-title--subtitle' : ''}`;
        }

        return '';
      }}
      getCellClassName={(params) =>
        rowsFailedToSave.find(
          (row) => row.uuid === params.row.id && row.year === params.field
        )
          ? 'cell-error'
          : ''
      }
      getRowHeight={() => 'auto'}
      getRowId={(row) => row.id}
      rows={rows}
      columns={COLUMNS}
      disableColumnSorting
      disableColumnFilter
      disableColumnMenu
      disableVirtualization
      processRowUpdate={processRowUpdate}
      onProcessRowUpdateError={handleProcessRowUpdateError}
    />
  );
}

export function AdditionalDatasheetEditor() {
  const plan = useSuspenseSelectedPlanConfig();
  const baselineYear = plan?.baselineYear ?? 0;
  const targetYear = plan?.targetYear ?? null;
  const [expanded, setExpanded] = useState<number | null>(0);

  const { data, loading, error } = useQuery<GetMeasureTemplatesQuery>(
    GET_MEASURE_TEMPLATES,
    {
      variables: { frameworkConfigId: plan?.id },
    }
  );

  const filteredData = useMemo(
    () =>
      filterMeasureTemplates(
        data,
        new Set(ADDITIONAL_MEASURES.map((measure) => measure.uuid))
      ),
    [data]
  );

  const rootSectionUuid = data?.framework?.dataCollection?.uuid;

  const measures = useMemo(
    () =>
      mapMeasureTemplatesToRows(
        {
          uuid: rootSectionUuid ?? '',
          descendants: filteredData ?? [],
        },
        baselineYear,
        targetYear
      ),
    [filteredData, rootSectionUuid, baselineYear, targetYear]
  );

  if (loading) {
    return <LoadingCard />;
  }

  if (error) {
    captureException(error, {
      extra: {
        location: 'AdditionalDatasheetEditor',
        error: JSON.stringify(serializeError(error), null, 2),
      },
    });

    return <ErrorComponent error={error} />;
  }

  return (
    <div>
      {measures.map((measure, index) => {
        return (
          <Accordion
            slotProps={{ transition: { unmountOnExit: true } }}
            key={measure.id}
            expanded={expanded === index}
            onChange={(_event, isExpanded) =>
              setExpanded(isExpanded ? index : null)
            }
          >
            <MuiAccordionSummary
              expandIcon={<ChevronDown size={18} />}
              aria-controls={`${measure.id}-content`}
              id={`${measure.id}-header`}
            >
              <Typography>{measure.name}</Typography>
            </MuiAccordionSummary>
            <AccordionDetails>
              <Box sx={{ height: 400 }}>
                <DatasheetSection
                  section={measure}
                  baselineYear={baselineYear}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}

export default AdditionalDatasheetEditor;
