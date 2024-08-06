import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
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
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}));

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  '& .MuiAccordionSummary-content': {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  borderTop: 'none',
}));

interface EssentialDataProps {
  baselineYear: string;
  onChange: (field: string, value: number) => void;
  onComplete: () => void;
}

const EssentialData: React.FC<EssentialDataProps> = ({
  baselineYear,
  onChange,
  onComplete,
}) => {
  const [population, setPopulation] = useState<number | null>(null);
  const [cityGDP, setCityGDP] = useState<number | null>(null);
  const [electricityDemand, setElectricityDemand] = useState<number | null>(
    null
  );
  const [heatingDemand, setHeatingDemand] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const allDataProvided =
    population !== null &&
    cityGDP !== null &&
    electricityDemand !== null &&
    heatingDemand !== null;

  useEffect(() => {
    if (allDataProvided) {
      setTimeout(() => {
        setIsCollapsed(true);
        onComplete();
      }, 300);
    }
  }, [allDataProvided, onComplete]);

  const handleBlur = (field: string) => (values: NumberFormatValues) => {
    if (!isNaN(values.floatValue)) {
      onChange(field, values.floatValue ?? 0);
    }
  };

  const commonProps = {
    sx: { m: 1, height: '30', '.MuiInputBase-root': { height: '30' } },
  };

  return (
    <Accordion
      expanded={!isCollapsed}
      onChange={() => setIsCollapsed(!isCollapsed)}
    >
      <AccordionSummary expandIcon={<ChevronDown />}>
        <Box display="flex" alignItems="center">
          <Typography variant="h6">Essential Data ({baselineYear})</Typography>
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
              <Typography variant="body2" gutterBottom>
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
              <Typography variant="body2" gutterBottom>
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
              <Typography variant="body2" gutterBottom>
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
              <Typography variant="body2" gutterBottom>
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
  );
};

export default EssentialData;
