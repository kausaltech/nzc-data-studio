'use client';

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useMutation } from '@apollo/client';
import type { AccordionProps, SxProps, TextFieldProps, Theme } from '@mui/material';
import {
  Box,
  Fade,
  Grid,
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type {
  GridCellModesModel,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridRenderEditCellParams,
  GridRowClassNameParams,
  GridSlotsComponentsProps,
} from '@mui/x-data-grid';
import { DataGrid, GridCellModes, useGridApiContext } from '@mui/x-data-grid';
import { ChevronDown, ExclamationTriangle } from 'react-bootstrap-icons';
import type { NumberFormatValues } from 'react-number-format';

import { usePermissions } from '@/hooks/use-user-profile';
import { GET_MEASURE_TEMPLATE } from '@/queries/get-measure-template';
import { UPDATE_MEASURE_DATAPOINT } from '@/queries/update-measure-datapoint';
import { useDataCollectionStore } from '@/store/data-collection';
import type {
  FrameworksMeasureTemplatePriorityChoices,
  MeasureTemplateFragmentFragment,
  UpdateMeasureDataPointMutation,
  UpdateMeasureDataPointMutationVariables,
} from '@/types/__generated__/graphql';
import type { Section } from '@/utils/measures';
import {
  getDecimalPrecisionByUnit,
  getMeasureFallback,
  getMeasureValue,
  getUnitName,
  isYearMeasure,
  validateMinMax,
} from '@/utils/measures';

import { DataSectionSummary } from './DataSectionSummary';
import { HelpText } from './HelpText';
import type { NumberInputProps } from './NumberInput';
import NumberInput from './NumberInput';
import { PriorityBadge } from './PriorityBadge';
import { useSnackbar } from './SnackbarProvider';
import { useSuspenseSelectedPlanConfig } from './providers/SelectedPlanProvider';

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

export function filterSectionTree(section: Section): Section | null {
  const visibleChildren = (section.childSections || [])
    .map(filterSectionTree)
    .filter((s): s is Section => s !== null);

  const visibleMeasures = (section.measureTemplates || []).filter((m) => m.hidden !== true);

  if (visibleMeasures.length === 0 && visibleChildren.length === 0) {
    return null;
  }

  return {
    ...section,
    measureTemplates: visibleMeasures,
    childSections: visibleChildren,
  };
}

export function filterSections(sections: Section[]): Section[] {
  return sections.map(filterSectionTree).filter((s): s is Section => s !== null);
}

type UnitFragment = MeasureTemplateFragmentFragment['unit'];

export function formatNumericValue(
  value: number | null,
  row: { label: string; unit: UnitFragment }
): string {
  if (value == null) {
    return '-';
  }

  const precision = getDecimalPrecisionByUnit(row.unit.long);

  if (isYearMeasure(row.label, row.unit.short)) {
    return Math.round(value).toString();
  }

  return value.toLocaleString(undefined, {
    maximumFractionDigits: precision,
  });
}

type CustomEditComponentProps = GridRenderEditCellParams<MeasureRow | SectionRow> & {
  sx?: SxProps<Theme>;
  placeholder?: string;
} & (
    | {
        colDef: Omit<GridColDef<MeasureRow>, 'type'> & {
          type: 'number';
        };
      }
    | {
        colDef: Omit<GridColDef<SectionRow>, 'type'> & {
          type: 'string';
        };
      }
  );

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
  placeholder,
}: CustomEditComponentProps) {
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

  async function handleValueChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
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
    colDef.type === 'number' && row.type === 'MEASURE' ? (
      <NumberInput
        {...commonProps}
        key={key}
        autoComplete="off"
        fullWidth
        placeholder={placeholder || undefined}
        onKeyDown={handleEscape}
        onValueChange={
          permissions.edit ? (value) => void handleNumberValueChange(value) : undefined
        }
        defaultValue={typeof initialValue.current === 'number' ? initialValue.current : ''}
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
        onChange={permissions.edit ? (value) => void handleValueChange(value) : undefined}
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

  const handleCellClick = useCallback((params: GridCellParams, event: React.MouseEvent) => {
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
  }, []);

  const handleCellModesModelChange = useCallback((newModel: GridCellModesModel) => {
    setCellModesModel(newModel);
  }, []);

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
export function TotalPercentage({ total, overrideIsValid = false }: TotalPercentageProps) {
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

const EDITABLE_COL: Partial<GridColDef<DatasheetEditorRow>> = {
  editable: true,
  renderCell: (params) => {
    const { row, ...rest } = params;
    if (row.type === 'SUM_PERCENT') {
      if (params.field === 'notes') {
        return null;
      }

      return <TotalPercentage key={`${params.field}-${params.row.id}`} total={row.total} />;
    }

    return (
      // @ts-ignore
      <CustomEditComponent
        key={`${params.field}-${row.id}`}
        row={row}
        {...rest}
        sx={{ mx: 0, my: 1 }}
      />
    );
  },
  renderEditCell: (params: GridRenderEditCellParams<MeasureRow | SectionRow>) => (
    // @ts-ignore
    <CustomEditComponent key={`${params.field}-${params.id}`} {...params} />
  ),
};

function HeaderWithHelpText({ headerName, helpText }: { headerName: string; helpText: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 1 }}>
      <Typography
        component="span"
        variant="caption"
        sx={{ whiteSpace: 'normal', lineHeight: 'normal' }}
      >
        {headerName}
      </Typography>
      <HelpText size="sm" text={helpText} />
    </Stack>
  );
}

export function renderLabelCell(
  type: DatasheetEditorRow['type'],
  id: string,
  depth: number,
  helpText: string | null,
  value: string | number | null
) {
  const isSection = type === 'SECTION';
  const isSectionSummary = type === 'SUM_PERCENT';
  const isSmallText = isSection || isSectionSummary;
  const label = type === 'SUM_PERCENT' ? 'Total' : value;

  return (
    <Typography
      key={`label-${id}`}
      sx={{
        my: 1,
        ml: depth,
        fontWeight: isSmallText ? 'fontWeightMedium' : undefined,
        fontStyle: isSectionSummary ? 'italic' : undefined,
        color: isSectionSummary ? 'text.secondary' : undefined,
      }}
      variant={isSmallText ? 'caption' : 'body2'}
    >
      {label}
      {!!helpText && <HelpText text={helpText} size={isSmallText ? 'sm' : 'md'} />}
    </Typography>
  );
}

const GRID_COL_DEFS: GridColDef<DatasheetEditorRow>[] = [
  {
    display: 'flex',
    headerName: 'Label',
    field: 'label',
    flex: 2,
    renderCell: (params: GridRenderCellParams<DatasheetEditorRow>) =>
      renderLabelCell(
        params.row.type,
        params.row.id,
        params.row.depth,
        'helpText' in params.row ? params.row.helpText : null,
        params.value
      ),
    colSpan: (value, row: DatasheetEditorRow) => {
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
    valueFormatter: (value: UnitFragment, row: MeasureRow | SumPercentRow) =>
      row.type === 'MEASURE' ? value.long : undefined,
    renderCell: (params: GridRenderCellParams<DatasheetEditorRow>) => {
      if (params.row.type === 'SUM_PERCENT') {
        return null;
      }

      return (
        <Typography key={`unit-${params.row.id}`} sx={{ my: 1 }} variant={'caption'}>
          {getUnitName(params.value.long)}
        </Typography>
      );
    },
  },
  {
    display: 'flex',
    headerName: 'Comparable City Value',
    minWidth: 110,
    renderHeader: ({ colDef }) => (
      <HeaderWithHelpText headerName={colDef.headerName!} helpText={colDef.description!} />
    ),
    description:
      'Comparable City Values are developed based on the 3 questions you answered when you created your plan. 1) Population, 2) Climate 3) % Zero Carbon Electricity. The system averages the data for European cities that have similar Climate and % Zero Carbon Electricity and then adjusts for the exact population of your city. Comparable City Values can be used to validate your own data inputs. If you have no information for a given cell, you can leave that cell blank, and the system will default to the Comparable City Value.',
    field: 'fallback',
    flex: 1,
    renderCell: (params: GridRenderCellParams<DatasheetEditorRow>) => {
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
    minWidth: 90,
    renderHeader: ({ colDef }) => (
      <HeaderWithHelpText headerName={colDef.headerName!} helpText={colDef.description!} />
    ),
    description:
      'Priority shows how much impact the metric has on the outputs of the model. Given limited time, you should focus on filling in all High Priority inputs with the most accurate information possible.',
    renderCell: (params) =>
      !!params.value && (
        <PriorityBadge key={`priority-${params.row.id}`} variant="badge" priority={params.value} />
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
  unit: MeasureTemplateFragmentFragment['unit'];
  originalId: string;
  fallback: number | null;
  priority: FrameworksMeasureTemplatePriorityChoices;
  notes: string | null;
  depth: number;
  helpText: string | null;
  originalMeasureTemplate: MeasureTemplateFragmentFragment;
};

export type SectionRow = {
  type: 'SECTION';
  sumTo100: boolean;
  isTitle: boolean;
  id: string;
  label: string;
  depth: number;
  helpText: string | null;
};

type SumPercentRow = {
  type: 'SUM_PERCENT';
  total: number | null;
  fallbackTotal: number | null;
  id: string;
  depth: number;
};

export type DatasheetEditorRow = MeasureRow | SectionRow | SumPercentRow;

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

declare module '@mui/x-data-grid' {
  interface FooterPropsOverrides {
    count: number;
  }
}

function getSumPercentRow(
  { measureTemplates = [], ...section }: Section,
  depth: number,
  baselineYear: number | null
): SumPercentRow {
  return {
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
    fallbackTotal: measureTemplates.reduce((total: number | null, measure) => {
      const value = getMeasureFallback(measure, baselineYear);

      if (typeof value === 'number' || typeof total === 'number') {
        return (total ?? 0) + (value ?? 0);
      }

      return null;
    }, null),
    id: `${section.id}_sum`,
  } as SumPercentRow;
}

export function CustomFooter({ count }: NonNullable<GridSlotsComponentsProps['footer']>) {
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
): DatasheetEditorRow[] {
  const sectionRow: SectionRow = {
    type: 'SECTION',
    sumTo100: section.maxTotal === 100,
    isTitle: true,
    label: section.name,
    helpText: section.helpText,
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
        helpText: measure.helpText,
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
      ? [getSumPercentRow({ measureTemplates, childSections, ...section }, depth + 1, baselineYear)]
      : []),
    ...childSections.flatMap((section) =>
      getRowsFromSection(section, depth + 1, false, baselineYear)
    ),
  ];
}

export function getRowClassName(type: DatasheetEditorRow['type'], depth: number) {
  if (type === 'SECTION') {
    return `row-title ${depth > 1 ? 'row-title--subtitle' : ''}`;
  }

  if (type === 'SUM_PERCENT') {
    return 'row-summary';
  }

  return '';
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
  const plan = useSuspenseSelectedPlanConfig();

  const baselineYear = plan?.baselineYear;
  const selectedPlanId = plan?.id;

  const [updateMeasureDataPoint, { loading }] = useMutation<
    UpdateMeasureDataPointMutation,
    UpdateMeasureDataPointMutationVariables
  >(UPDATE_MEASURE_DATAPOINT);

  const singleClickEditProps = useSingleClickEdit();
  const setExpanded = useDataCollectionStore((store) => store.setAccordion);
  const permissions = usePermissions();

  const handleChange = (panel: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : null);
  };

  const rows = useMemo(
    () => getRowsFromSection(section, 0, true, baselineYear),
    [section, baselineYear]
  );

  const measureCount = useMemo(() => {
    return rows.filter((row) => row.type === 'MEASURE').length;
  }, [rows]);

  const processRowUpdate = useCallback(
    async (
      updatedRow: DatasheetEditorRow,
      originalRow: DatasheetEditorRow
    ): Promise<DatasheetEditorRow> => {
      if (updatedRow.type !== 'MEASURE' || originalRow.type !== 'MEASURE') {
        return originalRow;
      }

      const haveNotesChanged = updatedRow.notes !== originalRow.notes;

      if (updatedRow.value === originalRow.value && !haveNotesChanged) {
        return originalRow;
      }

      if (!selectedPlanId) {
        throw new Error('No plan selected');
      }

      /** TODO: Validation will be migrated to the backend, pending task in Asana */
      const { valid, error } = validateMinMax(updatedRow.value, updatedRow.originalMeasureTemplate);

      if (!valid) {
        setRowsFailedToSave((rows) => [...new Set([...rows, updatedRow.id])]);
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
                  frameworkConfigId: selectedPlanId,
                },
              },
            ];
          },
        });

        if (rowsFailedToSave.includes(updatedRow.id)) {
          setRowsFailedToSave((rows) => [...rows.filter((row) => row !== updatedRow.id)]);
        }
      } catch (error) {
        setRowsFailedToSave((rows) => [...new Set([...rows, updatedRow.id])]);

        // Rethrow the error to be caught by onProcessRowUpdateError and prevent exiting edit mode
        throw error;
      }

      return updatedRow;
    },
    [rowsFailedToSave, selectedPlanId, updateMeasureDataPoint, setNotification]
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
        <Grid container sx={{ flexGrow: 1 }}>
          <Grid size={{ xs: 6 }}>
            <Typography component="span">
              {withIndexes && `${index + 1}.`} {section.name}
            </Typography>
            {!!section.helpText && <HelpText text={section.helpText} size="sm" />}
          </Grid>
          <Grid size="grow">
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
            slotProps={{ footer: { count: measureCount } }}
            sx={DATA_GRID_SX}
            isCellEditable={(params: GridCellParams<DatasheetEditorRow>) =>
              !!(permissions.edit && params.colDef.editable && params.row.type !== 'SUM_PERCENT')
            }
            getRowClassName={(params: GridRowClassNameParams<DatasheetEditorRow>) =>
              getRowClassName(params.row.type, params.row.depth)
            }
            getCellClassName={(params: GridCellParams<DatasheetEditorRow>) =>
              params.field === 'value' && rowsFailedToSave.includes(params.row.id)
                ? 'cell-error'
                : ''
            }
            getRowHeight={() => 'auto'}
            getRowId={(row: DatasheetEditorRow) => row.id}
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
  const visibleSections = useMemo(() => filterSections(sections), [sections]);
  const expanded = useDataCollectionStore((store) => store.getSelectedAccordion());

  return (
    <div>
      {visibleSections.map((section, i) => (
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
