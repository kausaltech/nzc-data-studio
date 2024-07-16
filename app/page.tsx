'use client';

import { auth } from '@/config/auth';
import {
  Card,
  CardContent,
  Container,
  Fade,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { RedirectType, redirect } from 'next/navigation';
import { BoxArrowUpRight } from 'react-bootstrap-icons';
import DataCollection from '@/components/DataCollection';
import { UploadLegacyDataButton } from '@/components/UploadLegacyDataButton';
import { GET_MEASURE_TEMPLATES } from '@/queries/get-measure-templates';
import { useSession } from 'next-auth/react';
import { useSuspenseQuery } from '@apollo/client';
import {
  GetMeasureTemplatesQuery,
  GetMeasureTemplatesQueryVariables,
} from '@/types/__generated__/graphql';
import Loading from './loading';

export default function Dashboard() {
  const { status } = useSession();
  const { data, error } = useSuspenseQuery<
    GetMeasureTemplatesQuery,
    GetMeasureTemplatesQueryVariables
  >(GET_MEASURE_TEMPLATES, {
    variables: { frameworkConfigId: '3' }, // TODO: From backend
  });

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'unauthenticated') {
    return redirect('/welcome', RedirectType.replace);
  }

  if (!data || error) {
    // TODO: Return error page
    console.log('Error', error);
    return <h1>Something went wrong</h1>;
  }

  return (
    <Fade in>
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

              {!!data.framework && (
                <UploadLegacyDataButton measureTemplates={data.framework} />
              )}
            </Stack>
            {!!data.framework && (
              <DataCollection measureTemplates={data.framework} />
            )}
          </div>
        </Stack>
      </Container>
    </Fade>
  );
}
