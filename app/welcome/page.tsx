'use client';
import React from 'react';
import { Container, Stack } from '@mui/material';
import WelcomeSection from '../../components/WelcomeSection';
import IntroSection from '../../components/IntroSection';
import {
  benefitsTitle,
  benefits,
  servicesTitle,
  services,
} from '@/constants/intro-content';

const Welcome: React.FC = () => {
  return (
    <Container maxWidth={false}>
      <Stack
        spacing={4}
        sx={{ width: '100%', maxWidth: 'lg', margin: 'auto', padding: 0 }}
      >
        <WelcomeSection />
        <IntroSection title={benefitsTitle} items={benefits} />
        <IntroSection title={servicesTitle} items={services} />
      </Stack>
    </Container>
  );
};

export default Welcome;
