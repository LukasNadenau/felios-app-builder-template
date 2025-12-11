import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {

  it('should render without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });

  describe('Base Layout Components', () => {
    it('should always render the layout wrapper container', () => {
      const { container } = render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );

      const layoutWrapper = container.querySelector('.layout-wrapper');
      expect(layoutWrapper).toBeInTheDocument();
    });

    it('should always render the AppTopbar', () => {
      const { container } = render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );

      const topbar = container.querySelector('.layout-topbar');
      expect(topbar).toBeInTheDocument();
    });

    it('should always render the AppSidebar', () => {
      const { container } = render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );

      const sidebar = container.querySelector('.layout-sidebar');
      expect(sidebar).toBeInTheDocument();
    });

    it('should always render the AppFooter', () => {
      const { container } = render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );

      const footer = container.querySelector('.layout-footer');
      expect(footer).toBeInTheDocument();
    });

    it('should always render the main content container', () => {
      const { container } = render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );

      const mainContainer = container.querySelector('.layout-main-container');
      const main = container.querySelector('.layout-main');

      expect(mainContainer).toBeInTheDocument();
      expect(main).toBeInTheDocument();
    });

    it('should have all base layout components in correct hierarchy', () => {
      const { container } = render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );

      const layoutWrapper = container.querySelector('.layout-wrapper');
      expect(layoutWrapper).toBeInTheDocument();

      // Topbar should be direct child of layout-wrapper
      const topbar = layoutWrapper?.querySelector('.layout-topbar');
      expect(topbar).toBeInTheDocument();

      // Sidebar should be direct child of layout-wrapper
      const sidebar = layoutWrapper?.querySelector('.layout-sidebar');
      expect(sidebar).toBeInTheDocument();

      // Main container should be direct child of layout-wrapper
      const mainContainer = layoutWrapper?.querySelector('.layout-main-container');
      expect(mainContainer).toBeInTheDocument();

      // Main should be child of main container
      const main = mainContainer?.querySelector('.layout-main');
      expect(main).toBeInTheDocument();

      // Footer should be child of main container
      const footer = mainContainer?.querySelector('.layout-footer');
      expect(footer).toBeInTheDocument();
    });
  });
});
