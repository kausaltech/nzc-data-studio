'use client';

import {
  Button,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  Stack,
  SxProps,
  Theme,
  Toolbar,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { PersonCircle, QuestionCircle } from 'react-bootstrap-icons';
import SupportModal from './SupportModal';

import { getUserDisplay } from '@/utils/session';

const APP_BAR_STYLES: SxProps<Theme> = {
  backgroundColor: 'common.white',
  color: 'primary.dark',
  boxShadow: (theme) => theme.customShadows.z1,
};

export function AppBar() {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const session = useSession();

  const isAuthenticated = session.status === 'authenticated';

  const handleOpenAuthMenu = (event: React.MouseEvent<HTMLElement>) =>
    setMenuAnchorEl(event.currentTarget);

  const handleCloseAuthMenu = () => setMenuAnchorEl(null);

  const handleSignUp = () => {
    alert('Coming soon!');
    handleCloseAuthMenu();
  };

  const handleLogIn = () => {
    handleCloseAuthMenu();
    signIn(undefined, { callbackUrl: '/' });
  };

  const handleSignOut = () => {
    handleCloseAuthMenu();
    signOut();
  };

  const handleOpenSupportModal = () => {
    setSupportModalOpen(true);
  };

  const handleCloseSupportModal = () => {
    setSupportModalOpen(false);
  };

  return (
    <>
      <MuiAppBar position="sticky" sx={APP_BAR_STYLES}>
        <Toolbar>
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

          <div>
            <Stack direction="row" spacing={2}>
              <Button
                size="small"
                variant="text"
                color="inherit"
                onClick={handleOpenSupportModal}
                endIcon={<QuestionCircle size={18} />}
              >
                Support
              </Button>
              <Button
                size="small"
                variant="text"
                aria-controls="appbar-auth-menu"
                aria-haspopup="true"
                onClick={handleOpenAuthMenu}
                color="inherit"
                endIcon={<PersonCircle size={22} />}
              >
                {isAuthenticated
                  ? getUserDisplay(session.data)
                  : 'Create Your City Plan'}
              </Button>
            </Stack>
            <Menu
              id="appbar-auth-menu"
              anchorEl={menuAnchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={!!menuAnchorEl}
              onClose={handleCloseAuthMenu}
            >
              {!isAuthenticated ? (
                [
                  <MenuItem key="sign-up" onClick={handleSignUp}>
                    Sign up
                  </MenuItem>,
                  <MenuItem key="log-in" onClick={handleLogIn}>
                    Log in
                  </MenuItem>,
                ]
              ) : (
                <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
              )}
            </Menu>
          </div>
        </Toolbar>
      </MuiAppBar>
      <SupportModal open={supportModalOpen} onClose={handleCloseSupportModal} />
    </>
  );
}
