import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

jest.mock('./pages/credits/Credits', () => ({
  Credits: () => <h1>Credits page</h1>,
}));

test('renders the page for the current route', () => {
  render(
    <MemoryRouter initialEntries={['/credits']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { name: /credits page/i })).toBeInTheDocument();
});
