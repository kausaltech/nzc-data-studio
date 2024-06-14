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
  Stack
} from '@mui/material';
import { ArrowUpRight, CircleFill } from 'react-bootstrap-icons';



interface CompletionScoreCardProps {}

interface MockData {
  title: string;
  linkText: string;
  linkHref: string;
  scoreData: ScoreData[];
}

interface ScoreData {
  status: 'High' | 'Moderate' | 'Low';
  total: number;
  completed: number;
}

const mockData = {
  title: 'Zero COventry',
  linkText: 'netzerocities.kausal.tech/coventry-netzero',
  linkHref: '#',
  scoreData: [
    { status: 'High', total: 13, completed: 6 } as ScoreData,
    { status: 'Moderate', total: 10, completed: 5 } as ScoreData,
    { status: 'Low', total: 8, completed: 3 } as ScoreData,
  ],
};



const calculateScores = (scoreData: ScoreData[]) => {
  return scoreData.map((data) => ({
    status: data.status,
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
    return acc + completionPercentage * (coeff[data.status] || 0);
  }, 0);

  return totalPercentage * 100;
};

export const CompletionScoreCard: React.FC<CompletionScoreCardProps> = () => {
  const [data, setData] = useState<MockData | null>(null);
  const [scores, setScores] = useState<
    { status: 'High' | 'Moderate' | 'Low'; score: string }[]
  >([]);

  const [completionPercentage, setCompletionPercentage] = useState<number>(0);

  const theme = useTheme();

  useEffect(() => {
    setTimeout(() => {
      setData(mockData);
      const calculatedScores = calculateScores(mockData.scoreData);
      setScores(calculatedScores);
      const percentage = calculatePercentage(mockData.scoreData);
      setCompletionPercentage(percentage);
    }, 1000);
  }, []);

if (!data) {
  return <Typography>Loading...</Typography>;
}

 const getStatusColor = (status: string) => {
   switch (status) {
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
            {scores.map((score) => (
              <Chip
                key={score.status}
                icon={
                  <CircleFill
                    style={{
                      color: getStatusColor(score.status),
                      marginLeft: '0.5em',
                    }}
                  />
                }
                label={`${score.status}: ${score.score}`}
                sx={{
                  '& .MuiChip-icon': {
                    color: getStatusColor(score.status),
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
