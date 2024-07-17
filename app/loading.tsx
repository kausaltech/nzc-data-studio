import { Container, Skeleton, Stack } from '@mui/material';

export function LoadingCard() {
  return <Skeleton variant="rounded" height={400} />;
}

export default function Loading() {
  return (
    <Container>
      <Stack spacing={4}>
        <Skeleton variant="rounded" height={150} />
        <LoadingCard />
      </Stack>
    </Container>
  );
}
