'use client';

import React from 'react';
import { Container, Stack } from '@mui/material';
import WelcomeSection from '../../components/WelcomeSection';
import IntroSection from '../../components/IntroSection';
import { benefits } from '@/constants/intro-content';

const Welcome: React.FC = () => {
  return (
    <Container maxWidth={false}>
      <Stack
        spacing={6}
        sx={{
          width: '100%',
          maxWidth: 'lg',
          margin: 'auto',
          padding: 0,
          mt: [0, 0, 2],
        }}
      >
        <WelcomeSection />
        <IntroSection
          title="How NetZeroPlanner guides your city's decarbonisation journey"
          items={benefits}
        />
      </Stack>
    </Container>
  );
};

export default Welcome;
