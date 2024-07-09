import {
  MainSectionMeasuresFragment,
  MeasureTemplate,
} from '@/types/__generated__/graphql';
import { createFilterTypename } from './filter';

type BaseSectionOrMeasure = {
  id: string;
  name: string;
};

export type Section = BaseSectionOrMeasure & {
  type: 'ACCORDION_SECTION' | 'SECTION';
  availableYears: number[] | null;
  childSections: Section[];
  measureTemplates?: MeasureTemplate[];
};

type SectionOrMeasure = MainSectionMeasuresFragment['descendants'][0];

export function mapMeasureTemplatesToRows(
  mainSection: MainSectionMeasuresFragment
) {
  function createChildren(
    sectionId: string,
    sections: SectionOrMeasure[]
  ): Section[] {
    return sections
      .filter((section) => section.parent?.id === sectionId)
      .reduce<Section[]>(
        (previousSections, section) => [
          ...previousSections,
          {
            id: section.id,
            name: section.name,
            childSections: createChildren(section.id, sections),
            type:
              section.parent?.id === mainSection.id
                ? 'ACCORDION_SECTION'
                : 'SECTION',

            availableYears:
              'availableYears' in section
                ? (section.availableYears as number[])
                : null,

            measureTemplates: section.measureTemplates?.filter(
              createFilterTypename<MeasureTemplate>('MeasureTemplate')
            ),
          },
        ],
        []
      );
  }

  return createChildren(mainSection.id, mainSection.descendants);
}
