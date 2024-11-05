import { v4 as guid } from 'uuid';

export function getUUID() {
 return guid();
}

export function generateId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return code;
}