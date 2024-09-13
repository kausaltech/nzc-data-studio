import { FrameworksMeasureTemplatePriorityChoices as Priority } from '@/types/__generated__/graphql';
import { Stack, Tooltip, Typography } from '@mui/material';
import {
  Icon3CircleFill as LowPriorityIcon,
  Icon2CircleFill as MedPriorityIcon,
  Icon1CircleFill as HighPriorityIcon,
  IconProps,
} from 'react-bootstrap-icons';

export const PRIORITY_TYPES = [Priority.High, Priority.Medium, Priority.Low];

interface PriorityIconProps extends IconProps {
  priorityType: Priority;
}

export const PriorityIcon = ({ priorityType, ...rest }: PriorityIconProps) => {
  // TODO: Move these colours to the theme
  switch (priorityType) {
    case Priority.Low:
      return <LowPriorityIcon color={'#48cae4'} {...rest} />;
    case Priority.Medium:
      return <MedPriorityIcon color={'#00b4d8'} {...rest} />;
    case Priority.High:
      return <HighPriorityIcon color={'#0077b6'} {...rest} />;
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

export function getPriorityLabel(priority: Priority) {
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
          {getPriorityLabel(priority)}
        </Typography>
      </Stack>
    );
  }

  if (variant === 'count') {
    const { totalCount, completedCount } = rest;

    return (
      <Tooltip
        title={`${completedCount}/${totalCount} ${getPriorityLabel(
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
