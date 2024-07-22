'use client';

import * as React from 'react';
import { Box, Typography, Chip, useTheme, Stack } from '@mui/material';
import {
  FrameworksMeasureTemplatePriorityChoices as Priority,
  GetMeasureTemplatesQuery,
} from '@/types/__generated__/graphql';
import { measureTemplateHasValue, MeasureTemplates } from '@/utils/measures';
import { getPriorityLabel, PriorityIcon } from './PriorityBadge';

interface Props {
  measureTemplates: NonNullable<GetMeasureTemplatesQuery['framework']>;
}

interface ScoreData {
  priority: Priority;
  total: number;
  completed: number;
}

type Totals = {
  [K in Priority]: ScoreData;
};

const processDataCollection = (measureTemplates: Props['measureTemplates']) => {
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
    [Priority.Low]: {
      priority: Priority.Low,
      total: 0,
      completed: 0,
    },
  };

  const processItems = (measureTemplates: MeasureTemplates) => {
    function tallyScore(
      scoreData: ScoreData,
      measureTemplate: MeasureTemplates[0]
    ) {
      if (measureTemplateHasValue(measureTemplate)) {
        scoreData.completed += 1;
      }

      scoreData.total += 1;
    }

    measureTemplates.forEach((measureTemplate) => {
      if (measureTemplate.priority === Priority.High) {
        tallyScore(result[Priority.High], measureTemplate);
      } else if (measureTemplate.priority === Priority.Medium) {
        tallyScore(result[Priority.Medium], measureTemplate);
      } else if (measureTemplate.priority === Priority.Low) {
        tallyScore(result[Priority.Low], measureTemplate);
      }
    });
  };

  const dataSections = measureTemplates.dataCollection
    ? measureTemplates.dataCollection.descendants.flatMap(
        (section) => section.measureTemplates
      )
    : [];

  const futureAssumptionSections = measureTemplates.futureAssumptions
    ? measureTemplates.futureAssumptions.descendants.flatMap(
        (section) => section.measureTemplates
      )
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
  const coeff: { [key in Priority]: number } = {
    [Priority.High]: 0.6,
    [Priority.Medium]: 0.3,
    [Priority.Low]: 0.1,
  };

  const totalPercentage = scoreData.reduce((acc, data) => {
    const completionPercentage =
      data.total > 0 ? data.completed / data.total : 0;

    return acc + completionPercentage * (coeff[data.priority] || 0);
  }, 0);

  return totalPercentage * 100;
};

export const CompletionScoreCard = ({ measureTemplates }: Props) => {
  const theme = useTheme();

  const scoreData = processDataCollection(measureTemplates);
  const scores = calculateScores(Object.values(scoreData));
  const completionPercentage = calculatePercentage(Object.values(scoreData));

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.High:
        return theme.palette.error.main;
      case Priority.Medium:
        return theme.palette.warning.main;
      case Priority.Low:
        return theme.palette.success.main;
    }
  };

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
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="subtitle1">
          Data completion score: {completionPercentage.toFixed(0)}%
        </Typography>
      </Stack>
      <Typography variant="body1" paragraph>
        Your score rates how complete city data is, weighing important local
        values for accurate predictions. Enter city data to improve your score
        and get better projections.
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        alignItems="flex-start"
      >
        {scores.map((score, index) => (
          <Chip
            key={`${score.priority}-${index}`}
            icon={<PriorityIcon priorityType={score.priority} size={16} />}
            label={`${getPriorityLabel(score.priority)} priority: ${
              score.score
            }`}
            sx={{
              '& .MuiChip-icon': {
                color: getPriorityColor(score.priority),
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default CompletionScoreCard;
