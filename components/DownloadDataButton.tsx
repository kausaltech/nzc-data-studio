import { useFrameworkInstanceStore } from '@/store/selected-framework-instance';
import useStore from '@/store/use-store';
import { GetMeasureTemplatesQuery } from '@/types/__generated__/graphql';
import {
  getMeasuresFromMeasureTemplates,
  MeasureForDownload,
} from '@/utils/measures';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { kebabCase } from 'lodash';
import { useState } from 'react';
import { Download } from 'react-bootstrap-icons';

type Props = {
  measureTemplates: NonNullable<GetMeasureTemplatesQuery['framework']>;
};

type Download = {
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
): Download {
  return {
    version: 1,
    planName,
    measures: getMeasuresFromMeasureTemplates(measureTemplates, baselineYear),
  };
}

export function DownloadDataButton({ measureTemplates }: Props) {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const { data: planName } = useStore(
    useFrameworkInstanceStore,
    (state) => state.name
  );

  const { data: baselineYear } = useStore(
    useFrameworkInstanceStore,
    (state) => state.baselineYear
  );

  function handleClose() {
    setModalOpen(false);
  }

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
    <div>
      <IconButton color="primary" onClick={() => setModalOpen(true)}>
        <Download size={24} />
      </IconButton>

      <Dialog fullWidth maxWidth="md" onClose={handleClose} open={isModalOpen}>
        <DialogTitle>Download plan data</DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative' }}></Box>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDownload} endIcon={<Download size={24} />}>
              Download
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
