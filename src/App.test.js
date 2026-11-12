import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import App from './App';

// Only the routing is tested here: the home page's 3D scene stays out
jest.mock('./pages/Home', () => ({
  Home: () => <h1>Home page</h1>,
}));

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

// The journey and the credits load on demand, so their headings show up a moment later
test('renders the page for the current route', async () => {
  render(
    <MemoryRouter initialEntries={['/credits']}>
      <App />
    </MemoryRouter>
  );

  expect(await screen.findByRole('heading', { name: /credits page/i })).toBeInTheDocument();
});

test('the home page renders right away', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /home page/i })).toBeInTheDocument();
});

test('old /resume links open the journey, keeping their filter', async () => {
  render(
    <MemoryRouter initialEntries={['/resume?show=studies']}>
      <App />
      <LocationSpy />
    </MemoryRouter>
  );

  expect(await screen.findByRole('heading', { name: /journey page/i })).toBeInTheDocument();
  expect(location.pathname).toBe('/journey');
  expect(location.search).toBe('?show=studies');
});
