import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { kebabCase } from 'lodash';
import { ChevronDown, Download } from 'react-bootstrap-icons';

import { useFrameworkInstanceStore } from '@/store/selected-framework-instance';
import useStore from '@/store/use-store';
import { GetMeasureTemplatesQuery } from '@/types/__generated__/graphql';
import {
  getMeasuresFromMeasureTemplates,
  MeasureForDownload,
} from '@/utils/measures';

type ExportedData = {
  version: number;
  planName: string;
  measures: MeasureForDownload[];
};

function getLocalISODateTime() {
  // Sweden uses a date format similar to ISO, hacky but works
  return new Date().toLocaleString('sv').replace(' ', 'T').replaceAll(':', '-');
}

function mapMeasureTemplatesToDownload(
  planName: string,
  measureTemplates: Props['measureTemplates'],
  baselineYear: number | null
): ExportedData {
  return {
    version: 1,
    planName,
    measures: getMeasuresFromMeasureTemplates(measureTemplates, baselineYear),
  };
}

type Props = {
  measureTemplates: NonNullable<GetMeasureTemplatesQuery['framework']>;
  onClose: () => void;
};

export function ExportPlanDialogContent({ measureTemplates, onClose }: Props) {
  const { data: planName } = useStore(
    useFrameworkInstanceStore,
    (state) => state.name
  );

  const { data: baselineYear } = useStore(
    useFrameworkInstanceStore,
    (state) => state.baselineYear
  );

  function handleDownload() {
    if (!planName) {
      console.log('Missing plan name for download'); // TODO: Log error, this shouldn't occur
      return;
    }

    const blob = new Blob(
      [
        JSON.stringify(
          mapMeasureTemplatesToDownload(
            planName,
            measureTemplates,
            baselineYear ?? null
          )
        ),
      ],
      {
        type: 'application/json',
      }
    );
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = `NZC-export_${kebabCase(
      planName
    )}_${getLocalISODateTime()}.json`;
    link.click();
  }

  return (
    <>
      <DialogTitle>Export plan data</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography color="text.secondary" paragraph>
            Export a file containing all the data for this plan. Use the import
            function to return to this data later or to incorporate it into a
            new plan.
          </Typography>
          <Card variant="outlined" elevation={0} sx={{ boxShadow: 'none' }}>
            <Accordion sx={{ bgcolor: 'background.neutral' }}>
              <AccordionSummary
                color="primary.main"
                expandIcon={<ChevronDown />}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  How does exporting help my workflow?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  Downloading your climate plan data offers several advantages:
                </Typography>
                <Box component="ul" sx={{ paddingLeft: 2 }}>
                  <Typography component="li" variant="body2">
                    Save different versions of your plan for future reference
                  </Typography>
                  <Typography component="li" variant="body2">
                    Experiment with different scenarios by tweaking numbers
                    without losing your original data
                  </Typography>
                  <Typography component="li" variant="body2">
                    Share your plan data with colleagues or transfer it to
                    another city
                  </Typography>
                  <Typography component="li" variant="body2" paragraph>
                    Create a new plan and use uploaded data as a starting point
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Card>
        </Box>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleDownload}
            endIcon={<Download size={18} />}
          >
            Export data
          </Button>
        </DialogActions>
      </DialogContent>
    </>
  );
}
