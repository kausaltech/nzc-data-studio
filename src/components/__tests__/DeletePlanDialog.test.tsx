import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@/utils/tests';
import { DeletePlanDialog } from '../DeletePlanDialog';
import { DELETE_FRAMEWORK_CONFIG } from '@/queries/framework/delete-framework-config';
import { GET_FRAMEWORK_CONFIGS } from '@/queries/framework/get-framework-config';

const defaultProps = {
  open: true,
  planId: 'plan-1',
  planName: 'Test City',
  onClose: jest.fn(),
  onSuccess: jest.fn(),
};

const refetchMock = {
  request: { query: GET_FRAMEWORK_CONFIGS },
  result: { data: { framework: null } },
};

function renderDialog(
  props: Partial<typeof defaultProps> = {},
  mocks: Parameters<typeof render>[1]['mocks'] = []
) {
  return render(<DeletePlanDialog {...defaultProps} {...props} />, { mocks });
}

function getDeleteButton() {
  return screen.getByRole('button', { name: /delete plan/i });
}

function getInput() {
  return screen.getByRole('textbox');
}

describe('DeletePlanDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('renders the plan name in the dialog title', () => {
      renderDialog();
      expect(screen.getByText(/Delete "Test City"\?/)).toBeInTheDocument();
    });

    it('has an empty input field on open', () => {
      renderDialog();
      expect(getInput()).toHaveValue('');
    });

    it('has the Delete button disabled on open', () => {
      renderDialog();
      expect(getDeleteButton()).toBeDisabled();
    });
  });

  describe('name-matching confirm logic', () => {
    it('keeps Delete button disabled when typed value does not match plan name', () => {
      renderDialog();
      fireEvent.change(getInput(), { target: { value: 'wrong name' } });
      expect(getDeleteButton()).toBeDisabled();
    });

    it('enables Delete button when typed value exactly matches plan name', () => {
      renderDialog();
      fireEvent.change(getInput(), { target: { value: 'Test City' } });
      expect(getDeleteButton()).not.toBeDisabled();
    });

    it('enables Delete button when typed value matches after trimming whitespace', () => {
      renderDialog();
      fireEvent.change(getInput(), { target: { value: 'Test City ' } });
      expect(getDeleteButton()).not.toBeDisabled();
    });

    it('keeps Delete button disabled when typed value differs only by case', () => {
      renderDialog();
      fireEvent.change(getInput(), { target: { value: 'test city' } });
      expect(getDeleteButton()).toBeDisabled();
    });
  });

  describe('reset behaviour', () => {
    it('clears the typed text when the dialog is closed and reopened', () => {
      const { rerender } = renderDialog();
      fireEvent.change(getInput(), { target: { value: 'Test City' } });
      expect(getInput()).toHaveValue('Test City');

      rerender(
        <DeletePlanDialog {...defaultProps} open={false} />,
      );
      rerender(
        <DeletePlanDialog {...defaultProps} open={true} />,
      );

      expect(getInput()).toHaveValue('');
    });
  });

  describe('delete mutation', () => {
    const deleteMock = {
      request: {
        query: DELETE_FRAMEWORK_CONFIG,
        variables: { id: 'plan-1' },
      },
      result: {
        data: { deleteFrameworkConfig: { ok: true } },
      },
    };

    it('calls onSuccess with the plan id and shows success snackbar on successful deletion', async () => {
      const onSuccess = jest.fn();
      renderDialog({ onSuccess }, [deleteMock, refetchMock]);
      fireEvent.change(getInput(), { target: { value: 'Test City' } });
      fireEvent.click(getDeleteButton());
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith('plan-1');
        expect(screen.getByText(/"Test City" was deleted\./)).toBeInTheDocument();
      });
    });

    it('does not call onSuccess and shows error snackbar when mutation fails', async () => {
      const onSuccess = jest.fn();
      const errorMock = {
        request: {
          query: DELETE_FRAMEWORK_CONFIG,
          variables: { id: 'plan-1' },
        },
        error: new Error('Network error'),
      };
      renderDialog({ onSuccess }, [errorMock]);
      fireEvent.change(getInput(), { target: { value: 'Test City' } });
      fireEvent.click(getDeleteButton());
      await waitFor(() => {
        expect(
          screen.getByText('Failed to delete the plan. Please try again.')
        ).toBeInTheDocument();
      });
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('disables the Delete button while the mutation is in-flight', async () => {
      const delayedMock = { ...deleteMock, delay: 200 };
      renderDialog({}, [delayedMock, refetchMock]);
      fireEvent.change(getInput(), { target: { value: 'Test City' } });
      fireEvent.click(getDeleteButton());
      await waitFor(() => {
        expect(getDeleteButton()).toBeDisabled();
      });
    });
  });

  describe('null safety', () => {
    it('renders without crashing when planId and planName are null (dialog closed)', () => {
      renderDialog({ open: false, planId: null, planName: null });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
