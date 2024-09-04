'use client';

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
import {
  Typography,
  TextField,
  SxProps,
  Theme,
  Box,
  TextFieldProps,
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Grid,
  AccordionProps,
} from '@mui/material';

import NumberInput from './NumberInput';
import { NumberFormatValues } from 'react-number-format';
import { DataSectionSummary } from './DataSectionSummary';
import { useDataCollectionStore } from '@/store/data-collection';
import {
  getDecimalPrecisionByUnit,
  getMeasureValue,
  getUnitName,
  Section,
} from '@/utils/measures';
import {
  MeasureTemplateFragmentFragment,
  UnitType,
  UpdateMeasureDataPointMutation,
  UpdateMeasureDataPointMutationVariables,
} from '@/types/__generated__/graphql';
import { PriorityBadge } from './PriorityBadge';
import { UPDATE_MEASURE_DATAPOINT } from '@/queries/update-measure-datapoint';
import { useMutation } from '@apollo/client';
import { ChevronDown } from 'react-bootstrap-icons';
import { GET_MEASURE_TEMPLATE } from '@/queries/get-measure-template';
import { useFrameworkInstanceStore } from '@/store/selected-framework-instance';
import useStore from '@/store/use-store';

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

// Override styles colors of title sections
const DATA_GRID_SX: SxProps<Theme> = (theme) => ({
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
});

/**
 * Since the sheet editor only has a few cells available to edit,
 * we display an input field for these at all times rather for clear
 * interactivity. This component allows us to keep consistent input
 * styles when the cell is in edit or read mode.
 */
function CustomEditComponent({
  id,
  value,
  field,
  hasFocus,
  sx = [],
  colDef,
  row,
}: GridRenderEditCellParams & { sx?: SxProps<Theme> }) {
  const apiRef = useGridApiContext();
  const ref = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    if (hasFocus && ref.current) {
      ref.current.focus();
    }
  }, [hasFocus]);

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  function handleNumberValueChange(value: NumberFormatValues) {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: value.floatValue ?? '',
    });
  }

  const commonProps: Pick<TextFieldProps, 'sx' | 'inputRef' | 'size'> = {
    sx: [{ m: 1 }, ...(Array.isArray(sx) ? sx : [sx])],
    inputRef: ref,
    size: 'small',
  };

  if (colDef.type === 'number') {
    return (
      <NumberInput
        {...commonProps}
        fullWidth
        onValueChange={handleNumberValueChange}
        value={typeof value === 'number' ? value : ''}
        inputProps={{
          'aria-label': `${row.label} ${field}`,
          decimalScale: getDecimalPrecisionByUnit(row.unit.long),
        }}
      />
    );
  }

  return (
    <TextField
      {...commonProps}
      onChange={handleValueChange}
      fullWidth
      value={value || ''}
      inputProps={{
        style: { fontSize: '0.9em' },
        'aria-label': `${row.label} ${field}`,
      }}
    />
  );
}

/**
 * Support editable cells with a single click, rather than the MUI default of double clicking
 */
function useSingleClickEdit() {
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

const EDITABLE_COL: Partial<GridColDef> = {
  editable: true,
  renderCell: (params) => (
    <CustomEditComponent {...params} sx={{ mx: 0, my: 1 }} />
  ),
  renderEditCell: (params: GridRenderEditCellParams) => (
    <CustomEditComponent {...params} />
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

      return (
        <Typography
          sx={{
            my: 1,
            ml: params.row.depth,
            fontWeight: isSection ? 'fontWeightMedium' : undefined,
          }}
          variant={isSection ? 'caption' : 'body2'}
        >
          {params.value}
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
    editable: true,
    type: 'number',
    headerAlign: 'left',
    flex: 1,
    ...EDITABLE_COL,
  },
  {
    display: 'flex',
    headerName: 'Unit',
    field: 'unit',
    flex: 1,
    valueFormatter: (value: UnitType) => value.long,
    renderCell: (params: GridRenderCellParams<Row>) => (
      <Typography sx={{ my: 1 }} variant={'caption'}>
        {getUnitName(params.value.long)}
      </Typography>
    ),
  },
  {
    display: 'flex',
    headerName: 'Fallback value',
    description:
      'Fallback values are utilized when no city-specific value is provided. Fallbacks are derived from comparable cities.',
    field: 'fallback',
    flex: 1,
    valueFormatter: (value: number, row: MeasureRow) => {
      const precision = getDecimalPrecisionByUnit(row.unit.long);

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
        <PriorityBadge variant="badge" priority={params.value} />
      ),
  },
  {
    display: 'flex',
    headerName: 'Internal notes',
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
  fallback: number;
  priority: string;
  notes: string | null;
  depth: number;
  originalMeasureTemplate: MeasureTemplateFragmentFragment;
};

type SectionRow = {
  type: 'SECTION';
  isTitle: boolean;
  id: string;
  label: string;
  depth: number;
};

type Row = MeasureRow | SectionRow;

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
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
        fallback: measure.defaultDataPoints[0]?.value ?? null,
        priority: measure.priority,
        notes: measure.measure?.internalNotes ?? null,
        depth: depth + 1,
        originalMeasureTemplate: measure,
      })
    ),
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

  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : null);
    };

  const rows = useMemo(
    () => getRowsFromSection(section, 0, true, baselineYear),
    [section, baselineYear]
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
            {...singleClickEditProps}
            loading={loading}
            slots={{ footer: CustomFooter }}
            slotProps={{ footer: { count: rows.length } }}
            sx={DATA_GRID_SX}
            getRowClassName={(params) =>
              params.row.type === 'SECTION'
                ? `row-title ${
                    params.row.depth > 1 ? 'row-title--subtitle' : ''
                  }`
                : ''
            }
            getRowHeight={() => 'auto'}
            rows={rows}
            columns={GRID_COL_DEFS}
            disableColumnSorting
            disableColumnFilter
            disableColumnMenu
            disableVirtualization
            processRowUpdate={async (updatedRow: Row, originalRow: Row) => {
              if (
                updatedRow.type === 'SECTION' ||
                originalRow.type === 'SECTION'
              ) {
                return originalRow;
              }

              const haveNotesChanged = updatedRow.notes !== originalRow.notes;

              if (updatedRow.value === originalRow.value && !haveNotesChanged) {
                return originalRow;
              }

              try {
                if (!selectedInstanceId) {
                  throw new Error('No plan selected');
                }

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
              } catch (error) {
                console.log('Mutation error', JSON.stringify(error, null, 2));
                // TODO: Handle error
              }

              return updatedRow;
            }}
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
