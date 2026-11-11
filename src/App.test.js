import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import App from './App';

jest.mock('./pages/credits/Credits', () => ({
  Credits: () => <h1>Credits page</h1>,
}));

jest.mock('./pages/journey/Journey', () => ({
  Journey: () => <h1>Journey page</h1>,
}));

let location;
function LocationSpy() {
  location = useLocation();
  return null;
}

test('renders the page for the current route', () => {
  render(
    <MemoryRouter initialEntries={['/credits']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /credits page/i })).toBeInTheDocument();
});

test('old /resume links open the journey, keeping their filter', () => {
  render(
    <MemoryRouter initialEntries={['/resume?show=studies']}>
      <App />
      <LocationSpy />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /journey page/i })).toBeInTheDocument();
  expect(location.pathname).toBe('/journey');
  expect(location.search).toBe('?show=studies');
});
