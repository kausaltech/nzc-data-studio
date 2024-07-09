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
import DataCollection from '@/components/DataCollection';
import { UploadLegacyDataButton } from '@/components/UploadLegacyDataButton';
import { getMeasureTemplates } from '@/queries/get-measure-templates';
import { tryRequest } from '@/utils/api';

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect('/welcome', RedirectType.replace);
  }

  const { data, error } = await tryRequest(getMeasureTemplates());

  if (!data || error) {
    // TODO: Return error page
    console.log('Error', error);
    return <h1>Something went wrong</h1>;
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
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography gutterBottom variant="h3" component="h2">
              Data collection center
            </Typography>

            <UploadLegacyDataButton />
          </Stack>
          {data.framework ? (
            <DataCollection measureTemplates={data.framework} />
          ) : null}
        </div>
      </Stack>
    </Container>
  );
}
