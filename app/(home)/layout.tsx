import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { InstanceControlBar } from '@/components/InstanceControlBar';

type Props = {
  children: ReactNode;
};

export default async function HomeLayout({ children }: Props) {
  return (
    <>
      <Box sx={{ mt: -4 }}>
        <InstanceControlBar />
      </Box>
      <Box sx={{ mt: 4 }}>{children}</Box>
    </>
  );
}
