import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ExclamationTriangle } from 'react-bootstrap-icons';

interface ErrorComponentProps {
  message: string;
  isBoundaryError?: boolean;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  message,
  isBoundaryError = false,
}) => {
  const boxStyles = isBoundaryError
    ? {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh',
        backgroundColor: 'common.white',
      }
    : {};

  const cardStyles = {
    backgroundColor: 'background.dark',
    color: 'primary.contrastText',
    ...(isBoundaryError && { width: '60%' }),
  };

  const contentStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    justifyContent: 'center',
    ...(isBoundaryError && { flexDirection: 'column', textAlign: 'center' }),
  };

  const typographyVariant = isBoundaryError ? 'h5' : 'h6';

  return (
    <Box sx={boxStyles}>
      <Card sx={cardStyles}>
        <CardContent sx={contentStyles}>
          <ExclamationTriangle size={50} color="red" />
          <Typography variant={typographyVariant} gutterBottom>
            {message}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ErrorComponent;
