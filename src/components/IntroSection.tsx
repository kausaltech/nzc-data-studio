import * as React from 'react';
import { Card, Grid, Typography, Box } from '@mui/material';
import Image from 'next/image';

interface InfoItem {
  icon: string;
  title: string;
  text: string;
}

interface IntroSectionProps {
  title: string;
  items: InfoItem[];
}

const IntroSection: React.FC<IntroSectionProps> = ({ title, items }) => {
  return (
    <div>
      <Typography variant="h5" align="left" paragraph>
        {title}
      </Typography>
      <Box>
        <Grid container spacing={4} sx={{ justifyContent: 'flex-start' }}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card sx={{ p: 2, py: 4 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  <Image src={item.icon} alt="" width={180} height={180} />
                </Box>
                <Typography variant="subtitle2" gutterBottom align="center">
                  {item.title}
                </Typography>
                <Typography variant="body2" align="center">
                  {item.text}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default IntroSection;
