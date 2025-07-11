'use client';

import { Container, Skeleton, Stack, Box } from '@mui/material';
import { useSession } from 'next-auth/react';

export function LoadingCard() {
  return <Skeleton variant="rounded" height={400} />;
}

export default function Loading() {
  const { status } = useSession();

  return (
    <Box sx={{ mt: -4 }}>
      {status === 'authenticated' && (
        <Skeleton variant="rectangular" width="100%" height={64} />
      )}

      <Container sx={{ mt: 4 }}>
        <Stack spacing={4}>
          <Skeleton variant="rounded" height={150} />
          <LoadingCard />
        </Stack>
      </Container>
    </Box>
  );
}
