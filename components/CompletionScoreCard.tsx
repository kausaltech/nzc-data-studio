import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Chip from '@mui/material/Chip';

interface CompletionScoreCardProps {}

const CompletionScoreCard: React.FC<CompletionScoreCardProps> = () => {
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
          <Typography variant="h5">Zero COventry</Typography>
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
              href="#"
              variant="body2"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              Click here for more info
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
          <Typography variant="subtitle1">Data completion score: 1%</Typography>
        </Box>
        <Typography variant="body1" paragraph>
          Your score assesses the completeness of city data, assigning weights
          based on the importance of city-specific values for precise
          projections. Enter values in the Data Collection. Centre below to
          boost your score and enable more accurate projections.
        </Typography>
        <Box sx={{ display: 'flex', gap: '0.5em' }}>
          <Chip
            icon={<FiberManualRecordIcon sx={{ color: 'red !important' }} />}
            label="1/83 High"
            sx={{
              '& .MuiChip-icon': {
                color: 'red !important',
              },
            }}
          />
          <Chip
            icon={<FiberManualRecordIcon sx={{ color: 'orange !important' }} />}
            label="0/21 Medium"
            sx={{
              '& .MuiChip-icon': {
                color: 'orange !important',
              },
            }}
          />
          <Chip
            icon={<FiberManualRecordIcon sx={{ color: 'green !important' }} />}
            label="0/13 Low"
            sx={{
              '& .MuiChip-icon': {
                color: 'green !important',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CompletionScoreCard;
