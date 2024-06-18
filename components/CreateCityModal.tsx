'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Container,
  TextField,
  Grid,
  Typography,
  Button,
  Stack,
  Autocomplete,
  Box,
} from '@mui/material';
import { Modal } from './Modal';
import { ArrowLeft } from 'react-bootstrap-icons';

// Mock data
const cities = [
  { label: 'Paris', value: 'paris' },
  { label: 'Berlin', value: 'berlin' },
  { label: 'Madrid', value: 'madrid' },
  { label: 'Rome', value: 'rome' },
];

export function CreateCityModal() {
  const [city, setCity] = useState<{ label: string; value: string } | null>(
    null
  );
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardLink, setDashboardLink] = useState('');
  const [open, setOpen] = useState(false);

  // Mock data
  const headerImage = '/images/net-zero-cities-logo.png';
  const headerImageAlt = 'Net Zero Cities';
  const headerTitle = 'NetZeroPaths';
  const headerSubtitle = 'Powered by Kausal Open Source';
  const userEmail = 'owen.wilson@coventry.gov.uk';

  const handleCityChange = (
    event: React.SyntheticEvent,
    value: { label: string; value: string } | null
  ) => {
    setCity(value);
  };

  const handleDashboardNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDashboardName(event.target.value);
  };

  const handleDashboardLinkChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDashboardLink(event.target.value);
  };

  const isFormValid =
    city !== null && dashboardName !== '' && dashboardLink !== '';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle the data
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create your city"
      headerImage={headerImage}
      headerImageAlt={headerImageAlt}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      <Container component="main" maxWidth="xs" disableGutters>
        <Stack
          sx={{
            alignItems: 'flex-start',
          }}
          spacing={2}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
            <ArrowLeft style={{ marginRight: '0.5em' }} />
            <Typography variant="body1">{userEmail}</Typography>
          </Box>
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  options={cities}
                  getOptionLabel={(option) => option.label}
                  value={city}
                  onChange={handleCityChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City or Region"
                      required
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="dashboardName"
                  label="Dashboard Name"
                  name="dashboardName"
                  value={dashboardName}
                  onChange={handleDashboardNameChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="dashboardLink"
                  label="Dashboard Link"
                  name="dashboardLink"
                  value={dashboardLink}
                  onChange={handleDashboardLinkChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Your dashboard hosted for free by Kausal
                </Typography>
              </Grid>
            </Grid>
            <Stack
              direction="row"
              justifyContent="flex-end"
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
          </form>
        </Stack>
      </Container>
    </Modal>
  );
}
