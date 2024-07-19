import { GridValidRowModel } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { PRIORITY_TYPES, PriorityBadge } from './PriorityBadge';
import { measureTemplateHasValue } from '@/utils/measures';
import { MeasureRow } from './DatasheetEditor';

interface DataSectionSummaryProps {
  rows: GridValidRowModel;
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
          totalCount={
            rows.filter((row: GridValidRowModel) => row.priority === priority)
              .length
          }
          completedCount={
            rows.filter(
              (row: MeasureRow) =>
                row.priority === priority &&
                measureTemplateHasValue(row.originalMeasureTemplate)
            ).length
          }
        />
      ))}
    </Box>
  );
};
