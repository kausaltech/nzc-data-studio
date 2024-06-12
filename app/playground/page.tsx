import * as React from 'react';
import { Metadata } from 'next';
import {
  Container,
  Grid,
  Stack,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  ButtonProps,
  Typography,
} from '@mui/material';

import { DatasheetEditor } from '@/components/DatasheetEditor';

export const metadata: Metadata = {
  robots: {
    index: false,
  },
};

function ExampleCard({ withImage = true }: { withImage?: boolean }) {
  return (
    <Card>
      {withImage && (
        <CardMedia
          component="img"
          alt="placeholder"
          height="140"
          image="https://placehold.co/600x400"
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Test Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

function ExampleCardGrid() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <ExampleCard />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <ExampleCard />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <ExampleCard withImage={false} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <ExampleCard withImage={false} />
      </Grid>
    </Grid>
  );
}

function ExampleButtons({ size }: { size?: ButtonProps['size'] }) {
  return (
    <Stack spacing={2} direction="row">
      <Button size={size} variant="text">
        Text
      </Button>
      <Button size={size} variant="contained">
        Contained
      </Button>
      <Button size={size} variant="outlined">
        Outlined
      </Button>
    </Stack>
  );
}

export default function Playground() {
  return (
    <Container sx={{ py: 8 }}>
      <Stack spacing={8}>
        <div>
          <Typography variant="h1">Hello there 👋</Typography>
        </div>

        <div>
          <Typography variant="h3" paragraph>
            Example cards
          </Typography>
          <ExampleCardGrid />
        </div>

        <div>
          <Typography variant="h3" paragraph>
            Buttons at the tip of your fingers
          </Typography>
          <Stack spacing={2}>
            <ExampleButtons size="large" />
            <ExampleButtons size="medium" />
            <ExampleButtons size="small" />
          </Stack>
        </div>
        <Card>
          <CardContent>
            <DatasheetEditor />
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
