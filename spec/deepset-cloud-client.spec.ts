
import { describe, it, expect } from 'vitest';
import { DeepsetCloudClient } from '../src/deepset-cloud-client';

describe('DeepsetCloudClient', () => {
  it('should initiated', () => {
    const client  = new DeepsetCloudClient({});
    expect(client).toBeDefined();
  });
});
