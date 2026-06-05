import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import HeroSearch from '../components/HeroSearch';

describe('HeroSearch Component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    localStorage.clear();
  });

  it('renders the title and search elements', () => {
    render(<HeroSearch onSearch={mockOnSearch} isLoading={false} />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter GitHub username/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('search button is disabled when input is empty', () => {
    render(<HeroSearch onSearch={mockOnSearch} isLoading={false} />);
    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeDisabled();
  });

  it('enables search button when input has value', async () => {
    render(<HeroSearch onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByPlaceholderText(/Enter GitHub username/i);
    await userEvent.type(input, 'octocat');
    const button = screen.getByRole('button', { name: /search/i });
    expect(button).not.toBeDisabled();
  });

  it('calls onSearch with trimmed username on form submit', async () => {
    const { container } = render(<HeroSearch onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByPlaceholderText(/Enter GitHub username/i);
    await userEvent.type(input, '  octocat  ');
    const form = container.querySelector('#search-form');
    fireEvent.submit(form);
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('octocat');
    });
  });

  it('shows loading state when isLoading is true', () => {
    render(<HeroSearch onSearch={mockOnSearch} isLoading={true} />);
    expect(screen.getByText(/Searching/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /searching/i })).toBeDisabled();
  });

  it('saves search to localStorage and displays recent searches', async () => {
    const { container } = render(<HeroSearch onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByPlaceholderText(/Enter GitHub username/i);

    await userEvent.type(input, 'torvalds');
    const form = container.querySelector('#search-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByLabelText(/recently searched users/i)).toBeInTheDocument();
      expect(screen.getByText('torvalds')).toBeInTheDocument();
    });
  });

  it('limits recent searches to 5 entries', async () => {
    // Pre-populate localStorage
    localStorage.setItem(
      'github_recent_searches',
      JSON.stringify(['user1', 'user2', 'user3', 'user4', 'user5'])
    );

    const { container } = render(<HeroSearch onSearch={mockOnSearch} isLoading={false} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/recently searched users/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Enter GitHub username/i);
    await userEvent.type(input, 'user6');
    const form = container.querySelector('#search-form');
    fireEvent.submit(form);

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('github_recent_searches'));
      expect(stored.length).toBeLessThanOrEqual(5);
      expect(stored[0]).toBe('user6');
    });
  });

  it('does not add duplicate to recent searches', async () => {
    localStorage.setItem('github_recent_searches', JSON.stringify(['octocat']));
    const { container } = render(<HeroSearch onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(/Enter GitHub username/i);
    await userEvent.type(input, 'octocat');
    const form = container.querySelector('#search-form');
    fireEvent.submit(form);

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('github_recent_searches'));
      const count = stored.filter((s) => s === 'octocat').length;
      expect(count).toBe(1);
    });
  });
});
