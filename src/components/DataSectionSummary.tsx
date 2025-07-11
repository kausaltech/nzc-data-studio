import { Box } from '@mui/material';
import type { GridValidRowModel } from '@mui/x-data-grid';

import { measureTemplateHasValue } from '@/utils/measures';

import type { DatasheetEditorRow, MeasureRow } from './DatasheetEditor';
import { PRIORITY_TYPES, PriorityBadge } from './PriorityBadge';

interface DataSectionSummaryProps {
  rows: DatasheetEditorRow[];
}

export const DataSectionSummary = ({ rows }: DataSectionSummaryProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: 1,
        height: '100%',
      }}
    >
      {PRIORITY_TYPES.map((priority) => (
        <PriorityBadge
          key={priority}
          variant="count"
          priority={priority}
          totalCount={rows.filter((row: GridValidRowModel) => row.priority === priority).length}
          completedCount={
            rows.filter(
              (row: MeasureRow) =>
                row.priority === priority && measureTemplateHasValue(row.originalMeasureTemplate)
            ).length
          }
        />
      ))}
    </Box>
  );
};
