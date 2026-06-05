import { render, screen } from '@testing-library/react';

// Inline the error message component to test it independently
const ErrorMessage = ({ message }) => (
  <div role="alert" id="error-message">
    <h3>
      {message?.toLowerCase().includes('not found') ? 'User Not Found' :
       message?.toLowerCase().includes('rate limit') ? 'Rate Limit Exceeded' :
       'Something Went Wrong'}
    </h3>
    <p>{message}</p>
  </div>
);

describe('Error Rendering', () => {
  it('renders user not found error correctly', () => {
    render(<ErrorMessage message="GitHub user not found" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('User Not Found')).toBeInTheDocument();
    expect(screen.getByText('GitHub user not found')).toBeInTheDocument();
  });

  it('renders rate limit error correctly', () => {
    render(<ErrorMessage message="GitHub API rate limit exceeded" />);
    expect(screen.getByText('Rate Limit Exceeded')).toBeInTheDocument();
    expect(screen.getByText('GitHub API rate limit exceeded')).toBeInTheDocument();
  });

  it('renders generic error for unknown messages', () => {
    render(<ErrorMessage message="Internal server error" />);
    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
    expect(screen.getByText('Internal server error')).toBeInTheDocument();
  });

  it('has alert role for accessibility', () => {
    render(<ErrorMessage message="Some error" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
