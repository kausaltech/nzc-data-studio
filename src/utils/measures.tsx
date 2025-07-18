import type { ReactNode } from 'react';
import React from 'react';

import { DECIMAL_PRECISION_BY_UNIT, UNIT_LABELS } from '@/constants/units';
import type {
  MainSectionMeasuresFragment,
  MeasureFragmentFragment,
  MeasureTemplateFragmentFragment,
} from '@/types/__generated__/graphql';

import { createFilterByTypename } from './filter';

export type MeasureTemplates = NonNullable<
  MainSectionMeasuresFragment['descendants'][0]['measureTemplates']
>;

type BaseSectionOrMeasure = {
  id: string;
  name: string;
};

type SectionOrMeasure = MainSectionMeasuresFragment['descendants'][0];

export type Section = BaseSectionOrMeasure & {
  type: 'ACCORDION_SECTION' | 'SECTION';
  childSections: Section[];
  maxTotal: number | null;
  helpText: string | null;
  measureTemplates?: MeasureTemplateFragmentFragment[];
};

const filterMeasureTemplate =
  createFilterByTypename<MeasureTemplateFragmentFragment>('MeasureTemplate');

/**
 * Year bound measure templates represent a measure for a specific year.
 * We filter these measure templates so that they're between the baseline and target year.
 * This isn't the ideal solution, but we'll revisit this logic on the backend later.
 */
export function filterYearBoundMeasureTemplate(
  measureTemplate: MeasureTemplateFragmentFragment,
  baselineYear: number | null,
  targetYear: number | null
) {
  if (!measureTemplate.yearBound) {
    return true;
  }

  // Expect year bound measure templates to have a name like '2025'
  const numericName = parseInt(measureTemplate.name);

  if (!baselineYear || !targetYear) {
    return true;
  }

  if (isNaN(numericName)) {
    return false;
  }

  return numericName > baselineYear && numericName <= targetYear;
}

export function mapMeasureTemplatesToRows(
  mainSection: MainSectionMeasuresFragment,
  baselineYear: number | null,
  targetYear: number | null
) {
  function createChildren(sectionId: string, sections: SectionOrMeasure[]): Section[] {
    return sections
      .filter((section) => section.parent?.uuid === sectionId)
      .reduce<Section[]>((previousSections, section) => {
        const measureTemplates: MeasureTemplateFragmentFragment[] =
          section.measureTemplates?.filter(
            (measureTemplate) =>
              filterMeasureTemplate(measureTemplate) &&
              filterYearBoundMeasureTemplate(measureTemplate, baselineYear, targetYear)
          );

        const nextSection: Section = {
          id: section.uuid,
          name: section.name,
          childSections: createChildren(section.uuid, sections),
          type: section.parent?.uuid === mainSection.uuid ? 'ACCORDION_SECTION' : 'SECTION',
          maxTotal: section.maxTotal ?? null,
          helpText: section.helpText ?? null,
          measureTemplates,
        };

        return [...previousSections, nextSection];
      }, []);
  }

  return createChildren(mainSection.uuid, mainSection.descendants);
}

export function measureTemplateHasValue(measureTemplate: MeasureTemplates[0]) {
  return !!measureTemplate.measure?.dataPoints?.find((dataPoint) => {
    return typeof dataPoint.value === 'number';
  });
}

export function getMeasureValue(
  measureTemplate: MeasureTemplateFragmentFragment,
  baselineYear: number | null
) {
  const firstDataPoint = measureTemplate.measure?.dataPoints[0];

  if (firstDataPoint?.value == null) {
    return null;
  }

  if (baselineYear === null) {
    return firstDataPoint.value;
  }

  if (measureTemplate.measure?.dataPoints.length) {
    const measure = measureTemplate.measure.dataPoints.find(
      (dataPoint) => dataPoint.year === baselineYear
    );

    return measure?.value ?? firstDataPoint.value;
  }

  return null;
}

export function getMeasureFallback(
  measureTemplate: MeasureTemplateFragmentFragment,
  baselineYear: number | null
) {
  const firstDataPoint = measureTemplate.measure?.dataPoints[0];

  if (!firstDataPoint?.defaultValue) {
    return null;
  }

  if (baselineYear === null) {
    return firstDataPoint.defaultValue;
  }

  if (measureTemplate.measure?.dataPoints.length) {
    const measure = measureTemplate.measure.dataPoints.find(
      (dataPoint) => dataPoint.year === baselineYear
    );

    return measure?.defaultValue ?? firstDataPoint.defaultValue ?? undefined;
  }

  return null;
}

export type MeasureForDownloadV1 = {
  uuid: string;
  id: string;
  name: string;
  notes: string | null;
  value: number | null;
};

export type MeasureForDownloadV2 = MeasureFragmentFragment;

export type ExportedDataV1 = {
  version: 1;
  planName: string;
  measures: MeasureForDownloadV1[];
};

export type ExportedDataV2 = {
  version: 2;
  planName: string;
  baselineYear: number;
  measures: MeasureForDownloadV2[];
};

/**
 * TODO: This logic should be moved to the backend
 *
 * This function uses a predefined mapping (DECIMAL_PRECISION_BY_UNIT) to determine
 * the appropriate decimal precision for various units. If the unit is not found
 * in the mapping, it returns undefined.
 */
export function getDecimalPrecisionByUnit(unit: string): number | undefined {
  return DECIMAL_PRECISION_BY_UNIT[unit as keyof typeof DECIMAL_PRECISION_BY_UNIT] ?? undefined;
}

export function getUnitName(unit: string): ReactNode {
  const unitLabel = UNIT_LABELS[unit as keyof typeof UNIT_LABELS] ?? unit;

  if (!unitLabel.includes('/')) {
    return unitLabel;
  }

  // Ensure units are wrapped at slashes to avoid cell overflow
  return (
    <React.Fragment key={unit}>
      {unitLabel.split('/').map((part, i, parts) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <>
              <wbr />/
            </>
          )}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}

/**
 * Albeit hacky, year measures require slightly different formatting and can be
 * distinguished as the unit is empty and the measure label contains the word "year"
 */
export function isYearMeasure(measureLabel: string, unit: string) {
  if (unit === '' && measureLabel.toLowerCase().includes('year')) {
    return true;
  }

  return false;
}

function getMinMaxErrorMessage(minValue: number | null, maxValue: number | null) {
  if (typeof minValue === 'number' && typeof maxValue === 'number') {
    return `Please enter a value between ${minValue} and ${maxValue}`;
  }

  if (typeof minValue === 'number') {
    return `Please enter a value greater than or equal to ${minValue}`;
  }

  if (typeof maxValue === 'number') {
    return `Please enter a value less than or equal to ${maxValue}`;
  }

  return undefined;
}

export function validateMinMax(
  value: number | null,
  measureTemplate: MeasureTemplateFragmentFragment
): { valid: boolean; error?: string } {
  const { minValue = null, maxValue = null } = measureTemplate;

  if (value == null) {
    return { valid: true };
  }

  if (typeof minValue === 'number' && value < minValue) {
    return { valid: false, error: getMinMaxErrorMessage(minValue, maxValue) };
  }

  if (typeof maxValue === 'number' && value > maxValue) {
    return { valid: false, error: getMinMaxErrorMessage(minValue, maxValue) };
  }

  return { valid: true };
}
