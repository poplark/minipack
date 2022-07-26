import { log } from './utils/log.js';

export function add(a, b) {
  const result = a + b;
  log(result);
  return result;
}
