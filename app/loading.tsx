import { Container, Skeleton, Stack } from '@mui/material';

export default function Loading() {
  return (
    <Container>
      <Stack spacing={4}>
        <Skeleton variant="rounded" height={150} />
        <Skeleton variant="rounded" height={400} />
      </Stack>
    </Container>
  );
}
