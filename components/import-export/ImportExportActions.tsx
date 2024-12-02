import { GetMeasureTemplatesQuery } from '@/types/__generated__/graphql';
import { Dialog, IconButton, Stack, Tab, Tabs, Tooltip } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { Download, Upload } from 'react-bootstrap-icons';
import { ExportPlanDialogContent } from './ExportPlanDialogContent';
import { ImportPlanDialogContent } from './ImportPlanDialogContent';
import { UploadLegacyDataButton } from '../UploadLegacyDataButton';
import { usePermissions } from '@/hooks/use-user-profile';

type Props = {
  measureTemplates: NonNullable<GetMeasureTemplatesQuery['framework']>;
};

interface TabPanelProps {
  children?: React.ReactNode;
  tabId: string;
  activeTab: string;
}

function TabPanel({ children, tabId, activeTab, ...rest }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={tabId !== activeTab}
      id={`import-export-tabpanel-${tabId}`}
      aria-labelledby={`import-export-tab-${tabId}`}
      {...rest}
    >
      {activeTab === tabId && children}
    </div>
  );
}

function tabA11yProps(tabId: string) {
  return {
    id: `import-export-tab-${tabId}`,
    'aria-controls': `import-export-tabpanel-${tabId}`,
  };
}

export function ImportExportActions({ measureTemplates }: Props) {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const { isFrameworkAdmin } = usePermissions();

  function handleClose() {
    setModalOpen(false);
  }

  function handleChangeTab(e: SyntheticEvent, value: 'export' | 'import') {
    setActiveTab(value);
  }

  function handleClickExport() {
    setActiveTab('export');
    setModalOpen(true);
  }

  function handleClickImport() {
    setActiveTab('import');
    setModalOpen(true);
  }

  return (
    <>
      <Stack spacing={2} direction="row">
        <IconButton color="primary" onClick={handleClickExport}>
          <Tooltip title="Export plan data" placement="top">
            <Download size={24} />
          </Tooltip>
        </IconButton>
        <IconButton color="primary" onClick={handleClickImport}>
          <Tooltip title="Import plan data" placement="top">
            <Upload size={24} />
          </Tooltip>
        </IconButton>
        {isFrameworkAdmin && (
          <UploadLegacyDataButton measureTemplates={measureTemplates} />
        )}
      </Stack>

      <Dialog fullWidth maxWidth="md" onClose={handleClose} open={isModalOpen}>
        <Tabs
          value={activeTab}
          onChange={handleChangeTab}
          aria-label="import or export plan data tabs"
          sx={{ bgcolor: (theme) => theme.palette.brand[50] }}
        >
          <Tab label="Export" value="export" {...tabA11yProps('export')} />
          <Tab label="Import" value="import" {...tabA11yProps('import')} />
        </Tabs>

        <TabPanel activeTab={activeTab} tabId="export">
          <ExportPlanDialogContent
            measureTemplates={measureTemplates}
            onClose={handleClose}
          />
        </TabPanel>
        <TabPanel activeTab={activeTab} tabId="import">
          <ImportPlanDialogContent onClose={handleClose} />
        </TabPanel>
      </Dialog>
    </>
  );
}
