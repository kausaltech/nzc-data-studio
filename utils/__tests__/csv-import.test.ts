import csv from '../__mocks__/data-request.csv';
import expectedResult from '../__mocks__/data-request-parsed-result.json';
import { SPREADSHEET_STRUCTURE, parseMeasuresCsv } from '../csv-import';

describe('parseMeasuresCsv', () => {
  it('parses the mock csv file correctly', () => {
    expect(parseMeasuresCsv(csv)).toMatchObject(expectedResult);
  });

  it('ignores empty rows', () => {
    const INPUT = `
    ,,,,,,,,
    ,,,,,,,,
    ,,,,,,,,
    ,,,,,,,,
    `;

    const OUTPUT = {
      errors: [
        {
          message: 'Unable to parse the file',
          type: 'GENERAL_ERROR',
        },
      ],
      measures: SPREADSHEET_STRUCTURE,
    };

    expect(parseMeasuresCsv(INPUT)).toMatchObject(OUTPUT);
  });

  it('ignores invalid sections', () => {
    const INPUT = `
    ,Data - City input sheet,Preferred unit,Data used in model,Pre-filled data (do not change this value),Source of pre-filled data,Data to be filled in by city,Priority for city to fill in,Source of data filled in by city,Comment,,,,
    ,,,,,,,,,,,,,
    ,,,,,,,,,,,,,
    ,Demographic data,,,Pre-filled data (do not change this value),,Fill city specific data here,,Add source here,Comment,,,,
    ,Population,Capita,"  820,000 ","  820,000 ","  801,545 ","  820,000 ",High,,,,,,
    ,NOT A REAL SECTION,,,,,,,,,,,,
    ,Expected annual population growth (up until 2030),% per year,0.2%,0.2%,,,High,,,,,,
    `;

    const OUTPUT = {
      errors: [],
      measures: {
        ...SPREADSHEET_STRUCTURE,
        'Data - City input sheet': {
          ...SPREADSHEET_STRUCTURE['Data - City input sheet'],
          'Demographic data': [
            {
              label: 'Population',
              value: 820000,
              comment: '',
            },
            {
              label: 'Expected annual population growth (up until 2030)',
              value: 0.2,
              comment: '',
            },
          ],
        },
      },
    };

    expect(parseMeasuresCsv(INPUT)).toMatchObject(OUTPUT);
  });

  it('fails if a measure is under the wrong section', () => {
    const INPUT = `
    ,Passenger transportation,,,,,,,Add source here,Comment,,,,
    ,Transportation need,,,,,,,,,,,,
    ,THIS IS THE WRONG SUB SECTION,,,,,,,,,,,,
    ,Transport need - passenger cars + motorcycles,Million passenger-kilometers / year,"  3,003 ","  3,003 ","  2,935 ",,High,,,,,,
    `;

    const OUTPUT = {
      errors: [
        { message: 'Unable to parse the file', type: 'GENERAL_ERROR' },
        {
          message: 'Failed to parse this one matey',
          type: 'MEASURE_ERROR',
          row: {
            comment: '',
            label: 'Transport need - passenger cars + motorcycles',
            value: 3003,
          },
        },
      ],
      measures: SPREADSHEET_STRUCTURE,
    };

    expect(parseMeasuresCsv(INPUT)).toMatchObject(OUTPUT);
  });

  it('fails with a general error if the content is gobbledygook', () => {
    const INPUT = `
    ,Bloop,,,,,,,,,,,,
    ,,Burp,,,,,,,,,,,
    ,,,Shibbedy,,Bop,,,,,,,,
    ,,,,Foop,,Bar,,,,,,
    `;

    const OUTPUT = {
      errors: [
        {
          message: 'Unable to parse the file',
          type: 'GENERAL_ERROR',
        },
      ],
      measures: SPREADSHEET_STRUCTURE,
    };

    expect(parseMeasuresCsv(INPUT)).toMatchObject(OUTPUT);
  });
});
