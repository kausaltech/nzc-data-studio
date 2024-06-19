'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Link,
  Chip,
  useTheme,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { ArrowUpRight, CircleFill } from 'react-bootstrap-icons';
import MOCK_MEASURES from '@/mocks/measures.json';

interface CompletionScoreCardProps {}

interface MockData {
  title: string;
  linkText: string;
  linkHref: string;
  scoreData: ScoreData[];
}

interface ScoreData {
  priority: 'High' | 'Moderate' | 'Low';
  total: number;
  completed: number;
}

interface CalculatedScore {
  priority: string;
  score: string;
}

const mockData = {
  title: 'Zero COventry',
  linkText: 'netzerocities.kausal.tech/coventry-netzero',
  linkHref: '#',
};

const processDataCollection = () => {
  const result = [
    { priority: 'High', total: 0, completed: 0 } as ScoreData,
    { priority: 'Moderate', total: 0, completed: 0 } as ScoreData,
    { priority: 'Low', total: 0, completed: 0 } as ScoreData,
  ];

  const processItems = (items: any[]) => {
    items.forEach((item) => {
      if (item.priority === 'HIGH') {
        result[0].total += 1;
        if (item.value) result[0].completed += 1;
      } else if (item.priority === 'MODERATE') {
        result[1].total += 1;
        if (item.value) result[1].completed += 1;
      } else if (item.priority === 'LOW') {
        result[2].total += 1;
        if (item.value) result[2].completed += 1;
      }
      if (item.items) {
        processItems(item.items);
      }
    });
  };

  MOCK_MEASURES['dataCollection'].items.forEach((section) => {
    processItems(section.items);
  });

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

export const CompletionScoreCard: React.FC<CompletionScoreCardProps> = () => {
  const [data, setData] = useState<MockData | null>(null);
  const [scores, setScores] = useState<CalculatedScore[]>([]);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);

  const theme = useTheme();

  useEffect(() => {
    setTimeout(() => {
      const scoreData = processDataCollection();
      const finalMockData: MockData = {
        ...mockData,
        scoreData: scoreData,
      };

      setData(finalMockData);
      const calculatedScores = calculateScores(scoreData);
      setScores(calculatedScores);

      const percentage = calculatePercentage(scoreData);
      setCompletionPercentage(percentage);
    }, 1000);
  }, []);

  if (!data) {
    return <Typography>Loading...</Typography>;
  }

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
    <Card>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ marginBottom: 2 }}
        >
          <Box>
            <Typography variant="h5">{data.title}</Typography>
            <Box
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                '&:hover': {
                  borderBottom: '1px solid',
                },
              }}
            >
              <Link
                href={data.linkHref}
                variant="body2"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: (theme) => theme.palette.grey[700],
                }}
              >
                {data.linkText}
                <ArrowUpRight
                  style={{
                    marginLeft: '0.5em',
                  }}
                />
              </Link>
            </Box>
          </Box>
          <Button
            component={Link}
            sx={{
              backgroundColor: 'transparent',
              color: 'inherit',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'inherit',
                border: '1px solid',
                borderColor: 'inherit',
              },
            }}
            variant="contained"
            color="primary"
            href="/dashboard"
          >
            Explore city dashboard{' '}
            <ArrowUpRight
              style={{
                marginLeft: '0.5em',
              }}
            />
          </Button>
        </Stack>
        <Box
          sx={{
            width: '60%',
            backgroundColor: 'grey.200',
            padding: 1,
            borderRadius: 0.5,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ marginBottom: 2 }}
          >
            <CircleFill
              style={{
                color: theme.palette.error.main,
              }}
            />
            <Typography variant="subtitle1">
              Data completion score: {completionPercentage.toFixed(0)}%
            </Typography>
          </Stack>
          <Typography variant="body1" paragraph marginBottom={2}>
            Your score assesses the completeness of city data, assigning weights
            based on the importance of city-specific values for precise
            projections. Enter values in the Data Collection. Centre below to
            boost your score and enable more accurate projections.
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
      </CardContent>
    </Card>
  );
};

export default CompletionScoreCard;
