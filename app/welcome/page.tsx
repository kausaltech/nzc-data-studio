import { Container, Typography } from '@mui/material';

export default async function Dashboard() {
  return (
    <Container>
      <Typography variant="h1">Welcome to NetZeroPaths</Typography>
      <Typography variant="subtitle1">
        Unauthenticated homepage route
      </Typography>
    </Container>
  );
}
