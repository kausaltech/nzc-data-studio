'use client';

import { useCallback, useMemo, useState } from 'react';

import { useMutation, useSuspenseQuery } from '@apollo/client';
import { Box, AccordionSummary as MuiAccordionSummary, Typography } from '@mui/material';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { captureException } from '@sentry/nextjs';
import { ChevronDown } from 'react-bootstrap-icons';
import { serializeError } from 'serialize-error';

import { default as ErrorComponent } from '@/app/error';
import { usePermissions } from '@/hooks/use-user-profile';
import { GET_MEASURE_TEMPLATE } from '@/queries/get-measure-template';
import { GET_MEASURE_TEMPLATES } from '@/queries/get-measure-templates';
import { UPDATE_MEASURE_DATAPOINT } from '@/queries/update-measure-datapoint';
import type {
  GetMeasureTemplatesQuery,
  MeasureTemplateFragmentFragment,
  UpdateMeasureDataPointMutation,
  UpdateMeasureDataPointMutationVariables,
} from '@/types/__generated__/graphql';
import type { Section } from '@/utils/measures';
import {
  getMeasureValue,
  getUnitName,
  mapMeasureTemplatesToRows,
  validateMinMax,
} from '@/utils/measures';

import CustomEditComponent, {
  Accordion,
  AccordionDetails,
  DATA_GRID_SX,
  type MeasureRow,
  type SectionRow,
  TotalPercentage,
  filterSections,
  formatNumericValue,
  getRowClassName,
  renderLabelCell,
  useSingleClickEdit,
} from './DatasheetEditor';
import { CustomFooter } from './DatasheetEditor';
import { HelpText } from './HelpText';
import { useSnackbar } from './SnackbarProvider';
import { usePlans, useSuspenseSelectedPlanConfig } from './providers/SelectedPlanProvider';

interface MeasureDataPoint extends Omit<MeasureRow, 'fallback' | 'priority' | 'notes' | 'value'> {
  baselineValue: number | null;
  placeholderDataPoints: Record<number, null | number>;
  [year: number]: null | number;
}

export type SumPercentRow = {
  type: 'SUM_PERCENT';
  totals: Record<number, number | null>;
  id: string;
  depth: number;
};

type Row = MeasureDataPoint | SectionRow | SumPercentRow;

const currentYear = new Date().getFullYear();

function getPlaceholder(row: Row, year: number) {
  if (row.type === 'MEASURE' && typeof row.placeholderDataPoints[year] === 'number') {
    return formatNumericValue(row.placeholderDataPoints[year], row);
  }

  return undefined;
}

function isSectionRow(row: Row): row is SectionRow {
  return row.type === 'SECTION';
}

function isMeasureRow(row: Row): row is MeasureDataPoint {
  return row.type === 'MEASURE';
}

function isSumPercentRow(row: Row): row is SumPercentRow {
  return row.type === 'SUM_PERCENT';
}

function getSumPercentRow(
  { measureTemplates = [], ...section }: Section,
  depth: number
): SumPercentRow {
  type Totals = { [year: number]: number | null };
  return {
    type: 'SUM_PERCENT',
    depth: depth + 1,
    totals: measureTemplates.reduce((totals: Totals, measureTemplate) => {
      const dataPoints = measureTemplate.measure?.dataPoints;

      if (!dataPoints) {
        return totals;
      }

      return dataPoints.reduce((acc, dataPoint) => {
        if (typeof dataPoint.year !== 'number' || dataPoint.value === null) {
          return acc;
        }

        return {
          ...acc,
          [dataPoint.year]: (acc[dataPoint.year] ?? 0) + (dataPoint.value ?? 0),
        };
      }, totals);
    }, {} as Totals),
    id: `${section.id}_sum`,
  } as SumPercentRow;
}

function getRowsFromSection(
  { childSections = [], measureTemplates = [], ...section }: Section,
  depth = 0,
  isRoot: boolean = false,
  baselineYear: number | null = null
): Row[] {
  const sectionRow: SectionRow = {
    type: 'SECTION',
    sumTo100: section.maxTotal === 100 && measureTemplates.length > 1,
    isTitle: true,
    label: section.name,
    helpText: section.helpText,
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
        helpText: measure.helpText,
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
    ...(sectionRow.sumTo100
      ? [getSumPercentRow({ measureTemplates, childSections, ...section }, depth + 1)]
      : []),
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
    data.framework.dataCollection?.descendants.map((section) => [section.uuid, section])
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
        section.measureTemplates.some((template) => allowedMeasureTemplateUuids.has(template.uuid))
      ) {
        return [section.uuid, ...getAncestorUuids(section?.parent ?? undefined)];
      }

      return undefined;
    })
    .flat()
    .filter(Boolean);

  const allowedSectionUuidsSet = new Set(allowedSectionUuids?.map((uuid) => uuid) ?? []);

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
  const [rowsFailedToSave, setRowsFailedToSave] = useState<{ year: string; uuid: string }[]>([]);
  const { setNotification } = useSnackbar();
  const singleClickEditProps = useSingleClickEdit();
  const permissions = usePermissions();
  const { selectedPlanId } = usePlans();

  const additionalYears = useMemo(
    () => Array.from({ length: currentYear - baselineYear - 1 }, (_, i) => baselineYear + 1 + i),
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
        (key) => isValidYear(key) && updatedRow[key as keyof Row] !== originalRow[key as keyof Row]
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

        /** TODO: Validation will be migrated to the backend, pending task in Asana */
        const { valid, error } = validateMinMax(newValue, updatedRow.originalMeasureTemplate);

        if (!valid) {
          setRowsFailedToSave((rows) => [...rows, { uuid: updatedRow.id, year: changedYearField }]);
          setNotification({
            message: 'Failed to save',
            extraDetails: error,
            severity: 'error',
          });

          return updatedRow;
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
            setRowsFailedToSave((rows) => [...rows.filter((row) => row.uuid !== updatedRow.id)]);
          }
        } catch (error) {
          setRowsFailedToSave((rows) => [...rows, { uuid: updatedRow.id, year: changedYearField }]);

          // Rethrow the error to be caught by onProcessRowUpdateError and prevent exiting edit mode
          throw error;
        }

        return updatedRow;
      }
      return updatedRow;
    },
    [updateMeasureDataPoint, selectedPlanId, rowsFailedToSave]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        display: 'flex',
        headerName: 'Label',
        field: 'label',
        flex: 2,
        renderCell: (params: GridRenderCellParams<Row>) =>
          renderLabelCell(
            params.row.type,
            params.row.id,
            params.row.depth,
            'helpText' in params.row ? params.row.helpText : null,
            params.value
          ),
        // Stretch title rows to the full width of the table
        colSpan: (_: any, row: Row) => {
          if (row.type === 'SECTION') {
            return columns.length;
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

          if (row.type !== 'MEASURE') {
            return null;
          }

          return <Typography variant="body2">{formatNumericValue(value, row)}</Typography>;
        },

        renderHeader: () => (
          <Box sx={{ lineHeight: 1.5 }}>
            <Typography variant="body2" component="span">
              {baselineYear}
            </Typography>
            <Typography variant="caption" component="div">
              Baseline
              <HelpText
                size="sm"
                text={
                  <>
                    The baseline year represents the starting point for measuring your city's
                    emissions. This year provides a reference for tracking progress over time and
                    should ideally be a recent year for which accurate data is available.
                  </>
                }
              />
            </Typography>
          </Box>
        ),
      },
      {
        headerName: 'Unit',
        field: 'unit',
        flex: 1,
        display: 'flex',
        valueFormatter: (value: MeasureTemplateFragmentFragment['unit'], row: MeasureDataPoint) =>
          row.type === 'MEASURE' ? value.long : undefined,
        renderCell: (params: GridRenderCellParams<Row>) => {
          if (params.row.type !== 'MEASURE') {
            return null;
          }

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
            display: 'flex',
            headerName: year.toString(),
            field: year.toString(),
            flex: 1,
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            editable: true,
            renderCell: (params: GridRenderCellParams<Row>) => {
              const { row, ...rest } = params;
              if (isSectionRow(row)) {
                return null;
              }

              if (isSumPercentRow(row)) {
                if (row.totals[year] == null) {
                  return null;
                }

                return (
                  <TotalPercentage
                    key={`${params.field}-${params.row.id}`}
                    total={row.totals[year]}
                  />
                );
              }

              return (
                <CustomEditComponent
                  // @ts-ignore
                  row={row}
                  {...rest}
                  sx={{ mx: 0, my: 1 }}
                  placeholder={getPlaceholder(params.row, year)}
                />
              );
            },
            renderEditCell: (params: GridRenderCellParams<Row>) => {
              if (params.row.type !== 'MEASURE') {
                return null;
              }

              return (
                // @ts-ignore
                <CustomEditComponent {...params} placeholder={getPlaceholder(params.row, year)} />
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
        !!(permissions.edit && params.colDef.editable && params.row.type !== 'SUM_PERCENT')
      }
      getRowClassName={({ row }) => getRowClassName(row.type, row.depth)}
      getCellClassName={(params) =>
        rowsFailedToSave.find((row) => row.uuid === params.row.id && row.year === params.field)
          ? 'cell-error'
          : ''
      }
      getRowHeight={() => 'auto'}
      getRowId={(row) => row.id}
      rows={rows}
      columns={columns}
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

  const { data, error } = useSuspenseQuery<GetMeasureTemplatesQuery>(GET_MEASURE_TEMPLATES, {
    variables: { frameworkConfigId: plan?.id, includePlaceholders: true },
  });
  const filteredData = useMemo(
    () =>
      filterMeasureTemplates(
        data,
        new Set(
          data?.framework?.dataCollection?.descendants
            .flatMap((section) => section.measureTemplates)
            .filter((measure) => measure.includeInProgressTracker)
            .map((measure) => measure.uuid)
        )
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

  const visibleMeasures = useMemo(() => filterSections(measures), [measures]);

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
      {visibleMeasures.map((section, index) => {
        return (
          <Accordion
            slotProps={{ transition: { unmountOnExit: true } }}
            key={section.id}
            expanded={expanded === index}
            onChange={(_event, isExpanded) => setExpanded(isExpanded ? index : null)}
          >
            <MuiAccordionSummary
              expandIcon={<ChevronDown size={18} />}
              aria-controls={`${section.id}-content`}
              id={`${section.id}-header`}
            >
              <Typography component="span">{section.name}</Typography>
              {!!section.helpText && <HelpText text={section.helpText} size="sm" />}
            </MuiAccordionSummary>
            <AccordionDetails>
              <Box sx={{ height: 400 }}>
                <DatasheetSection section={section} baselineYear={baselineYear} />
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}

export default AdditionalDatasheetEditor;
