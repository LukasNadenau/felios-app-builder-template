import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render the welcome message', () => {
    render(<App />);

    const message = screen.getByText('Edit this file to start building your app!');
    expect(message).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});
