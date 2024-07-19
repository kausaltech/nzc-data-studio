import { FrameworksMeasureTemplatePriorityChoices as Priority } from '@/types/__generated__/graphql';
import { Stack, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Icon3CircleFill as LowPriorityIcon,
  Icon2CircleFill as MedPriorityIcon,
  Icon1CircleFill as HighPriorityIcon,
} from 'react-bootstrap-icons';

export const PRIORITY_TYPES = [Priority.High, Priority.Medium, Priority.Low];

interface PriorityIconProps {
  priorityType: Priority;
}

export const PriorityIcon = ({ priorityType }: PriorityIconProps) => {
  const theme = useTheme();

  switch (priorityType) {
    case Priority.Low:
      return <LowPriorityIcon color={theme.palette.success.main} />;
    case Priority.Medium:
      return <MedPriorityIcon color={theme.palette.warning.main} />;
    case Priority.High:
      return <HighPriorityIcon color={theme.palette.error.main} />;
    default:
      null;
  }
};

interface BadgePriorityBadgeProps {
  variant: 'badge';
  priority: Priority;
  totalCount?: never;
  completedCount?: never;
}

interface CountPriorityBadgeProps {
  variant: 'count';
  priority: Priority;
  totalCount: number;
  completedCount: number;
}

type PriorityBadgeProps = BadgePriorityBadgeProps | CountPriorityBadgeProps;

function getLabel(priority: Priority) {
  switch (priority) {
    case Priority.Low:
      return 'Low';
    case Priority.Medium:
      return 'Moderate';
    case Priority.High:
      return 'High';
    default:
      return 'Unknown';
  }
}

export function PriorityBadge({
  variant = 'count',
  priority,
  ...rest
}: PriorityBadgeProps) {
  if (variant === 'badge') {
    return (
      <Stack spacing={1} direction="row" alignItems="center">
        <PriorityIcon priorityType={priority} />
        <Typography component="span" variant="caption">
          {getLabel(priority)}
        </Typography>
      </Stack>
    );
  }

  if (variant === 'count') {
    const { totalCount, completedCount } = rest;

    return (
      <Tooltip
        title={`${completedCount}/${totalCount} ${getLabel(
          priority
        )} priority data points provided`}
      >
        <Stack
          sx={{ marginRight: 1, flex: '60px 0 0' }}
          direction="row"
          alignItems="center"
          spacing={1}
        >
          {typeof totalCount === 'number' && totalCount > 0 && (
            <>
              <PriorityIcon priorityType={priority} />
              <Typography variant="caption">
                {completedCount}/{totalCount}
              </Typography>
            </>
          )}
        </Stack>
      </Tooltip>
    );
  }
}
