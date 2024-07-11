'use client';

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  DataGrid,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridColDef,
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
import { Section } from '@/utils/measures';
import { UnitType } from '@/types/__generated__/graphql';
import { PriorityBadge } from './PriorityBadge';

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
    apiRef.current.setEditCellValue({ id, field, value: value.floatValue });
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
        value={value || ''}
      />
    );
  }

  return (
    <TextField
      {...commonProps}
      onChange={handleValueChange}
      fullWidth
      value={value || ''}
      inputProps={{ style: { fontSize: '0.9em' } }}
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
    renderCell: (params) => (
      <Typography
        sx={{
          my: 1,
          ml: params.row.depth,
          fontWeight: params.row.isTitle ? 'fontWeightMedium' : undefined,
        }}
        variant={params.row.isTitle ? 'caption' : 'body2'}
      >
        {params.value}
      </Typography>
    ),
    // Stretch title rows to the full width of the table
    colSpan: (value, row) => {
      if (row.isTitle) {
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
    renderCell: (params) => (
      <Typography sx={{ my: 1 }} variant={'caption'}>
        {params.value.long}
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
    valueFormatter: (value?: number) =>
      typeof value === 'number' ? value.toLocaleString() : '',
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

type Row =
  | {
      id: string;
      isTitle: false;
      label: string;
      value: number | null;
      unit: UnitType;
      fallback: number;
      priority: string;
      notes: string | null;
      depth: number;
    }
  | {
      isTitle: boolean;
      id: string;
      label: string;
      depth: number;
    };

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
  isRoot: boolean = false
): Row[] {
  return [
    ...(isRoot
      ? []
      : [
          {
            isTitle: true,
            label: section.name,
            id: section.id,
            depth,
          },
        ]),
    ...measureTemplates.flatMap((measure) => ({
      isTitle: false,
      id: measure.uuid,
      label: measure.name,
      value: null, // TODO
      unit: measure.unit,
      fallback: measure.defaultDataPoints[0]?.value ?? null,
      priority: measure.priority,
      notes: null,
      depth: depth + 1,
    })),
    ...childSections.flatMap((section) =>
      getRowsFromSection(section, depth + 1)
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
  const singleClickEditProps = useSingleClickEdit();
  const setExpanded = useDataCollectionStore((store) => store.setAccordion);

  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : null);
    };

  const rows = useMemo(() => getRowsFromSection(section, 0, true), [section]);

  return (
    <Accordion
      slotProps={{ transition: { unmountOnExit: true } }}
      expanded={isExpanded}
      onChange={handleChange(index)}
      key={section.id}
    >
      <MuiAccordionSummary aria-controls="panel2-content" id="panel2-header">
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
            slots={{ footer: CustomFooter }}
            slotProps={{ footer: { count: rows.length } }}
            sx={DATA_GRID_SX}
            getRowClassName={(params) =>
              params.row.isTitle
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
            processRowUpdate={(updatedRow, originalRow) => {
              console.log('PERSIST ROW CHANGE', updatedRow, originalRow);

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
