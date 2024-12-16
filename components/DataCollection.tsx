'use client';

import * as React from 'react';
import { Box, Tabs, Tab, Card, Typography } from '@mui/material';
import { DatasheetEditor } from '@/components/DatasheetEditor';
import { Tab as TTab, useDataCollectionStore } from '@/store/data-collection';
import { GetMeasureTemplatesQuery } from '@/types/__generated__/graphql';
import { mapMeasureTemplatesToRows } from '@/utils/measures';
import useStore from '@/store/use-store';
import { useFrameworkInstanceStore } from '@/store/selected-framework-instance';
import { useDefaultTargetYear } from '@/hooks/use-framework-settings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: TTab;
  selected: TTab;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, selected, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={selected !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {selected === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(tab: TTab) {
  return {
    id: `simple-tab-${tab}`,
    'aria-controls': `simple-tabpanel-${tab}`,
  };
}

type Props = {
  measureTemplates: NonNullable<GetMeasureTemplatesQuery['framework']>;
};

const DataCollection = ({ measureTemplates }: Props) => {
  const setSelectedTab = useDataCollectionStore((state) => state.setTab);
  const selectedTab = useDataCollectionStore((state) => state.selectedTab);
  const { data: baselineYear } = useStore(
    useFrameworkInstanceStore,
    (state) => state.baselineYear
  );
  const { data: targetYear } = useStore(
    useFrameworkInstanceStore,
    (state) => state.targetYear
  );

  const defaultTargetYear = useDefaultTargetYear();

  const handleChange = (event: React.SyntheticEvent, newSelected: TTab) => {
    setSelectedTab(newSelected);
  };

  const dataMeasures = measureTemplates.dataCollection
    ? mapMeasureTemplatesToRows(measureTemplates.dataCollection)
    : undefined;

  const assumptionMeasures = measureTemplates.futureAssumptions
    ? mapMeasureTemplatesToRows(measureTemplates.futureAssumptions)
    : undefined;

  return (
    <Card>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label={`Data collection (${baselineYear})`}
            value="data"
            {...a11yProps('data')}
          />
          <Tab
            label={`Future assumptions (${targetYear || defaultTargetYear})`}
            value="assumptions"
            {...a11yProps('assumptions')}
          />
        </Tabs>
      </Box>
      <CustomTabPanel selected={selectedTab} index={'data'}>
        <Typography paragraph gutterBottom>
          Collect essential data about your city&apos;s current state across key
          sectors. This phase focuses on gathering raw data to establish a
          baseline for your city&apos;s climate initiatives.
        </Typography>
        {!!dataMeasures && (
          <DatasheetEditor sections={dataMeasures} withIndexes />
        )}
      </CustomTabPanel>
      <CustomTabPanel selected={selectedTab} index={'assumptions'}>
        <Typography paragraph gutterBottom>
          These assumptions should reflect an ambitious yet feasible scenario
          aligned with the city&apos;s Climate Action Plan, indicating the
          extent to which the city aims to achieve decarbonisation goals.
        </Typography>
        {!!assumptionMeasures && (
          <DatasheetEditor sections={assumptionMeasures} />
        )}
      </CustomTabPanel>
    </Card>
  );
};

export default DataCollection;
