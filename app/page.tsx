import { auth } from '@/config/auth';
import {
  Card,
  CardContent,
  Container,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { RedirectType, redirect } from 'next/navigation';
import { BoxArrowUpRight } from 'react-bootstrap-icons';

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect('/welcome', RedirectType.replace);
  }

  return (
    <Container>
      <Stack spacing={4}>
        <Card>
          <CardContent>
            <Typography variant="h1">Zero COventry</Typography>
            <Stack
              component={Link}
              href="#"
              rel="noopener noreferrer"
              target="_blank"
              variant="body2"
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center' }}
            >
              <span>netzero.kausal.tech/coventry-netzero</span>
              <BoxArrowUpRight size={14} />
            </Stack>
          </CardContent>
        </Card>

        <div>
          <Typography gutterBottom variant="h3" component="h2">
            Data collection center
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="h5">Another card...</Typography>
            </CardContent>
          </Card>
        </div>
      </Stack>
    </Container>
  );
}
