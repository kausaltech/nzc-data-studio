'use client';

import { useState } from 'react';

import {
  AppBar as MuiAppBar,
  Button,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  SxProps,
  Theme,
  Toolbar,
  Typography,
} from '@mui/material';
import { Session } from 'next-auth';
import { signIn, signOut, useSession } from 'next-auth/react';
import { PersonCircle, QuestionCircle } from 'react-bootstrap-icons';

import { useUserProfile } from '@/hooks/use-user-profile';
import { getUserDisplay } from '@/utils/session';
import { Logo } from './Logo';
import SupportModal from './SupportModal';

const APP_BAR_STYLES: SxProps<Theme> = {
  backgroundColor: 'common.white',
  color: 'primary.dark',
  boxShadow: (theme) => theme.customShadows.z1,
};

function UserDisplay({ sessionData }: { sessionData: Session }) {
  const { data: profile, loading } = useUserProfile();

  const sessionUser = getUserDisplay(sessionData);

  if (sessionUser) {
    return sessionUser;
  }

  if (loading) {
    return (
      <Skeleton>
        <Typography variant="body2">Placeholder email</Typography>
      </Skeleton>
    );
  }

  if (profile?.me?.email) {
    return profile.me.email;
  }

  return null;
}

export function AppBar() {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const session = useSession();

  // TODO: use this when the backend supports a logout route to sign out of the admin ui
  // const signOut = useHandleSignOut();

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
    signIn('paths-oidc-provider', { callbackUrl: '/' });
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
          <Logo />

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
                endIcon={<PersonCircle size={18} />}
                aria-label={isAuthenticated ? 'Open user menu' : 'Sign in'}
              >
                {isAuthenticated ? (
                  <UserDisplay sessionData={session.data} />
                ) : (
                  'Sign in'
                )}
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
                  // <MenuItem key="sign-up" onClick={handleSignUp}>
                  //   Sign up
                  // </MenuItem>,
                  <MenuItem key="log-in" onClick={handleLogIn}>
                    Sign in
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
