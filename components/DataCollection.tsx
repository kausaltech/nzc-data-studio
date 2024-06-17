'use client';

import * as React from 'react';
import { Box, Tabs, Tab, Card, Typography } from '@mui/material';
import { DatasheetEditor } from '@/components/DatasheetEditor';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Card>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Data collection" {...a11yProps(0)} />
          <Tab label="Future assumptions (2035)" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Typography variant="subtitle2" paragraph gutterBottom>
          Collect essential data about your city&apos;s current state across key
          sectors. This phase focuses on gathering raw data to establish a
          baseline for your city&apos;s climate initiatives.
        </Typography>
        <DatasheetEditor />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
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
