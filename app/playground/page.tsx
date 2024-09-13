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

import { CompletionScoreCard } from '@/components/CompletionScoreCard';

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
        <Stack spacing={2}>
          <Typography variant="h1">Hello there 👋</Typography>
          <Typography variant="h2">
            The quick brown fox jumps over the lazy dog (h2)
          </Typography>
          <Typography variant="h3">
            The quick brown fox jumps over the lazy dog (h3)
          </Typography>
          <Typography variant="h4">
            The quick brown fox jumps over the lazy dog (h4)
          </Typography>
          <Typography variant="h5">
            The quick brown fox jumps over the lazy dog (h5)
          </Typography>
          <Typography variant="h6">
            The quick brown fox jumps over the lazy dog (h6)
          </Typography>
          <Typography variant="subtitle1">
            The quick brown fox jumps over the lazy dog (subtitle1)
          </Typography>
          <Typography variant="subtitle2">
            The quick brown fox jumps over the lazy dog (subtitle2)
          </Typography>
          <Typography variant="caption">
            The quick brown fox jumps over the lazy dog (caption)
          </Typography>
          <Typography variant="body1">
            The quick brown fox jumps over the lazy dog (body1)
          </Typography>
          <Typography variant="body2">
            The quick brown fox jumps over the lazy dog (body2)
          </Typography>
        </Stack>

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
      </Stack>
    </Container>
  );
}
