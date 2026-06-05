import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import RepositoryControls from '../components/RepositoryControls';

describe('RepositoryControls Component', () => {
  const defaultProps = {
    search: '',
    onSearch: vi.fn(),
    sortBy: 'updated',
    onSortChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input and sort dropdown', () => {
    render(<RepositoryControls {...defaultProps} />);
    expect(screen.getByPlaceholderText(/Filter repositories/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /sort repositories/i })).toBeInTheDocument();
  });

  it('calls onSearch when typing in the search input', () => {
    render(<RepositoryControls {...defaultProps} />);
    const input = screen.getByPlaceholderText(/Filter repositories/i);
    fireEvent.change(input, { target: { value: 'portfolio' } });
    expect(defaultProps.onSearch).toHaveBeenCalledWith('portfolio');
  });

  it('calls onSortChange when sort dropdown changes', () => {
    render(<RepositoryControls {...defaultProps} />);
    const select = screen.getByRole('combobox', { name: /sort repositories/i });
    fireEvent.change(select, { target: { value: 'stars' } });
    expect(defaultProps.onSortChange).toHaveBeenCalledWith('stars');
  });

  it('displays the current sort value', () => {
    render(<RepositoryControls {...defaultProps} sortBy="name" />);
    const select = screen.getByRole('combobox', { name: /sort repositories/i });
    expect(select.value).toBe('name');
  });

  it('shows all sort options', () => {
    render(<RepositoryControls {...defaultProps} />);
    expect(screen.getByRole('option', { name: /Stars/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Name/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Last Updated/i })).toBeInTheDocument();
  });

  it('reflects current search value in input', () => {
    render(<RepositoryControls {...defaultProps} search="react" />);
    const input = screen.getByPlaceholderText(/Filter repositories/i);
    expect(input.value).toBe('react');
  });
});
