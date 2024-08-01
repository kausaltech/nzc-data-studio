import * as React from 'react';
import { Card, Grid, Typography, Box } from '@mui/material';

interface InfoItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  text: string;
}

interface InfoSectionProps {
  title: string;
  items: InfoItem[];
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, items }) => {
  return (
    <Card sx={{ margin: '24 0', padding: 4 }}>
      <Typography variant="h5" align="left" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ marginTop: 2 }}>
        <Grid container spacing={4} sx={{ justifyContent: 'flex-start' }}>
          {items.map((item, index) => (
            <Grid item xs={12} md={2} key={index}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: 'grey.200',
                  padding: 2,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 2,
                  }}
                >
                  <item.icon width={40} height={40} />
                </Box>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ fontWeight: 'bold' }}
                >
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
    </Card>
  );
};

export default InfoSection;
