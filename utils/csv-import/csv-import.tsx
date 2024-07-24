/**
 * When importing data, there's no way to infer the hierarchy of sections and
 * measures from the CSV file. And because some measures have the same label
 * (e.g. "Buses"), we need to recreate the data collection spreadsheet structure
 * manually. legacy-measure-map.json defines the list of full measures im the data
 * collection Excel, along with the parent section name and corresponding UUID
 * of the measure in the database.
 */

import Papa from 'papaparse';

import legacyMeasureMap from './legacy-measure-map.json';
import { convertStringToNumber, isStringNumber } from '../numbers';

const NOT_FOUND_ERROR = 'Unable to parse the row.';
const GENERAL_ERROR = 'Unable to parse the file.';
const SPREADSHEET_PRIORITIES = ['High', 'Moderate', 'Low'];
const EXCLUDED_ROWS_BY_LABEL = [
  /^(Total)$/,
  /^(Legend for cell colour coding)$/,
  /^(Note\:)/,
  /^(Total emissions \(scope 1 & scope 2; scope 3 only for waste disposed of outside city boundaries\))/,
  /^(Total emissions from road transport)/,
];
// Some measures from the original excel have missing priorities, avoid using these to determine if a row is a section
const EXPECTED_INVALID_PRIORITY = [
  'Reduction of total distance travelled through route optimisation',
];

const isValidPriority = (priority: string) =>
  SPREADSHEET_PRIORITIES.includes(priority);

type ImportedMeasure = {
  label: string;
  value: number | null;
  comment: string | undefined;
};

type Error =
  | {
      message: string;
      row: ImportedMeasure;
      type: 'MEASURE_ERROR';
    }
  | {
      message: string;
      type: 'GENERAL_ERROR';
    };

type ImportedMeasureMap = Map<string, ImportedMeasure>;

export type ParsedCsvResponse = {
  measures: ImportedMeasureMap;
  errors: Error[];
};

export function parseMeasuresCsv(csvData: string): ParsedCsvResponse {
  const parsedCsv = Papa.parse<string>(csvData);
  let currentSection: string | null = null;
  let measuresNotFound: ImportedMeasure[] = [];
  let measureValueMap = new Map<string, ImportedMeasure>();

  parsedCsv.data.forEach((rowValues) => {
    if (!rowValues) {
      return;
    }

    const label = rowValues[1]?.trim();
    const unit = rowValues[2]?.trim();
    const strValue = rowValues[3]?.trim();
    const priority = rowValues[7]?.trim();
    const comment = rowValues[8]?.trim();
    const value = isStringNumber(strValue)
      ? convertStringToNumber(strValue)
      : null;

    if (
      !label ||
      EXCLUDED_ROWS_BY_LABEL.some((excludedLabel) => label.match(excludedLabel))
    ) {
      return;
    }

    const isSection =
      unit === '' ||
      (!isValidPriority(priority) &&
        !EXPECTED_INVALID_PRIORITY.includes(label));

    if (isSection) {
      currentSection = label;
      return;
    }

    const matchesByName = legacyMeasureMap.filter(
      (measure) => measure.name === label
    );

    const importedMeasure = { label, value, comment };

    if (matchesByName.length === 1) {
      measureValueMap.set(matchesByName[0].uuid, importedMeasure);
    } else if (matchesByName.length === 0) {
      measuresNotFound.push(importedMeasure);
    } else {
      // Multiple measures found with the same name, filter by parent section
      const measure = matchesByName.find(
        (measure) => measure.parentSection === currentSection
      );

      if (measure) {
        measureValueMap.set(measure.uuid, importedMeasure);
      } else {
        measuresNotFound.push(importedMeasure);
      }
    }
  });

  const generalError: Error = {
    message: GENERAL_ERROR,
    type: 'GENERAL_ERROR',
  };

  const measureErrors: Error[] = measuresNotFound.map((measure) => ({
    row: measure,
    message: NOT_FOUND_ERROR,
    type: 'MEASURE_ERROR',
  }));

  return {
    measures: measureValueMap,
    errors: [
      ...(measureValueMap.size === 0 ? [generalError] : []),
      ...measureErrors,
    ],
  };
}
