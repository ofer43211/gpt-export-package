import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Custom render function that can be extended with providers
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options });
}

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
