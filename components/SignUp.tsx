'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Container,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Button,
  Stack,
} from '@mui/material';
import { Modal } from './Modal';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [open, setOpen] = useState(true); // Set to true while developing

  // Mock data
  const headerImage = '/images/net-zero-cities-logo.png';
  const headerImageAlt = 'Net Zero Cities';
  const headerTitle = 'NetZeroPaths';
  const headerSubtitle = 'Powered by Kausal Open Source';

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordError('');
    }
  };

  const isFormValid =
    email !== '' &&
    password !== '' &&
    isChecked &&
    emailError === '' &&
    passwordError === '';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    //handle the form data
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create Account"
      headerImage={headerImage}
      headerImageAlt={headerImageAlt}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      <Container component="main" maxWidth="xs" disableGutters>
        <CssBaseline />
        <Stack
          sx={{
            alignItems: 'flex-start',
          }}
          spacing={2}
        >
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  error={emailError !== ''}
                  helperText={emailError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={handlePasswordChange}
                  error={passwordError !== ''}
                  helperText={passwordError}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label={
                    <span>
                      I agree to the{' '}
                      <Link href="#" variant="body2">
                        Terms of Service
                      </Link>
                    </span>
                  }
                />
              </Grid>
            </Grid>
            <Stack
              direction="row"
              justifyContent="center"
              sx={{ mt: 3, mb: 2 }}
            >
              <Button
                size="large"
                type="submit"
                variant="contained"
                disabled={!isFormValid}
              >
                Next
              </Button>
            </Stack>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </Stack>
      </Container>
    </Modal>
  );
}
