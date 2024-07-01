import { useTheme } from '@mui/material/styles';
import { GridValidRowModel } from '@mui/x-data-grid';
import {
  Icon3CircleFill as LowPrioIcon,
  Icon2CircleFill as MedPrioIcon,
  Icon1CircleFill as HighPrioIcon,
} from 'react-bootstrap-icons';
import { Box, Typography } from '@mui/material';
const PRIORITY_TYPES = ['LOW', 'MODERATE', 'HIGH'];

interface PrioIconProps {
  priorityType: 'LOW' | 'MODERATE' | 'HIGH' | string;
}

const PrioIcon = (props: PrioIconProps) => {
  const { priorityType } = props;
  const theme = useTheme();
  switch (priorityType) {
    case 'LOW':
      return (
        <LowPrioIcon
          color={theme.palette.success.main}
          style={{ marginRight: theme.spacing(1), marginBottom: '-4px' }}
        />
      );
    case 'MODERATE':
      return (
        <MedPrioIcon
          color={theme.palette.warning.main}
          style={{ marginRight: theme.spacing(1), marginBottom: '-4px' }}
        />
      );
    case 'HIGH':
      return (
        <HighPrioIcon
          color={theme.palette.error.main}
          style={{ marginRight: theme.spacing(1), marginBottom: '-4px' }}
        />
      );
    default:
      null;
  }
};

interface PrioStatProps {
  priority: 'LOW' | 'MODERATE' | 'HIGH' | string;
  totalCount: number;
  completedCount: number;
}

const PrioStat = (props: PrioStatProps) => {
  const { priority, totalCount, completedCount } = props;
  return (
    <Box sx={{ marginRight: 1, flex: '60px 0 0' }}>
      {totalCount > 0 && (
        <>
          <PrioIcon priorityType={priority} />
          <Typography variant="caption">
            {completedCount}/{totalCount}
          </Typography>
        </>
      )}
    </Box>
  );
};

interface DataSectionSummaryProps {
  section: GridValidRowModel;
}

const DataSectionSummary = (props: DataSectionSummaryProps) => {
  const { section } = props;
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginRight: 1 }}>
      {PRIORITY_TYPES.map((prio) => (
        <PrioStat
          key={prio}
          priority={prio}
          totalCount={
            section.items.filter(
              (row: GridValidRowModel) => row.priority === prio
            ).length
          }
          completedCount={
            section.items.filter(
              (row: GridValidRowModel) => row.priority === prio && !!row.value
            ).length
          }
        />
      ))}
    </Box>
  );
};

export default DataSectionSummary;
