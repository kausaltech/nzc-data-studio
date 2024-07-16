import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'lg';
};

export function Logo({ variant = 'dark', size = 'sm' }: Props) {
  const image =
    variant === 'light'
      ? 'net-zero-cities-logo-light.png'
      : 'net-zero-cities-logo.png';
  const LOGO_HEIGHT = size === 'sm' ? 40 : 80;
  const logoAspectRatio = variant === 'light' ? 1 : 2;

  return (
    <Stack
      component={Link}
      href="/"
      direction="row"
      spacing={4}
      sx={{
        color: 'inherit',
        textDecoration: 'none',
        alignItems: 'center',
        flexGrow: 1,
      }}
    >
      <Image
        priority
        src={`/images/${image}`}
        alt="Net Zero Cities"
        height={LOGO_HEIGHT}
        width={LOGO_HEIGHT * logoAspectRatio}
      />

      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        NetZeroPaths
        <Typography variant="caption" sx={{ display: 'block' }}>
          Powered by Kausal Open Source
        </Typography>
      </Typography>
    </Stack>
  );
}
