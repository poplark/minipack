import { print } from './utils/print.js';
import { log } from './utils/log.js';

export function add(a, b) {
  const result = a + b;
  print(result);
  log(result);
  return result;
}
