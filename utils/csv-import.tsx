import Papa from 'papaparse';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

import measures from '@/mocks/measures.json';
import { convertStringToNumber, isStringNumber } from './numbers';

type Measures = typeof measures;

/**
 * When importing data, there's no way to infer the hierarchy of sections and
 * measures from the CSV file. And because some measures have the same label
 * (e.g. "Buses"), we need to recreate the data collection spreadsheet structure
 * manually. The texts and hierarchy should match the spreadsheet exactly.
 */
export const SPREADSHEET_STRUCTURE = {
  'Data - City input sheet': {
    'Demographic data': [],
    'Passenger transportation': {
      'Transportation need': {
        'Total transportation need - passenger transport': [],
        'Number of passengers per vehicle': [],
      },
      'Emission factors': {
        'Passenger car / motorcycle fleet (current average fleet)': [],
        'Buses (average fleet)': [],
      },
      'Passenger cars - other data': [],
      'Buses - other data': [],
    },
    'Freight transport (road)': {
      'Transportation need': {
        'Total transportation need within city - Road freight transport': [],
      },
      'Utilisation/loading': {
        'Average utilisation': [],
      },
      'Emission factors from transportation': {
        'Light duty trucks <3.5 tonnes': [],
        'Heavy duty trucks >3.5 tonnes': [],
      },
      'Other data': {
        'Number of trucks registered within city': [],
      },
    },

    Buildings: {
      'Existing building stock': {
        'Total floor area': [],
        'Energy use in existing buildings': [],
        'Renovation rate (building envelope)': [],
      },

      'New buildings': {
        'Building standards for new buildings': [],
      },
    },

    'Heating (of buildings)': {
      'Heat demand & production': {
        measures: [],
        'Heating technologies': [],
        'Share of district heating as': [],
        'Share of waste used in district heating that is fossil / non-fossil':
          [],
        'Share of local heating as': [],
      },

      'Emission factors from heat production': {
        'District heating': [],
        'Local heating': [],
      },
    },

    Electricity: {
      'Demand of electricity': {
        'Total demand': [],
        'Share of total electricity demand produced by fossil/renewables': [],
      },
      'Emission factors from electricity generation': [],
      Other: {
        measures: [],
        'Solar PV': [],
      },
    },
    Waste: {
      'Waste generation / collection': {
        'Total collected waste within city boundaries': [],
      },
      'Share recycling/incineration/landfill': {
        'Paper waste': [],
        'Metal waste': [],
        'Plastic waste': [],
        'Glass waste': [],
        'Organic waste': [],
        'Other waste (e.g. textiles, rubble, wood)': [],
      },
      'Emission factors from waste management': {
        Incineration: [],
      },
    },
    'Other price data': {
      'Energy prices': [],
    },

    'Greenhouse gases (CO2 emissions other greenhouse gases)': {
      'Total greenhouse emissions (GHG)': [],
      'Emissions from road transportation': [],
      'Emissions from buildings & heating': [],
      'Emissions from electricity': [],
      'Emissions from waste (including waste disposed of outside of city boundaries)':
        [],
      'Emissions from other sectors': [],
    },
  },

  'PART 2: City assumptions 2030': {
    'Key assumptions for levers': {
      '1. Passenger transportation levers': {
        '1.1 Reduced motorised passenger transportation need': [],
        '1.2 Shift to public and non-motorised transport': {
          'Reduced passenger kilometres by car through shift to public and non-motorised transport':
            [],
          'Share of car + motorcycle km reduced shifted towards other modes':
            [],
        },
        '1.3 Car pooling': [],
        '1.4.1 Electrification of passenger cars + motorcycles': [],
        '1.4.2 Electrification of buses': {
          'Expected procurement schedule for buses': [],
        },
      },
      '2. Freight transportation levers': {
        '2.1 Optimisation of logistics': {
          'Utilisation of trucks in decarbonisation scenario': [],
        },
        '2.2 Electrification of trucks': {
          'Light duty trucks <3.5 tonne': [],
          'Heavy duty trucks >3.5 tonne': [],
        },
      },
      '3. Buildings & heating': {
        '3.1 Buildings renovations (envelope)': {
          measures: [],
          'Assumed share of type of renovation in lever': [],
        },
        '3.2 Energy efficient new buildings': {
          measures: [],
          'Share of new buildings built with high energy efficiency standards':
            [],
        },
        '3.3 Efficient lighting & appliances': {
          measures: [],
          'Assumed share of type of efficiency programme for lever': [],
        },
        '3.4 Decarbonising heating': {
          'Heating technologies in 2030': [],
          'Share of district heating in 2030 as': [],
          'Share of waste in 2030 used in district heating that is fossil / non-fossil':
            [],
          'Share of local heating in 2030 as': [],
          'Share of current fossil production that would need to be re-invested in by 2030, if current production where to continue':
            [],
        },
      },
      '4. Electricity': {
        'Share renewable/fossil electricity production in 2030': [],
        'Distribution of type of new renewables': [],
      },
      '5. Waste': {
        '5.1. Increased recycling of waste': {
          'Treatement of paper, 2030': [],
          'Treatment of metals, 2030': [],
          'Treatment of plastics, 2030': [],
          'Treatment of glass, 2030': [],
          'Treatment of organic, 2030': [],
        },
      },
    },
    '5. Forestation': {
      'Number of planted trees until 2030': [],
      'Distribution between trees in grey and green area': [],
      'Population density outside city compared to inside city': [],
    },
    'Other (Emissions from other sectors: IPPU, AFOLU etc.)': {
      'Reduced CO2e emissions committed by Industry, Agriculture, etc. in Other sector':
        [],
    },
  },
};

const EXCLUDED_ROWS_BY_LABEL = [
  /^(Total)$/,
  /^(Legend for cell colour coding)$/,
  /^(Note\:)/,
];

const SPREADSHEET_PRIORITIES = ['High', 'Medium', 'Low'];

const isValidPriority = (priority: string) =>
  SPREADSHEET_PRIORITIES.includes(priority);

function getPossibleSectionPaths(
  currentSection: string[],
  nextSection: string
) {
  const possiblePaths = new Array(currentSection.length + 1)
    .fill(undefined)
    .map((_, i) => [
      ...currentSection.slice(0, currentSection.length - i),
      nextSection,
    ]);

  return possiblePaths;
}

type Measure = {
  label: string;
  value: number | null;
  comment: string | undefined;
};

type Error =
  | {
      message: string;
      row: Measure;
      type: 'MEASURE_ERROR';
    }
  | {
      message: string;
      type: 'GENERAL_ERROR';
    };

type ParsedCsvResponse = {
  measures: Measures;
  errors: Error[];
};

export function parseMeasuresCsv(csvData: string): ParsedCsvResponse {
  const parsedCsv = Papa.parse<string>(csvData);
  let clonedMeasureStructure = JSON.parse(
    JSON.stringify(SPREADSHEET_STRUCTURE)
  );
  let currentSection: string[] = [];
  let notFoundErrors: Measure[] = [];

  parsedCsv.data.forEach((rowValues) => {
    if (!rowValues) {
      return;
    }

    const label = rowValues[1]?.trim();
    const value = rowValues[3]?.trim();
    const priority = rowValues[7]?.trim();
    const comment = rowValues[8]?.trim();

    if (
      !label ||
      EXCLUDED_ROWS_BY_LABEL.some((excludedLabel) => label.match(excludedLabel))
    ) {
      return;
    }

    const isSection =
      label && !isStringNumber(value) && !isValidPriority(priority);

    if (isSection) {
      const possiblePaths = getPossibleSectionPaths(currentSection, label);
      const sectionPath = possiblePaths.find(
        (path) => !!get(clonedMeasureStructure, path)
      );

      if (sectionPath) {
        currentSection = sectionPath;
      }
    } else {
      const section = get(clonedMeasureStructure, currentSection);
      const sectionMeasures: any[] =
        section instanceof Array ? section : section?.measures;
      const measure = {
        label,
        value: isStringNumber(value) ? convertStringToNumber(value) : null,
        comment,
      };

      if (!(sectionMeasures instanceof Array)) {
        notFoundErrors.push(measure);
      } else {
        sectionMeasures.push(measure);
      }
    }
  });

  return {
    measures: clonedMeasureStructure,
    errors: [
      ...(isEqual(SPREADSHEET_STRUCTURE, clonedMeasureStructure)
        ? [
            {
              message: GENERAL_ERROR,
              type: 'GENERAL_ERROR',
            },
          ]
        : []),
      ...notFoundErrors.map((measure) => ({
        row: measure,
        message: NOT_FOUND_ERROR,
        type: 'MEASURE_ERROR',
      })),
    ] as Error[],
  };
}

const NOT_FOUND_ERROR = 'Failed to parse this one matey';
const GENERAL_ERROR = 'Unable to parse the file';
