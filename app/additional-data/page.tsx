'use client';
import { Container, Typography, Button, Stack, Box } from '@mui/material';
import { QuestionCircle } from 'react-bootstrap-icons';

export default function AdditionalDataPage() {
  const handleButtonClick = () => {
    console.log('The Modal!');
  };

  return (
    <Container>
      <Stack direction="row" alignItems="baseline" spacing={1}>
        <Typography variant="h3">Additional Historical Data</Typography>
        <Typography color="textSecondary">(Optional)</Typography>
      </Stack>
      <Box display="flex" alignItems="flex-start" mt={1}>
        <Typography>Plan baseline: 2019</Typography>
        <Button
          size="small"
          variant="text"
          color="inherit"
          endIcon={<QuestionCircle size={14} />}
          onClick={handleButtonClick}
          sx={{ minWidth: 'auto', padding: 0 }}
        />
      </Box>
    </Container>
  );
}
