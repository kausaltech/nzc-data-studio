import '@testing-library/jest-dom';
import { render, screen } from '@/utils/tests';
import { Logo } from '../Logo';

describe('Logo', () => {
  it('renders', () => {
    render(<Logo />);

    const heading = screen.getByText('NetZeroPlanner');

    expect(heading).toBeInTheDocument();
  });
});
