import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@/utils/tests';
import { PlanActionsMenu } from '../PlanActionsMenu';
import { SET_INSTANCE_LOCKED } from '@/queries/framework/lock-framework-config';

const defaultProps = {
  planId: 'plan-1',
  instanceIdentifier: 'inst-1',
  planName: 'Test City',
  isLocked: false,
  canCreate: false,
  isAdmin: false,
  onCreateClick: jest.fn(),
  onDeleteClick: jest.fn(),
};

function renderMenu(
  props: Partial<typeof defaultProps> = {},
  mocks: Parameters<typeof render>[1]['mocks'] = []
) {
  return render(<PlanActionsMenu {...defaultProps} {...props} />, { mocks });
}

function openMenu() {
  fireEvent.click(screen.getByRole('button'));
}

describe('PlanActionsMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('menu visibility', () => {
    it('renders the three-dot button and menu is closed initially', () => {
      renderMenu();
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('shows "Create new plan" but hides lock and delete when canCreate=true, isAdmin=false', () => {
      renderMenu({ canCreate: true });
      openMenu();
      expect(screen.getByText('Create new plan')).toBeInTheDocument();
      expect(screen.queryByText(/Lock plan|Unlock plan/)).not.toBeInTheDocument();
      expect(screen.queryByText('Delete plan')).not.toBeInTheDocument();
    });

    it('hides "Create new plan" and shows lock and delete when canCreate=false, isAdmin=true', () => {
      renderMenu({ isAdmin: true });
      openMenu();
      expect(screen.queryByText('Create new plan')).not.toBeInTheDocument();
      expect(screen.getByText('Lock plan')).toBeInTheDocument();
      expect(screen.getByText('Delete plan')).toBeInTheDocument();
    });

    it('shows all three items when canCreate=true, isAdmin=true', () => {
      renderMenu({ canCreate: true, isAdmin: true });
      openMenu();
      expect(screen.getByText('Create new plan')).toBeInTheDocument();
      expect(screen.getByText('Lock plan')).toBeInTheDocument();
      expect(screen.getByText('Delete plan')).toBeInTheDocument();
    });

    it('shows no menu items when canCreate=false, isAdmin=false', () => {
      renderMenu();
      openMenu();
      expect(screen.queryByText('Create new plan')).not.toBeInTheDocument();
      expect(screen.queryByText(/Lock plan|Unlock plan/)).not.toBeInTheDocument();
      expect(screen.queryByText('Delete plan')).not.toBeInTheDocument();
    });

    it('hides lock item but shows delete when isAdmin=true and instanceIdentifier is undefined', () => {
      renderMenu({ isAdmin: true, instanceIdentifier: undefined });
      openMenu();
      expect(screen.queryByText(/Lock plan|Unlock plan/)).not.toBeInTheDocument();
      expect(screen.getByText('Delete plan')).toBeInTheDocument();
    });
  });

  describe('lock item label', () => {
    it('shows "Lock plan" when isLocked=false', () => {
      renderMenu({ isAdmin: true, isLocked: false });
      openMenu();
      expect(screen.getByText('Lock plan')).toBeInTheDocument();
    });

    it('shows "Unlock plan" when isLocked=true', () => {
      renderMenu({ isAdmin: true, isLocked: true });
      openMenu();
      expect(screen.getByText('Unlock plan')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('opens the menu when the three-dot button is clicked', () => {
      renderMenu({ canCreate: true });
      openMenu();
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('calls onCreateClick and closes menu when "Create new plan" is clicked', () => {
      const onCreateClick = jest.fn();
      renderMenu({ canCreate: true, onCreateClick });
      openMenu();
      fireEvent.click(screen.getByText('Create new plan'));
      expect(onCreateClick).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('calls onDeleteClick and closes menu when "Delete plan" is clicked', () => {
      const onDeleteClick = jest.fn();
      renderMenu({ isAdmin: true, onDeleteClick });
      openMenu();
      fireEvent.click(screen.getByText('Delete plan'));
      expect(onDeleteClick).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('closes the menu on Escape without calling any callback', () => {
      const onCreateClick = jest.fn();
      const onDeleteClick = jest.fn();
      renderMenu({ canCreate: true, isAdmin: true, onCreateClick, onDeleteClick });
      openMenu();
      fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
      expect(onCreateClick).not.toHaveBeenCalled();
      expect(onDeleteClick).not.toHaveBeenCalled();
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('lock mutation', () => {
    const lockMock = {
      request: {
        query: SET_INSTANCE_LOCKED,
        variables: { instanceId: 'inst-1', isLocked: true },
      },
      result: {
        data: { setInstanceLocked: { __typename: 'SetInstanceLockedResult' } },
      },
    };

    const unlockMock = {
      request: {
        query: SET_INSTANCE_LOCKED,
        variables: { instanceId: 'inst-1', isLocked: false },
      },
      result: {
        data: { setInstanceLocked: { __typename: 'SetInstanceLockedResult' } },
      },
    };

    it('fires SetInstanceLocked with isLocked:true and shows success snackbar on lock', async () => {
      renderMenu({ isAdmin: true, isLocked: false }, [lockMock]);
      openMenu();
      fireEvent.click(screen.getByText('Lock plan'));
      await waitFor(() => {
        expect(screen.getByText(/"Test City" locked/)).toBeInTheDocument();
      });
    });

    it('fires SetInstanceLocked with isLocked:false and shows success snackbar on unlock', async () => {
      renderMenu({ isAdmin: true, isLocked: true }, [unlockMock]);
      openMenu();
      fireEvent.click(screen.getByText('Unlock plan'));
      await waitFor(() => {
        expect(screen.getByText(/"Test City" unlocked/)).toBeInTheDocument();
      });
    });

    it('shows error snackbar when the mutation fails', async () => {
      const errorMock = {
        request: {
          query: SET_INSTANCE_LOCKED,
          variables: { instanceId: 'inst-1', isLocked: true },
        },
        error: new Error('Network error'),
      };
      renderMenu({ isAdmin: true, isLocked: false }, [errorMock]);
      openMenu();
      fireEvent.click(screen.getByText('Lock plan'));
      await waitFor(() => {
        expect(
          screen.getByText('Failed to update plan lock status. Please try again.')
        ).toBeInTheDocument();
      });
    });

    it('disables the three-dot button while the mutation is in-flight', async () => {
      const delayedMock = { ...lockMock, delay: 200 };
      renderMenu({ isAdmin: true, isLocked: false }, [delayedMock]);
      openMenu();
      fireEvent.click(screen.getByText('Lock plan'));
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeDisabled();
      });
    });
  });
});
