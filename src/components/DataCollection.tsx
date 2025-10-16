'use client';

import { type ReactNode, type SyntheticEvent, useMemo } from 'react';

import { Box, Card, Tab, Tabs, Typography } from '@mui/material';

import { DatasheetEditor } from '@/components/DatasheetEditor';
import { useDefaultTargetYear } from '@/hooks/use-framework-settings';
import type { Tab as TTab } from '@/store/data-collection';
import { useDataCollectionStore } from '@/store/data-collection';
import type {
  GetMeasureTemplatesQuery,
  MeasureTemplateFragmentFragment,
} from '@/types/__generated__/graphql';
import { mapMeasureTemplatesToRows } from '@/utils/measures';

import { useSuspenseSelectedPlanConfig } from './providers/SelectedPlanProvider';

interface TabPanelProps {
  children?: ReactNode;
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

/**
 * Returns the measure template objects that are associated with
 * other sections under section.influencingMeasureTemplates.
 */
function useInfluencingMeasureTemplates(
  measureTemplates: NonNullable<GetMeasureTemplatesQuery['framework']>
) {
  const influencingMeasureTemplates = useMemo<MeasureTemplateFragmentFragment[]>(() => {
    const sections = [
      ...(measureTemplates.dataCollection?.descendants ?? []),
      ...(measureTemplates.futureAssumptions?.descendants ?? []),
    ];

    const flatMeasureTemplates = new Map(
      [
        ...(measureTemplates.dataCollection?.descendants ?? []),
        ...(measureTemplates.futureAssumptions?.descendants ?? []),
      ]
        .flatMap((section) => section.measureTemplates)
        .map((measureTemplate) => [measureTemplate.uuid, measureTemplate])
    );

    const influencingMeasureTemplateUUIDs = new Set(
      sections
        .filter(
          (section) =>
            'influencingMeasureTemplates' in section &&
            section.influencingMeasureTemplates instanceof Array
        )
        .flatMap(({ influencingMeasureTemplates }) =>
          influencingMeasureTemplates.map((template) => template.uuid).filter(Boolean)
        )
    );

    return [...influencingMeasureTemplateUUIDs]
      .map((uuid) => flatMeasureTemplates.get(uuid))
      .filter((template): template is MeasureTemplateFragmentFragment => template != null);
  }, [measureTemplates]);

  return influencingMeasureTemplates;
}

type Props = {
  measureTemplates: NonNullable<GetMeasureTemplatesQuery['framework']>;
};

const DataCollection = ({ measureTemplates }: Props) => {
  const setSelectedTab = useDataCollectionStore((state) => state.setTab);
  const selectedTab = useDataCollectionStore((state) => state.selectedTab);
  const plan = useSuspenseSelectedPlanConfig();
  const baselineYear = plan?.baselineYear;
  const targetYear = plan?.targetYear;

  const defaultTargetYear = useDefaultTargetYear();

  const handleChange = (event: SyntheticEvent, newSelected: TTab) => {
    setSelectedTab(newSelected);
  };

  const dataMeasures = measureTemplates.dataCollection
    ? mapMeasureTemplatesToRows(
        measureTemplates.dataCollection,
        baselineYear ?? null,
        targetYear ?? null
      )
    : undefined;

  const assumptionMeasures = measureTemplates.futureAssumptions
    ? mapMeasureTemplatesToRows(
        measureTemplates.futureAssumptions,
        baselineYear ?? null,
        targetYear ?? null
      )
    : undefined;

  const allInfluencingMeasureTemplates = useInfluencingMeasureTemplates(measureTemplates);

  return (
    <Card>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={handleChange} aria-label="basic tabs example">
          <Tab label={`Data collection (${baselineYear})`} value="data" {...a11yProps('data')} />
          <Tab
            label={`Future assumptions (${targetYear || defaultTargetYear})`}
            value="assumptions"
            {...a11yProps('assumptions')}
          />
        </Tabs>
      </Box>
      <CustomTabPanel selected={selectedTab} index={'data'}>
        <Typography gutterBottom>
          Collect essential data about your city&apos;s current state across key sectors. This phase
          focuses on gathering raw data to establish a baseline for your city&apos;s climate
          initiatives.
        </Typography>
        {!!dataMeasures && (
          <DatasheetEditor
            sections={dataMeasures}
            allInfluencingMeasureTemplates={allInfluencingMeasureTemplates}
            withIndexes
          />
        )}
      </CustomTabPanel>
      <CustomTabPanel selected={selectedTab} index={'assumptions'}>
        <Typography paragraph gutterBottom>
          These assumptions should reflect an ambitious yet feasible scenario aligned with the
          city&apos;s Climate Action Plan, indicating the extent to which the city aims to achieve
          decarbonisation goals.
        </Typography>
        {!!assumptionMeasures && (
          <DatasheetEditor
            sections={assumptionMeasures}
            allInfluencingMeasureTemplates={allInfluencingMeasureTemplates}
          />
        )}
      </CustomTabPanel>
    </Card>
  );
};

export default DataCollection;
