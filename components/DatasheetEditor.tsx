'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  DataGrid,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridColDef,
  GridRenderEditCellParams,
  GridRowsProp,
  useGridApiContext,
} from '@mui/x-data-grid';
import {
  Typography,
  TextField,
  SxProps,
  Theme,
  Box,
  TextFieldProps,
} from '@mui/material';

import MOCK_MEASURES from '@/mocks/measures.json';
import NumberInput from './NumberInput';
import { NumberFormatValues } from 'react-number-format';

const DATA_GRID_SX: SxProps<Theme> = (theme) => ({
  '& .row-title': {
    backgroundColor: theme.palette.grey[400],
    '&:hover': {
      backgroundColor: theme.palette.grey[400],
    },
    '&.Mui-selected': {
      borderWidth: 0,
      backgroundColor: theme.palette.grey[400],
      '&:hover': {
        borderWidth: 0,
        backgroundColor: theme.palette.grey[400],
      },
    },

    '&.row-title--subtitle': {
      backgroundColor: theme.palette.grey[300],
      '&:hover': {
        backgroundColor: theme.palette.grey[300],
      },
      '&.Mui-selected': {
        borderWidth: 0,
        backgroundColor: theme.palette.grey[300],
        '&:hover': {
          borderWidth: 0,
          backgroundColor: theme.palette.grey[300],
        },
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
        onValueChange={handleNumberValueChange}
        value={value || ''}
      />
    );
  }

  return (
    <TextField
      {...commonProps}
      onChange={handleValueChange}
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
        variant="body2"
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
  },
  {
    display: 'flex',
    headerName: 'Fallback value',
    description:
      'Fallback values are utilized when no city-specific value is provided. Fallbacks are derived from comparable cities.',
    field: 'fallback',
    flex: 1,
  },
  {
    display: 'flex',
    headerName: 'Priority',
    field: 'priority',
    flex: 1,
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
      unit: string;
      fallback: number;
      priority: string;
      notes: string | null;
      depth: number;
    }
  | {
      isTitle: true;
      id: string;
      label: string;
      depth: number;
    };

function mapDataMeasuresToRows(
  measures: (typeof MOCK_MEASURES)['dataCollection']
): GridRowsProp {
  type InputItem = {
    label: string;
    unit?: string;
    value?: string;
    fallbackValue?: string;
    priority?: string;
    comment?: string;
    referenceType?: string;
    items?: InputItem[];
  };

  function parseValue(input: string | undefined): number | null {
    if (input === undefined) return null;
    const parsed = parseFloat(input.replace(/,/g, '').replace('%', ''));
    return isNaN(parsed) ? null : parsed;
  }

  function extractRows(
    items: InputItem[],
    parentId: string = '',
    depth = 0
  ): Row[] {
    let rows: Row[] = [];

    items.forEach((item, index) => {
      const id = `${parentId}${index}`;

      if (item.items) {
        // recursively extract rows from nested items
        rows = [
          ...rows,

          item.label && item.referenceType === 'SECTION'
            ? {
                isTitle: true,
                id: `${id}-SECTION`,
                label: item.label,
                depth,
              }
            : undefined,

          ...extractRows(item.items, `${id}-`, depth + 1),
        ].filter((row): row is Row => !!row);
      } else {
        rows.push({
          id,
          isTitle: false,
          label: item.label,
          value: parseValue(item.value),
          unit: item.unit || '',
          fallback: parseValue(item.fallbackValue) || 0,
          priority: item.priority || '',
          notes: item.comment || null,
          depth,
        });
      }
    });

    return rows;
  }

  // Extract rows from the input data
  return extractRows(measures.items);
}

export function DatasheetEditor() {
  const singleClickEditProps = useSingleClickEdit();
  const [rowData, setRowData] = useState<GridRowsProp>(() =>
    mapDataMeasuresToRows(MOCK_MEASURES.dataCollection)
  );

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGrid
        {...singleClickEditProps}
        sx={DATA_GRID_SX}
        getRowClassName={(params) =>
          params.row.isTitle
            ? `row-title ${params.row.depth > 0 ? 'row-title--subtitle' : ''}`
            : ''
        }
        getRowHeight={() => 'auto'}
        rows={rowData}
        columns={GRID_COL_DEFS}
        hideFooter
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
  );
}
