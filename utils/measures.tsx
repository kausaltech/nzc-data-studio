import {
  GetMeasureTemplatesQuery,
  MainSectionMeasuresFragment,
  MeasureTemplateFragmentFragment,
} from '@/types/__generated__/graphql';
import { createFilterByTypename } from './filter';
import { DECIMAL_PRECISION_BY_UNIT, UNIT_LABELS } from '@/constants/units';
import React, { ReactNode } from 'react';

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
  availableYears: number[] | null;
  childSections: Section[];
  measureTemplates?: MeasureTemplateFragmentFragment[];
};

export function mapMeasureTemplatesToRows(
  mainSection: MainSectionMeasuresFragment
) {
  function createChildren(
    sectionId: string,
    sections: SectionOrMeasure[]
  ): Section[] {
    return sections
      .filter((section) => section.parent?.uuid === sectionId)
      .reduce<Section[]>((previousSections, section) => {
        const measureTemplates: MeasureTemplateFragmentFragment[] =
          section.measureTemplates?.filter(
            createFilterByTypename<MeasureTemplateFragmentFragment>(
              'MeasureTemplate'
            )
          );

        const nextSection: Section = {
          id: section.uuid,
          name: section.name,
          childSections: createChildren(section.uuid, sections),
          type:
            section.parent?.uuid === mainSection.uuid
              ? 'ACCORDION_SECTION'
              : 'SECTION',

          availableYears:
            'availableYears' in section
              ? (section.availableYears as number[])
              : null,

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

  if (!firstDataPoint?.value) {
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

export type MeasureForDownload = {
  uuid: string;
  id: string;
  name: string;
  notes: string | null;
  value: number | null;
};

export function getMeasuresFromMeasureTemplates(
  measureTemplates: NonNullable<GetMeasureTemplatesQuery['framework']>,
  baselineYear: number | null
) {
  const allMeasureTemplates = [
    ...(measureTemplates.dataCollection?.descendants ?? []),
    ...(measureTemplates.futureAssumptions?.descendants ?? []),
  ];

  const measures = allMeasureTemplates.reduce<MeasureForDownload[]>(
    (measures, descendant) => [
      ...measures,
      ...descendant.measureTemplates.map((template) => ({
        uuid: template.uuid,
        id: template.id,
        name: template.name,
        notes: template.measure?.internalNotes ?? null,
        value: getMeasureValue(template, baselineYear),
      })),
    ],
    []
  );

  return measures;
}

/**
 * TODO: This logic should be moved to the backend
 *
 * This function uses a predefined mapping (DECIMAL_PRECISION_BY_UNIT) to determine
 * the appropriate decimal precision for various units. If the unit is not found
 * in the mapping, it returns undefined.
 */
export function getDecimalPrecisionByUnit(unit: string): number | undefined {
  return (
    DECIMAL_PRECISION_BY_UNIT[unit as keyof typeof DECIMAL_PRECISION_BY_UNIT] ??
    undefined
  );
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
        <>
          {part}
          {i < parts.length - 1 && (
            <>
              <wbr />/
            </>
          )}
        </>
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
