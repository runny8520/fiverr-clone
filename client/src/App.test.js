import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app navbar brand', () => {
  render(<App />);
  const linkElements = screen.getAllByText(/fiverr/i);
  expect(linkElements.length).toBeGreaterThan(0);
});
