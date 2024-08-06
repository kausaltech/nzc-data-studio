import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  AccordionProps,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircle, ChevronDown } from 'react-bootstrap-icons';
import NumberInput from './NumberInput';
import { NumberFormatValues } from 'react-number-format';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  '&:first-of-type': {
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
  '&:last-of-type': {
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
  marginBottom: '10px', // Add bottom margin to the accordion
}));

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  '& .MuiAccordionSummary-content': {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

interface EssentialDataPanelProps {
  baselineYear: string;
  onChange: (field: string, value: number) => void;
}

const EssentialDataPanel: React.FC<EssentialDataPanelProps> = ({
  baselineYear,
  onChange,
}) => {
  const [population, setPopulation] = useState<number | null>(null);
  const [cityGDP, setCityGDP] = useState<number | null>(null);
  const [electricityDemand, setElectricityDemand] = useState<number | null>(
    null
  );
  const [heatingDemand, setHeatingDemand] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Check if all data is provided
  const allDataProvided =
    population !== null &&
    cityGDP !== null &&
    electricityDemand !== null &&
    heatingDemand !== null;

  useEffect(() => {
    if (allDataProvided) {
      setTimeout(() => {
        setIsCollapsed(true);
      }, 300); // Delay to allow the user to see the tick mark
    }
  }, [allDataProvided]);

  const handleBlur = (field: string) => (values: NumberFormatValues) => {
    if (!isNaN(values.floatValue)) {
      onChange(field, values.floatValue ?? 0);
    }
  };

  const commonProps = {
    sx: { m: 1, height: '40px', '.MuiInputBase-root': { height: '40px' } },
    fullWidth: true,
    margin: 'dense' as const,
  };

  return (
    <Card>
      <Accordion
        expanded={!isCollapsed}
        onChange={() => setIsCollapsed(!isCollapsed)}
      >
        <AccordionSummary expandIcon={<ChevronDown />}>
          <Box display="flex" alignItems="center">
            <Typography variant="h5">
              Essential Data ({baselineYear})
            </Typography>
            {allDataProvided && (
              <CheckCircle style={{ color: 'green', marginLeft: '10px' }} />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle2" paragraph gutterBottom>
            Provide the following key data points to enhance the accuracy of our
            projections and assumptions:
          </Typography>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Economic and demographic indicators
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ marginBottom: '4px' }}
                >
                  Population
                </Typography>
                <NumberInput
                  value={population !== null ? population : ''}
                  onValueChange={(values) =>
                    setPopulation(values.floatValue ?? null)
                  }
                  onBlur={(e) =>
                    handleBlur('population')(e as unknown as NumberFormatValues)
                  }
                  {...commonProps}
                  sx={{ width: '25%' }}
                />
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ marginBottom: '4px' }}
                >
                  City GDP
                </Typography>
                <NumberInput
                  value={cityGDP !== null ? cityGDP : ''}
                  onValueChange={(values) =>
                    setCityGDP(values.floatValue ?? null)
                  }
                  onBlur={(e) =>
                    handleBlur('cityGDP')(e as unknown as NumberFormatValues)
                  }
                  {...commonProps}
                  sx={{ width: '25%' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">€</InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
            <Typography variant="subtitle2" gutterBottom mt={2}>
              Energy consumption metrics
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ marginBottom: '4px' }}
                >
                  Total Electricity Demand
                </Typography>
                <NumberInput
                  value={electricityDemand !== null ? electricityDemand : ''}
                  onValueChange={(values) =>
                    setElectricityDemand(values.floatValue ?? null)
                  }
                  onBlur={(e) =>
                    handleBlur('electricityDemand')(
                      e as unknown as NumberFormatValues
                    )
                  }
                  {...commonProps}
                  sx={{ width: '25%' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">MWh</InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ marginBottom: '4px' }}
                >
                  Total Heating Demand
                </Typography>
                <NumberInput
                  value={heatingDemand !== null ? heatingDemand : ''}
                  onValueChange={(values) =>
                    setHeatingDemand(values.floatValue ?? null)
                  }
                  onBlur={(e) =>
                    handleBlur('heatingDemand')(
                      e as unknown as NumberFormatValues
                    )
                  }
                  {...commonProps}
                  sx={{ width: '25%' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">GWh</InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default EssentialDataPanel;
