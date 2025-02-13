import { AssertionError } from 'assert';
import core from './index';
import { describe, expect, it } from 'vitest';

describe('core', () => {
  it('default', async () => {
    const actual = await core.generatePassword(16);
    expect(actual?.length).toBe(16);
    expect(actual).toMatch(/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/);
  });

  it('only digits', async () => {
    const actual = await core.generatePasswordWithOptions({
      length: 18,
      includeUpperCase: false,
      includeLowerCase: false,
      includeDigits: true,
      includeSymbols: false,
    });
    expect(actual?.length).toBe(18);
    expect(actual).toMatch(/^[0-9]+$/);
  });

  it('invalid options', async () => {
    expect(await core.generatePasswordWithOptions({
      length: 18,
      includeUpperCase: false,
      includeLowerCase: false,
      includeDigits: false,
      includeSymbols: false,
    })).toBeUndefined();
  });
});
