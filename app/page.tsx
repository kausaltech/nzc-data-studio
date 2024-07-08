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

  const { data, error } = await tryRequest(getMeasureTemplates('nzc'));

  console.log('🔨🔨🔨🔨🔨🔨🔨🔨🔨🔨🔨🔨🔨🔨🔨');
  console.log(JSON.stringify(data, null, 2));
  console.log('-------------------------');
  console.log(JSON.stringify(error, null, 2));
  console.log('-------------------------');

  function handleClickUpload() {}

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
          <DataCollection />
        </div>
      </Stack>
    </Container>
  );
}
