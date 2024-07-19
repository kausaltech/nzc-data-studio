import {
  MainSectionMeasuresFragment,
  MeasureTemplateFragmentFragment,
} from '@/types/__generated__/graphql';
import { createFilterTypename } from './filter';

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
            createFilterTypename<MeasureTemplateFragmentFragment>(
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
