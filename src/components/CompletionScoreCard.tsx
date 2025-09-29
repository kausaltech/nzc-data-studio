'use client';

import * as React from 'react';

import { Box, Chip, Stack, Typography } from '@mui/material';

import type { GetMeasureTemplatesQuery } from '@/types/__generated__/graphql';
import { FrameworksMeasureTemplatePriorityChoices as Priority } from '@/types/__generated__/graphql';
import type { MeasureTemplates } from '@/utils/measures';
import { filterYearBoundMeasureTemplate, measureTemplateHasValue } from '@/utils/measures';

import { PriorityIcon, getPriorityLabel } from './PriorityBadge';
import { useSuspenseSelectedPlanConfig } from './providers/SelectedPlanProvider';

interface Props {
  measureTemplates: NonNullable<GetMeasureTemplatesQuery['framework']>;
}

interface ScoreData {
  priority: Priority;
  total: number;
  completed: number;
}

type Totals = {
  [Priority.High]: ScoreData;
  [Priority.Medium]: ScoreData;
};

const processDataCollection = (
  measureTemplates: Props['measureTemplates'],
  baselineYear: number | null,
  targetYear: number | null
) => {
  const result: Totals = {
    [Priority.High]: {
      priority: Priority.High,
      total: 0,
      completed: 0,
    },
    [Priority.Medium]: {
      priority: Priority.Medium,
      total: 0,
      completed: 0,
    },
  };

  function tallyScore(scoreData: ScoreData, measureTemplate: MeasureTemplates[0]) {
    if (measureTemplateHasValue(measureTemplate)) {
      scoreData.completed += 1;
    }

    scoreData.total += 1;
  }

  const processItems = (measureTemplates: MeasureTemplates) => {
    measureTemplates
      .filter((measureTemplate) => measureTemplate.hidden !== true)
      .forEach((measureTemplate) => {
        if (!filterYearBoundMeasureTemplate(measureTemplate, baselineYear, targetYear)) {
          return;
        }

        if (measureTemplate.priority === Priority.High) {
          tallyScore(result[Priority.High], measureTemplate);
        } else if (measureTemplate.priority === Priority.Medium) {
          tallyScore(result[Priority.Medium], measureTemplate);
        }
      });
  };

  const dataSections = measureTemplates.dataCollection
    ? measureTemplates.dataCollection.descendants.flatMap((section) => section.measureTemplates)
    : [];

  const futureAssumptionSections = measureTemplates.futureAssumptions
    ? measureTemplates.futureAssumptions.descendants.flatMap((section) => section.measureTemplates)
    : [];

  processItems([...dataSections, ...futureAssumptionSections]);

  return result;
};

const calculateScores = (scoreData: ScoreData[]) => {
  return scoreData.map((data) => ({
    priority: data.priority,
    score: `${data.completed}/${data.total}`,
  }));
};

const calculatePercentage = (scoreData: ScoreData[]) => {
  const coeff: {
    [Priority.High]: number;
    [Priority.Medium]: number;
  } = {
    [Priority.High]: 0.6,
    [Priority.Medium]: 0.4,
  };

  const totalPercentage = scoreData.reduce((acc, data) => {
    const completionPercentage = data.total > 0 ? data.completed / data.total : 0;

    return acc + completionPercentage * (coeff[data.priority] || 0);
  }, 0);

  return totalPercentage * 100;
};

export const CompletionScoreCard = ({ measureTemplates }: Props) => {
  const plan = useSuspenseSelectedPlanConfig();
  const baselineYear = plan?.baselineYear ?? null;
  const targetYear = plan?.targetYear ?? null;

  const scoreData = processDataCollection(measureTemplates, baselineYear, targetYear);
  const scores = calculateScores(Object.values(scoreData));
  const completionPercentage = calculatePercentage(Object.values(scoreData));

  return (
    <Box
      sx={{
        maxWidth: 600,
        width: '100%',
        backgroundColor: 'grey.200',
        padding: 1,
        borderRadius: 0.5,
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Data completion score: {completionPercentage.toFixed(0)}%
      </Typography>
      <Typography variant="body1" paragraph>
        Your score rates how complete city data is, weighing important local values for accurate
        predictions. Enter city data to improve your score and get better projections.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-start">
        {scores.map((score, index) => (
          <Chip
            key={`${score.priority}-${index}`}
            icon={<PriorityIcon priorityType={score.priority} size={16} />}
            label={`${getPriorityLabel(score.priority)} priority: ${score.score}`}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default CompletionScoreCard;
