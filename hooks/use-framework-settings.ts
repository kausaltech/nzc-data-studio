import { useSuspenseQuery } from '@apollo/client';
import { GET_FRAMEWORK_SETTINGS } from '@/queries/framework/get-framework-settings';
import { GetFrameworkSettingsQuery } from '@/types/__generated__/graphql';

export function useSuspenseFrameworkSettings() {
  return useSuspenseQuery<GetFrameworkSettingsQuery>(GET_FRAMEWORK_SETTINGS);
}

export function useDefaultTargetYear() {
  const result = useSuspenseFrameworkSettings();

  return result.data?.framework?.defaults.targetYear.default ?? null;
}
