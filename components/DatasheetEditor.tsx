'use client';

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useMutation } from '@apollo/client';
import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionProps,
  AccordionSummary as MuiAccordionSummary,
  Box,
  Fade,
  Grid,
  Stack,
  SxProps,
  TextField,
  TextFieldProps,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  DataGrid,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridRenderEditCellParams,
  GridSlotsComponentsProps,
  useGridApiContext,
} from '@mui/x-data-grid';
import { ChevronDown, ExclamationTriangle } from 'react-bootstrap-icons';
import { NumberFormatValues } from 'react-number-format';

import { SECTIONS_SUM_100_PERCENT } from '@/constants/measure-overrides';
import { GET_MEASURE_TEMPLATE } from '@/queries/get-measure-template';
import { UPDATE_MEASURE_DATAPOINT } from '@/queries/update-measure-datapoint';
import { useDataCollectionStore } from '@/store/data-collection';
import { useFrameworkInstanceStore } from '@/store/selected-framework-instance';
import useStore from '@/store/use-store';
import {
  MeasureTemplateFragmentFragment,
  UnitType,
  UpdateMeasureDataPointMutation,
  UpdateMeasureDataPointMutationVariables,
} from '@/types/__generated__/graphql';
import {
  getDecimalPrecisionByUnit,
  getMeasureFallback,
  getMeasureValue,
  getUnitName,
  isYearMeasure,
  Section,
} from '@/utils/measures';
import { DataSectionSummary } from './DataSectionSummary';
import NumberInput, { NumberInputProps } from './NumberInput';
import { PriorityBadge } from './PriorityBadge';
import { useSnackbar } from './SnackbarProvider';
import { usePermissions } from '@/hooks/use-user-profile';

export const Accordion = styled((props: AccordionProps) => (
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

const rowTitleSx: SxProps<Theme> = (theme) => ({
  backgroundColor: theme.palette.brand[100],
  '.MuiDataGrid-cell': {
    border: '0px solid transparent',
  },
});

const rowSubtitleSx: SxProps<Theme> = (theme) => ({
  backgroundColor: theme.palette.brand[50],
  '.MuiDataGrid-cell': {
    border: '0px solid transparent',
  },
});

const rowSummarySx: SxProps<Theme> = (theme) => ({
  backgroundColor: theme.palette.grey[100],

  '.MuiDataGrid-cell': {
    border: '0px solid transparent',
    borderTop: (theme) => `1px solid ${theme.palette.grey[300]}`,
    borderBottom: (theme) => `1px solid ${theme.palette.grey[300]}`,
  },
});

// Override styles colors of title sections
export const DATA_GRID_SX: SxProps<Theme> = (theme) => ({
  '& .MuiDataGrid-columnHeaderTitle': {
    fontSize: theme.typography.caption.fontSize,
    whiteSpace: 'normal',
    lineHeight: 'normal',
    py: 1,
  },
  '& .MuiDataGrid-columnHeader': {
    // Forced to use important since overriding inline styles
    height: 'unset !important',
  },
  '& .MuiDataGrid-columnHeaders': {
    // Forced to use important since overriding inline styles
    maxHeight: '168px !important',
  },
  '& .row-title': {
    ...rowTitleSx(theme),
    '&:hover': rowTitleSx(theme),
    '&.Mui-selected': {
      ...rowTitleSx(theme),
      '&:hover': rowTitleSx(theme),
    },

    '&.row-title--subtitle': {
      ...rowSubtitleSx(theme),
      '&:hover': rowSubtitleSx(theme),
      '&.Mui-selected': {
        ...rowSubtitleSx(theme),
        '&:hover': rowSubtitleSx(theme),
      },
    },
  },

  '& .row-summary': {
    ...rowSummarySx(theme),
    '&:hover': rowSummarySx(theme),
    '&.Mui-selected': {
      ...rowSummarySx(theme),
      '&:hover': rowSummarySx(theme),
    },
  },

  '& .cell-error': {
    '.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.error.main,
      borderWidth: 2,
    },
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.error.main,
      borderWidth: 2,
    },
  },
});

/**
 * Since the sheet editor only has a few cells available to edit,
 * we display an input field for these at all times rather for clear
 * interactivity. This component allows us to keep consistent input
 * styles when the cell is in edit or read mode.
 */
export default function CustomEditComponent({
  id,
  value,
  field,
  hasFocus,
  sx = [],
  colDef,
  row,
}: GridRenderEditCellParams & { sx?: SxProps<Theme> }) {
  const permissions = usePermissions();
  const apiRef = useGridApiContext();
  const ref = useRef<HTMLInputElement | null>(null);
  const initialValue = useRef(value);
  const [key, setKey] = useState(0);

  useLayoutEffect(() => {
    if (hasFocus && permissions.edit && ref.current) {
      ref.current.focus();
    }
  }, [hasFocus, permissions.edit]);

  async function handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value;

    await apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue,
      debounceMs: 400,
    });
  }

  async function handleNumberValueChange(value: NumberFormatValues) {
    await apiRef.current.setEditCellValue({
      id,
      field,
      value: value.floatValue ?? '',
      debounceMs: 400,
    });
  }

  const commonProps: Pick<TextFieldProps, 'sx' | 'inputRef' | 'size'> = {
    sx: [{ m: 1 }, ...(Array.isArray(sx) ? sx : [sx])],
    inputRef: ref,
    size: 'small',
  };

  const yearInputProps = {
    thousandSeparator: false,
    maxLength: 4,
    allowNegative: false,
  };

  /**
   * We use uncontrolled inputs, so increment the key to reset
   * the input field value when the user presses escape.
   */
  const handleEscape: NumberInputProps['onKeyDown'] = (event) => {
    if (event.key === 'Escape') {
      setKey((prevKey) => prevKey + 1);
    }
  };

  const inputComponent =
    colDef.type === 'number' ? (
      <NumberInput
        {...commonProps}
        key={key}
        autoComplete="off"
        fullWidth
        onKeyDown={handleEscape}
        onValueChange={permissions.edit ? handleNumberValueChange : undefined}
        defaultValue={
          typeof initialValue.current === 'number' ? initialValue.current : ''
        }
        disabled={!permissions.edit}
        inputProps={{
          'aria-label': `${row.label} ${field}`,
          decimalScale: getDecimalPrecisionByUnit(row.unit.long),
          ...(isYearMeasure(row.label, row.unit.long) ? yearInputProps : {}),
        }}
      />
    ) : (
      <TextField
        {...commonProps}
        key={key}
        autoComplete="off"
        disabled={!permissions.edit}
        onKeyDown={handleEscape}
        onChange={permissions.edit ? handleValueChange : undefined}
        fullWidth
        multiline
        maxRows={6}
        defaultValue={initialValue.current || ''}
        inputProps={{
          style: { fontSize: '0.9em' },
          'aria-label': `${row.label} ${field}`,
        }}
      />
    );

  if (!permissions.edit) {
    return (
      <Tooltip
        arrow
        placement="top"
        title="Request edit access in the NetZeroCities Portal to make changes."
      >
        <div>{inputComponent}</div>
      </Tooltip>
    );
  }

  return inputComponent;
}

/**
 * Support editable cells with a single click, rather than the MUI default of double clicking
 */
export function useSingleClickEdit() {
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});

  const handleCellClick = useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (!params.isEditable) {
        return;
      }

      // Ignore portal
      if (
        (event.target as any).nodeType === 1 &&
        !event.currentTarget.contains(event.target as Element)
      ) {
        return;
      }

      setCellModesModel((prevModel) => {
        return {
          // Revert the mode of the other cells from other rows
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id]).reduce(
                (acc2, field) => ({
                  ...acc2,
                  [field]: { mode: GridCellModes.View },
                }),
                {}
              ),
            }),
            {}
          ),
          [params.id]: {
            // Revert the mode of other cells in the same row
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({
                ...acc,
                [field]: { mode: GridCellModes.View },
              }),
              {}
            ),
            [params.field]: { mode: GridCellModes.Edit },
          },
        };
      });
    },
    []
  );

  const handleCellModesModelChange = useCallback(
    (newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    },
    []
  );

  return {
    cellModesModel,
    onCellModesModelChange: handleCellModesModelChange,
    onCellClick: handleCellClick,
  };
}

function formatTotal(total: number | null) {
  return typeof total === 'number' ? `${total}%` : null;
}

type TotalPercentageProps = {
  total: number | null;
  overrideIsValid?: boolean;
};

/**
 * For sections whose measures should sum to 100%, show the total percentage.
 * If no measure values have been provided, i.e. the total is null, hide the total.
 * If the total does not equal 100%, show a warning.
 */
function TotalPercentage({
  total,
  overrideIsValid = false,
}: TotalPercentageProps) {
  if (typeof total !== 'number') {
    return null;
  }

  const isValid = total === 100 || overrideIsValid;

  const percentageLabel = (
    <Typography
      component="span"
      sx={{
        fontStyle: 'italic',
        color: isValid ? 'text.secondary' : 'inherit',
      }}
      variant="body2"
    >
      {formatTotal(total)}
    </Typography>
  );

  if (!isValid) {
    return (
      <Tooltip
        placement="top"
        arrow
        title={
          <Typography variant="body2">
            The total of percentages in this section should equal 100%
          </Typography>
        }
      >
        <Fade in>
          <Stack
            color="warning.dark"
            bgcolor="warning.light"
            direction="row"
            spacing={1}
            alignItems="center"
            borderRadius={1}
            px={1}
            py={0.25}
            sx={{ cursor: 'default' }}
          >
            <ExclamationTriangle size={18} />
            {percentageLabel}
          </Stack>
        </Fade>
      </Tooltip>
    );
  }

  return <Fade in>{percentageLabel}</Fade>;
}

const EDITABLE_COL: Partial<GridColDef> = {
  editable: true,
  renderCell: (params: GridRenderCellParams<Row>) => {
    if (params.row.type === 'SUM_PERCENT') {
      if (params.field === 'notes') {
        return null;
      }

      return (
        <TotalPercentage
          key={`${params.field}-${params.row.id}`}
          total={params.row.total}
        />
      );
    }

    return (
      <CustomEditComponent
        key={`${params.field}-${params.row.id}`}
        {...params}
        sx={{ mx: 0, my: 1 }}
      />
    );
  },
  renderEditCell: (params: GridRenderCellParams<Row>) => (
    <CustomEditComponent key={`${params.field}-${params.id}`} {...params} />
  ),
};

const GRID_COL_DEFS: GridColDef[] = [
  {
    display: 'flex',
    headerName: 'Label',
    field: 'label',
    flex: 2,
    renderCell: (params: GridRenderCellParams<Row>) => {
      const isSection = params.row.type === 'SECTION';
      const isSectionSummary = params.row.type === 'SUM_PERCENT';
      const isSmallText = isSection || isSectionSummary;
      const label = params.row.type === 'SUM_PERCENT' ? 'Total' : params.value;

      return (
        <Typography
          key={`label-${params.row.id}`}
          sx={{
            my: 1,
            ml: params.row.depth,
            fontWeight: isSmallText ? 'fontWeightMedium' : undefined,
            fontStyle: isSectionSummary ? 'italic' : undefined,
            color: isSectionSummary ? 'text.secondary' : undefined,
          }}
          variant={isSmallText ? 'caption' : 'body2'}
        >
          {label}
        </Typography>
      );
    },
    // Stretch title rows to the full width of the table
    colSpan: (value, row: Row) => {
      if (row.type === 'SECTION') {
        return GRID_COL_DEFS.length;
      }

      return undefined;
    },
  },
  {
    display: 'flex',
    headerName: 'Value',
    field: 'value',
    type: 'number',
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    ...EDITABLE_COL,
  },
  {
    display: 'flex',
    headerName: 'Unit',
    field: 'unit',
    flex: 1,
    valueFormatter: (value: UnitType, row: MeasureRow | SumPercentRow) =>
      row.type === 'MEASURE' ? value.long : undefined,
    renderCell: (params: GridRenderCellParams<Row>) => {
      if (params.row.type === 'SUM_PERCENT') {
        return null;
      }
      return (
        <Typography
          key={`unit-${params.row.id}`}
          sx={{ my: 1 }}
          variant={'caption'}
        >
          {getUnitName(params.value.long)}
        </Typography>
      );
    },
  },
  {
    display: 'flex',
    headerName: 'Comparable City Value',
    description:
      'Comparable City Values are utilized when no city-specific value is provided. Fallbacks are derived from comparable cities.',
    field: 'fallback',
    flex: 1,
    renderCell: (params: GridRenderCellParams<Row>) => {
      if (params.row.type === 'SUM_PERCENT') {
        return (
          <TotalPercentage
            key={`fallback-${params.row.id}`}
            overrideIsValid
            total={
              typeof params.row.fallbackTotal === 'number'
                ? Math.round(params.row.fallbackTotal)
                : null
            }
          />
        );
      }

      return params.formattedValue;
    },
    valueFormatter: (value: number, row: MeasureRow | SumPercentRow) => {
      if (row.type === 'SUM_PERCENT' || value == null) {
        return undefined;
      }

      const precision = getDecimalPrecisionByUnit(row.unit.long);

      if (isYearMeasure(row.label, row.unit.long)) {
        return Math.round(value);
      }

      return typeof value === 'number'
        ? value.toLocaleString(undefined, { maximumFractionDigits: precision })
        : '';
    },
  },
  {
    display: 'flex',
    headerName: 'Priority',
    field: 'priority',
    flex: 1,
    renderCell: (params) =>
      !!params.value && (
        <PriorityBadge
          key={`priority-${params.row.id}`}
          variant="badge"
          priority={params.value}
        />
      ),
  },
  {
    display: 'flex',
    headerName: 'Internal Notes',
    field: 'notes',
    type: 'string',
    flex: 2,
    ...EDITABLE_COL,
  },
];

export type MeasureRow = {
  type: 'MEASURE';
  id: string;
  isTitle: false;
  label: string;
  value: number | null;
  unit: UnitType;
  originalId: string;
  fallback: number | null;
  priority: string;
  notes: string | null;
  depth: number;
  originalMeasureTemplate: MeasureTemplateFragmentFragment;
};

type SectionRow = {
  type: 'SECTION';
  sumTo100: boolean;
  isTitle: boolean;
  id: string;
  label: string;
  depth: number;
};

type SumPercentRow = {
  type: 'SUM_PERCENT';
  total: number | null;
  fallbackTotal: number | null;
  id: string;
  depth: number;
};

type Row = MeasureRow | SectionRow | SumPercentRow;

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

declare module '@mui/x-data-grid' {
  interface FooterPropsOverrides {
    count: number;
  }
}

export function CustomFooter({
  count,
}: NonNullable<GridSlotsComponentsProps['footer']>) {
  return (
    <Box
      sx={(theme) => ({
        borderTop: `1px solid ${theme.palette.divider}`,
        p: 1.5,
      })}
    >
      <Typography variant="body2" color="text.secondary">
        Total rows: {count}
      </Typography>
    </Box>
  );
}

function getRowsFromSection(
  { childSections = [], measureTemplates = [], ...section }: Section,
  depth = 0,
  isRoot: boolean = false,
  baselineYear: number | null = null
): Row[] {
  const sectionRow: SectionRow = {
    type: 'SECTION',
    sumTo100: SECTIONS_SUM_100_PERCENT.includes(section.id),
    isTitle: true,
    label: section.name,
    id: section.id,
    depth,
  };

  return [
    ...(isRoot ? [] : [sectionRow]),
    ...measureTemplates.flatMap(
      (measure): MeasureRow => ({
        isTitle: false,
        type: 'MEASURE',
        id: measure.uuid,
        originalId: measure.id,
        label: measure.name,
        value: getMeasureValue(measure, baselineYear),
        unit: measure.unit,
        fallback: getMeasureFallback(measure, baselineYear),
        priority: measure.priority,
        notes: measure.measure?.internalNotes ?? null,
        depth: depth + 1,
        originalMeasureTemplate: measure,
      })
    ),
    ...(sectionRow.sumTo100
      ? [
          {
            type: 'SUM_PERCENT',
            depth: depth + 1,
            total: measureTemplates.reduce((total: number | null, measure) => {
              const value = getMeasureValue(measure, baselineYear);

              if (typeof value === 'number' || typeof total === 'number') {
                return (total ?? 0) + (value ?? 0);
              }

              return null;
            }, null),
            // TODO: This could be combined with the above total reduce function
            fallbackTotal: measureTemplates.reduce(
              (total: number | null, measure) => {
                const value = getMeasureFallback(measure, baselineYear);

                if (typeof value === 'number' || typeof total === 'number') {
                  return (total ?? 0) + (value ?? 0);
                }

                return null;
              },
              null
            ),
            id: `${section.id}_sum`,
          } as SumPercentRow,
        ]
      : []),
    ...childSections.flatMap((section) =>
      getRowsFromSection(section, depth + 1, false, baselineYear)
    ),
  ];
}

type AccordionContentWrapperProps = {
  isExpanded: boolean;
  section: Section;
  index: number;
  withIndexes?: boolean;
};

function AccordionContentWrapper({
  isExpanded,
  section,
  index,
  withIndexes = false,
}: AccordionContentWrapperProps) {
  const [rowsFailedToSave, setRowsFailedToSave] = useState<string[]>([]); // UUIDs of rows that failed to save
  const { setNotification } = useSnackbar();
  const { data: baselineYear } = useStore(
    useFrameworkInstanceStore,
    (state) => state.baselineYear
  );
  const { data: selectedInstanceId } = useStore(
    useFrameworkInstanceStore,
    (state) => state.selectedInstance
  );

  const [updateMeasureDataPoint, { loading }] = useMutation<
    UpdateMeasureDataPointMutation,
    UpdateMeasureDataPointMutationVariables
  >(UPDATE_MEASURE_DATAPOINT);

  const singleClickEditProps = useSingleClickEdit();
  const setExpanded = useDataCollectionStore((store) => store.setAccordion);
  const permissions = usePermissions();

  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : null);
    };

  const rows = useMemo(
    () => getRowsFromSection(section, 0, true, baselineYear),
    [section, baselineYear]
  );

  const processRowUpdate = useCallback(
    async (updatedRow: Row, originalRow: Row): Promise<Row> => {
      if (updatedRow.type !== 'MEASURE' || originalRow.type !== 'MEASURE') {
        return originalRow;
      }

      const haveNotesChanged = updatedRow.notes !== originalRow.notes;

      if (updatedRow.value === originalRow.value && !haveNotesChanged) {
        return originalRow;
      }

      if (!selectedInstanceId) {
        throw new Error('No plan selected');
      }

      try {
        await updateMeasureDataPoint({
          variables: {
            frameworkInstanceId: selectedInstanceId,
            measureTemplateId: updatedRow.originalId,
            value: updatedRow.value,
            internalNotes: updatedRow.notes,
          },
          refetchQueries() {
            /**
             * Refetch the measure template to ensure the cache is up to date:
             * - If a measure data point is deleted
             * - If a measure data point is added
             * - If a note is changed (notes are not returned in the mutation)
             */
            return [
              {
                query: GET_MEASURE_TEMPLATE,
                variables: {
                  id: updatedRow.originalId,
                  frameworkConfigId: selectedInstanceId,
                },
              },
            ];
          },
        });

        if (rowsFailedToSave.includes(updatedRow.id)) {
          setRowsFailedToSave((rows) => [
            ...rows.filter((row) => row !== updatedRow.id),
          ]);
        }
      } catch (error) {
        setRowsFailedToSave((rows) => [...new Set([...rows, updatedRow.id])]);

        // Rethrow the error to be caught by onProcessRowUpdateError and prevent exiting edit mode
        throw error;
      }

      return updatedRow;
    },
    [rowsFailedToSave, selectedInstanceId, updateMeasureDataPoint]
  );

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

  return (
    <Accordion
      slotProps={{ transition: { unmountOnExit: true } }}
      expanded={isExpanded}
      onChange={handleChange(index)}
      key={section.id}
    >
      <MuiAccordionSummary
        expandIcon={<ChevronDown size={18} />}
        aria-controls="panel2-content"
        id="panel2-header"
      >
        <Grid container>
          <Grid xs={6}>
            {withIndexes && `${index + 1}.`} {section.name}
          </Grid>
          <Grid xs>
            <DataSectionSummary rows={rows} />
          </Grid>
        </Grid>
      </MuiAccordionSummary>
      <AccordionDetails>
        <Box sx={{ height: 400 }}>
          <DataGrid
            {...(permissions.edit ? singleClickEditProps : {})}
            loading={loading}
            slots={{ footer: CustomFooter }}
            slotProps={{ footer: { count: rows.length } }}
            sx={DATA_GRID_SX}
            isCellEditable={(params) =>
              !!(
                permissions.edit &&
                params.colDef.editable &&
                params.row.type !== 'SUM_PERCENT'
              )
            }
            getRowClassName={(params) => {
              if (params.row.type === 'SECTION') {
                const { depth } = params.row;
                return `row-title ${depth > 1 ? 'row-title--subtitle' : ''}`;
              }

              if (params.row.type === 'SUM_PERCENT') {
                return 'row-summary';
              }

              return '';
            }}
            getCellClassName={(params) =>
              params.field === 'value' &&
              rowsFailedToSave.includes(params.row.id)
                ? 'cell-error'
                : ''
            }
            getRowHeight={() => 'auto'}
            getRowId={(row) => row.id}
            rows={rows}
            columns={GRID_COL_DEFS}
            disableColumnSorting
            disableColumnFilter
            disableColumnMenu
            disableVirtualization
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

type Props = {
  sections: Section[];
  withIndexes?: boolean;
};

export function DatasheetEditor({ sections, withIndexes = false }: Props) {
  const expanded = useDataCollectionStore((store) =>
    store.getSelectedAccordion()
  );

  return (
    <div>
      {sections.map((section, i) => (
        <AccordionContentWrapper
          key={section.id}
          withIndexes={withIndexes}
          isExpanded={expanded === i}
          index={i}
          section={section}
        />
      ))}
    </div>
  );
}
