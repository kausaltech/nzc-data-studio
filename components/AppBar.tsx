'use client';

import {
  AppBar as MuiAppBar,
  Stack,
  SxProps,
  Theme,
  Toolbar,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const APP_BAR_STYLES: SxProps<Theme> = {
  backgroundColor: 'common.white',
  color: 'primary.dark',
  boxShadow: (theme) => theme.customShadows.z1,
};

export function AppBar() {
  return (
    <MuiAppBar position="sticky" sx={APP_BAR_STYLES}>
      <Toolbar>
        <Stack
          component={Link}
          href="/"
          direction="row"
          spacing={4}
          alignItems="center"
          sx={{ color: 'inherit', textDecoration: 'none' }}
        >
          <Image
            src="/images/net-zero-cities-logo.png"
            alt="Net Zero Cities"
            width={80}
            height={40}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NetZeroPaths
            <Typography variant="caption" sx={{ display: 'block' }}>
              Powered by Kausal Open Source
            </Typography>
          </Typography>
        </Stack>
      </Toolbar>
    </MuiAppBar>
  );
}
