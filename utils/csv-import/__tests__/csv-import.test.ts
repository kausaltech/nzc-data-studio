import csv from '../__mocks__/data-request.csv';
import { parseMeasuresCsv } from '..';
import { EXPECTED_MEASURES } from '../__mocks__/data-request-parsed-result';

describe('parseMeasuresCsv', () => {
  it('parses the mock csv file correctly', () => {
    expect(parseMeasuresCsv(csv).measures).toMatchObject(EXPECTED_MEASURES);
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
          message: 'Unable to parse the file.',
          type: 'GENERAL_ERROR',
        },
      ],
      measures: new Map(),
    };

    expect(parseMeasuresCsv(INPUT)).toMatchObject(OUTPUT);
  });

  it("returns an error for rows that weren't matched with measures", () => {
    const INPUT = `
    ,Population,Capita,"  820,000 ","  820,000 ","  801,545 ","  820,000 ",High,,,,,,
    ,This measure does not exist,% per year,0.2%,0.2%,,,High,,,,,,
    `;

    const OUTPUT = {
      errors: [
        {
          message: 'Unable to parse the row.',
          type: 'MEASURE_ERROR',
        },
      ],
      measures: new Map([
        [
          '3779efa4-9eb0-4f4b-b5d5-eb510461bed8',
          {
            comment: '',
            label: 'Population',
            value: 820000,
          },
        ],
      ]),
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
          message: 'Unable to parse the file.',
          type: 'GENERAL_ERROR',
        },
      ],
      measures: new Map(),
    };

    expect(parseMeasuresCsv(INPUT)).toMatchObject(OUTPUT);
  });
});
