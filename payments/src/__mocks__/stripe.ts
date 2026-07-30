  import {jest} from '@jest/globals';

export const stripe = {
  charges: {
    create: jest.fn<() => Promise<{ id: string }>>().mockResolvedValue({ id: 'test-charge-id' }),
  },
};  
