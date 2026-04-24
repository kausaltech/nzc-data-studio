import '@testing-library/jest-dom';

// These packages use ESM-only builds that Jest (CJS mode) cannot parse.
// Mock the whole module to keep the import chain CJS-compatible.
jest.mock('next-auth/react', () => ({ useSession: jest.fn(() => ({ status: 'authenticated' })) }));
jest.mock('@/components/providers/SelectedPlanProvider', () => ({ usePlans: jest.fn() }));

import type { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import type { ProfileQuery } from '@/types/__generated__/graphql';
import { UserProfileContext, usePermissions } from '@/hooks/use-user-profile';
import { usePlans } from '@/components/providers/SelectedPlanProvider';

const mockUsePlans = usePlans as jest.MockedFunction<typeof usePlans>;

type SelectedPlan = NonNullable<ReturnType<typeof usePlans>['selectedPlan']>;

function makePlan(overrides: Partial<SelectedPlan> = {}): SelectedPlan {
  return {
    __typename: 'FrameworkConfig',
    id: 'plan-1',
    organizationName: 'Test City',
    baselineYear: 2020,
    targetYear: 2030,
    viewUrl: null,
    resultsDownloadUrl: null,
    instanceIdentifier: 'inst-1',
    isLocked: false,
    ...overrides,
  };
}

function makeProfile(overrides: {
  change?: boolean;
  creatableRelatedModels?: string[];
  userRoles?: string[];
  configs?: Array<{ id: string; change?: boolean; delete?: boolean }>;
} = {}): ProfileQuery {
  return {
    __typename: 'Query',
    me: null,
    framework: {
      __typename: 'Framework',
      id: 'fw-1',
      userRoles: overrides.userRoles ?? [],
      userPermissions: {
        __typename: 'UserPermissions',
        change: overrides.change ?? false,
        creatableRelatedModels: overrides.creatableRelatedModels ?? [],
      },
      configs: (overrides.configs ?? []).map((c) => ({
        __typename: 'FrameworkConfig' as const,
        id: c.id,
        userPermissions: {
          __typename: 'UserPermissions',
          view: true,
          change: c.change ?? false,
          delete: c.delete ?? false,
          actions: [],
          creatableRelatedModels: [],
          otherPermissions: [],
        },
      })),
    },
  };
}

function makeWrapper(loading = false, profile: ProfileQuery | null = null) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <UserProfileContext.Provider value={{ loading, profile }}>
        {children}
      </UserProfileContext.Provider>
    );
  };
}

describe('usePermissions', () => {
  beforeEach(() => {
    mockUsePlans.mockReturnValue({
      selectedPlanId: undefined,
      selectedPlan: null,
      allPlans: null,
      setSelectedPlanId: jest.fn(),
    });
  });

  describe('edit permission', () => {
    it('returns true when framework.userPermissions.change is true, even if plan is locked', () => {
      const plan = makePlan({ isLocked: true });
      mockUsePlans.mockReturnValue({ selectedPlanId: 'plan-1', selectedPlan: plan, allPlans: [plan], setSelectedPlanId: jest.fn() });
      const { result } = renderHook(() => usePermissions(), {
        wrapper: makeWrapper(false, makeProfile({ change: true })),
      });
      expect(result.current.edit).toBe(true);
    });

    it('returns false when framework.userPermissions.change is false', () => {
      const plan = makePlan();
      mockUsePlans.mockReturnValue({ selectedPlanId: 'plan-1', selectedPlan: plan, allPlans: [plan], setSelectedPlanId: jest.fn() });
      const { result } = renderHook(() => usePermissions(), {
        wrapper: makeWrapper(false, makeProfile({ change: false })),
      });
      expect(result.current.edit).toBe(false);
    });
  });

  describe('isLocked', () => {
    it('returns true when the selected plan has isLocked:true', () => {
      const plan = makePlan({ isLocked: true });
      mockUsePlans.mockReturnValue({ selectedPlanId: 'plan-1', selectedPlan: plan, allPlans: [plan], setSelectedPlanId: jest.fn() });
      const { result } = renderHook(() => usePermissions(), {
        wrapper: makeWrapper(false, makeProfile()),
      });
      expect(result.current.isLocked).toBe(true);
    });

    it('returns false when the selected plan has isLocked:false', () => {
      const plan = makePlan({ isLocked: false });
      mockUsePlans.mockReturnValue({ selectedPlanId: 'plan-1', selectedPlan: plan, allPlans: [plan], setSelectedPlanId: jest.fn() });
      const { result } = renderHook(() => usePermissions(), {
        wrapper: makeWrapper(false, makeProfile()),
      });
      expect(result.current.isLocked).toBe(false);
    });

    it('returns false when there is no selected plan', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: makeWrapper(false, makeProfile()),
      });
      expect(result.current.isLocked).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('returns true for a framework-admin user', () => {
      const plan = makePlan();
      mockUsePlans.mockReturnValue({ selectedPlanId: 'plan-1', selectedPlan: plan, allPlans: [plan], setSelectedPlanId: jest.fn() });
      const { result } = renderHook(() => usePermissions(), {
        wrapper: makeWrapper(false, makeProfile({ userRoles: ['framework-admin'] })),
      });
      expect(result.current.isAdmin).toBe(true);
    });

    it('returns true for a user with config-level delete permission (instance-admin)', () => {
      const plan = makePlan();
      mockUsePlans.mockReturnValue({ selectedPlanId: 'plan-1', selectedPlan: plan, allPlans: [plan], setSelectedPlanId: jest.fn() });
      const { result } = renderHook(() => usePermissions(), {
        wrapper: makeWrapper(false, makeProfile({ configs: [{ id: 'plan-1', delete: true }] })),
      });
      expect(result.current.isAdmin).toBe(true);
    });

    it('returns false when neither framework-admin nor config delete permission', () => {
      const plan = makePlan();
      mockUsePlans.mockReturnValue({ selectedPlanId: 'plan-1', selectedPlan: plan, allPlans: [plan], setSelectedPlanId: jest.fn() });
      const { result } = renderHook(() => usePermissions(), {
        wrapper: makeWrapper(false, makeProfile({ configs: [{ id: 'plan-1', delete: false }] })),
      });
      expect(result.current.isAdmin).toBe(false);
    });
  });

  describe('isLoading', () => {
    it('returns isLoading:true and all permission flags false while profile is loading', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: makeWrapper(true, null),
      });
      expect(result.current.isLoading).toBe(true);
      expect(result.current.edit).toBe(false);
      expect(result.current.create).toBe(false);
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.delete).toBe(false);
    });
  });

  describe('create permission', () => {
    it('returns true when "FrameworkConfig" is in creatableRelatedModels', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: makeWrapper(false, makeProfile({ creatableRelatedModels: ['FrameworkConfig'] })),
      });
      expect(result.current.create).toBe(true);
    });

    it('returns false when "FrameworkConfig" is not in creatableRelatedModels', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: makeWrapper(false, makeProfile({ creatableRelatedModels: [] })),
      });
      expect(result.current.create).toBe(false);
    });
  });
});
