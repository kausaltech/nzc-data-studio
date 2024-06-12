'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Chip from '@mui/material/Chip';

interface CompletionScoreCardProps {}

interface MockData {
  title: string;
  linkText: string;
  linkHref: string;
  scoreData: scoreData[];
}

interface scoreData {
  status: 'High' | 'Medium' | 'Low';
  total: number;
  completed: number;
}

const mockData = {
  title: 'Zero COventry',
  linkText: 'netzerocities.kausal.tech/coventry-netzero',
  linkHref: '#',
  scoreData: [
    { status: 'High', total: 13, completed: 10 } as scoreData,
    { status: 'Medium', total: 10, completed: 7 } as scoreData,
    { status: 'Low', total: 8, completed: 2 } as scoreData,
  ],
};

const calculateScores = (scoreData: scoreData[]) => {
  return scoreData.map((data) => ({
    status: data.status,
    score: `${data.completed}/${data.total}`,
  }));
};

const calculatePercentage = (scoreData: scoreData[]) => {
  const totalCompleted = scoreData.reduce(
    (acc, curr) => acc + curr.completed,
    0
  );
  const totalItems = scoreData.reduce((acc, curr) => acc + curr.total, 0);
  return totalItems === 0 ? 0 : (totalCompleted / totalItems) * 100;
};

export const CompletionScoreCard: React.FC<CompletionScoreCardProps> = () => {
  const [data, setData] = useState<MockData | null>(null);
  const [scores, setScores] = useState<
    { status: 'High' | 'Medium' | 'Low'; score: string }[]
  >([]);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);

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

  return (
    <Box
      sx={{
        width: '80%',
        margin: '0 auto',
        marginTop: '7em',
        border: '1px solid #ddd',
        borderRadius: '0.5em',
        padding: '1em',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1em',
        }}
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
              }}
            >
              {data.linkText}
              <ArrowUpwardIcon
                sx={{
                  fontSize: '1.1em',
                  transform: 'rotate(45deg)',
                  marginLeft: '0.3em',
                }}
              />
            </Link>
          </Box>
        </Box>
        <Button
          sx={{
            backgroundColor: 'transparent',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'transparent',
              color: 'primary.main',
              border: '1px solid',
              borderColor: 'brand.800',
            },
          }}
          variant="contained"
          color="primary"
          href="/dashboard"
        >
          Explore city dashboard{' '}
          <ArrowUpwardIcon
            sx={{
              transform: 'rotate(45deg)',
              fontSize: '1.2em',
              marginLeft: '0.5em',
            }}
          />
        </Button>
      </Box>
      <Box
        sx={{
          width: '60%',
          backgroundColor: '#f0f0f0',
          padding: '1em',
          borderRadius: '0.5em',
        }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}
        >
          <FiberManualRecordIcon sx={{ color: 'red', marginRight: '0.5em' }} />
          <Typography variant="subtitle1">
            Data completion score: {completionPercentage.toFixed(0)}%
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          Your score assesses the completeness of city data, assigning weights
          based on the importance of city-specific values for precise
          projections. Enter values in the Data Collection. Centre below to
          boost your score and enable more accurate projections.
        </Typography>
        <Box sx={{ display: 'flex', gap: '0.5em' }}>
          {scores.map((score) => (
            <Chip
              key={score.status}
              icon={
                <FiberManualRecordIcon
                  sx={{
                    color:
                      score.status === 'High'
                        ? 'red'
                        : score.status === 'Medium'
                        ? 'orange'
                        : 'green',
                  }}
                />
              }
              label={`${score.status}: ${score.score}`}
              sx={{
                '& .MuiChip-icon': {
                  color: `${
                    score.status === 'High'
                      ? 'red'
                      : score.status === 'Medium'
                      ? 'orange'
                      : 'green'
                  } !important`,
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CompletionScoreCard;
