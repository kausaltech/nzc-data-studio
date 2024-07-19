'use client';

import * as React from 'react';
import { Box, Typography, Chip, useTheme, Stack } from '@mui/material';
import { CircleFill } from 'react-bootstrap-icons';
import {
  FrameworksMeasureTemplatePriorityChoices as Priority,
  GetMeasureTemplatesQuery,
} from '@/types/__generated__/graphql';
import { measureTemplateHasValue, MeasureTemplates } from '@/utils/measures';

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
  const coeff: { [key: string]: number } = {
    High: 0.6,
    Moderate: 0.3,
    Low: 0.1,
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return theme.palette.error.main;
      case 'Moderate':
        return theme.palette.warning.main;
      case 'Low':
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
        <CircleFill
          style={{
            color: theme.palette.error.main,
          }}
        />
        <Typography variant="subtitle1">
          Data completion score: {completionPercentage.toFixed(0)}%
        </Typography>
      </Stack>
      <Typography variant="body1" paragraph>
        Your score rates how complete city data is, weighing important local
        values for accurate predictions. Enter city data to improve your score
        and get better projections.
      </Typography>
      <Stack direction="row" spacing={2}>
        {scores.map((score, index) => (
          <Chip
            key={`${score.priority}-${index}`}
            icon={
              <CircleFill
                style={{
                  color: getPriorityColor(score.priority),
                  marginLeft: '0.5em',
                }}
              />
            }
            label={`${score.priority}: ${score.score}`}
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
