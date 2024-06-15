/* eslint-disable no-useless-escape */
import { numbersPattern, emailPattern, specialCharacters } from 'constants/regex';

export const startsWith05 = (value) => value.toString().startsWith('05');
export const isPhoneLengthValid = (value) => value.toString().length === 10;
export const isNumbersOnly = (value) => numbersPattern.test(value);
export const isValidEmail = (value) => emailPattern.test(value);
export const containsSpecialCharacters = (value) => specialCharacters.test(value);

/**
 * @name validateInput
 * validates email or phone depending on user's input
 * @export
 * @param {*} input
 * @param {*} setError
 */
export function validateInput(input, setError) {
  setError(false);
  if (isNumbersOnly(input)) {
    if (!startsWith05(input.trim()) || !isPhoneLengthValid(input.trim())) {
      setError(true);
    }
  } else if (!isValidEmail(input.trim())) {
    setError(true);
  }
}

/**
 * @name validatePassword
 * Validates password length
 * @export
 * @param {string} input
 * @param {function} setError
 */
export function validatePassword(input, setError) {
  if (input.trim().length < 8) {
    setError(true);
  } else {
    setError(false);
  }
}
export function confirmPassword(input, match, setError) {
  if (input !== match) {
    setError(true);
  } else {
    setError(false);
  }
}
