import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
// Menggunakan vitest untuk fungsi describe/it/expect (bukan Jest).

// NOTE: Root Remix component memerlukan data router context; untuk smoke test
// cukup gunakan komponen dummy yang mewakili environment React berjalan.
const Dummy: React.FC = () => <div data-testid="dummy">ok</div>;

describe('Environment', () => {
  it('renders react component', () => {
    const { getByTestId } = render(<Dummy />);
    expect(getByTestId('dummy').textContent).toBe('ok');
  });
});
