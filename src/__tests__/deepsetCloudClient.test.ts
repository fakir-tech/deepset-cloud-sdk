import { Greeter, initialize } from '../index';

test('Initialize', () => {
  const client = initialize({});
  expect(client).not.toBe(null);
  // expect(Greeter('Carl')).toBe('Hello Carl');
});
