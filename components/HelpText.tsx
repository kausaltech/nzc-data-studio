import { Tooltip, Typography, Box } from '@mui/material';
import { ReactNode } from 'react';
import { QuestionCircle } from 'react-bootstrap-icons';

type Props = {
  text: NonNullable<ReactNode>;
  size?: 'sm' | 'md';
};

export function HelpText({ text, size = 'md' }: Props) {
  return (
    <Tooltip
      placement="top"
      arrow
      title={<Typography variant="body2">{text}</Typography>}
    >
      <Box
        sx={{
          mx: 1,
          cursor: 'pointer',
          display: 'inline-block',
          verticalAlign: 'middle',
        }}
      >
        <QuestionCircle size={size === 'sm' ? 14 : 16} />
      </Box>
    </Tooltip>
  );
}
