'use client';

import * as React from 'react';
import { Box, Tabs, Tab, Card, Typography } from '@mui/material';
import { DatasheetEditor } from '@/components/DatasheetEditor';
import { useDataCollectionStore } from '@/store/data-collection';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  selected: number;
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const DataCollection = () => {
  const setSelectedTab = useDataCollectionStore((state) => state.setTab);
  const selectedTab = useDataCollectionStore((state) => state.selectedTab);

  const handleChange = (event: React.SyntheticEvent, newSelected: number) => {
    setSelectedTab(newSelected);
  };

  return (
    <Card>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Data collection" {...a11yProps(0)} />
          <Tab label="Future assumptions (2035)" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel selected={selectedTab} index={0}>
        <Typography variant="subtitle2" paragraph gutterBottom>
          Collect essential data about your city&apos;s current state across key
          sectors. This phase focuses on gathering raw data to establish a
          baseline for your city&apos;s climate initiatives.
        </Typography>
        <DatasheetEditor />
      </CustomTabPanel>
      <CustomTabPanel selected={selectedTab} index={1}>
        <Typography variant="subtitle2" paragraph gutterBottom>
          These assumptions should reflect an ambitious yet feasible scenario
          aligned with the city&apos;s Climate Action Plan, indicating the
          extent to which the city aims to achieve decarbonisation goals.
        </Typography>
        <DatasheetEditor />
      </CustomTabPanel>
    </Card>
  );
};

export default DataCollection;
