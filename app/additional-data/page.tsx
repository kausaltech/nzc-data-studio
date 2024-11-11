// AdditionalDataPage.jsx
'use client';

import { Container, Typography, Button, Stack, Box, Fade } from '@mui/material';
import { QuestionCircle } from 'react-bootstrap-icons';
import { useFrameworkInstanceStore } from '@/store/selected-framework-instance';
import Tip from '@/components/Tip';
import { AdditionalDatasheetEditor } from '@/components/AdditionalDatasheetEditor';

export default function AdditionalDataPage() {
  const baselineYear = useFrameworkInstanceStore((state) => state.baselineYear);

  const handleButtonClick = () => {
    console.log('The Modal!');
  };

  return (
    <Fade in>
      <Container>
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography variant="h3">Additional Historical Data</Typography>
          <Typography color="textSecondary">(Optional)</Typography>
        </Stack>
        <Box display="flex" alignItems="flex-start" mt={1}>
          <Typography>Baseline {baselineYear}</Typography>
          <Button
            size="small"
            variant="text"
            color="inherit"
            endIcon={<QuestionCircle size={14} />}
            onClick={handleButtonClick}
            sx={{ minWidth: 'auto', padding: 0 }}
          />
        </Box>
        <Tip
          title="Estimate emissions for past years and track your progress"
          text="To understand trends and monitor year-over-year changes, you can enter historical data for previous years. We’ve streamlined this section to focus on 18 key drivers of emissions, making it easy to gather and review past data. This data will provide yearly estimates of your city’s emissions and support tracking progress against your climate goals."
          storageKey="additionalDataTip"
        />
        <AdditionalDatasheetEditor />
      </Container>
    </Fade>
  );
}
