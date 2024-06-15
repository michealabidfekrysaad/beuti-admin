/* eslint-disable no-useless-escape */
import {
  numbersPattern,
  emailPattern,
  containsSpecialCharacters,
  pricePattern,
  numbersPatternWithoutDash,
  containsCustomSpecialCharacters,
  onlyNums,
  noSpacesNoSpeicalChars,
} from 'constants/regex';

export const startsWith05 = (value) => value.toString().startsWith('05');
export const isPhoneLengthValid = (value) => value.toString().length === 10;
export const isNumbersOnly = (value) => numbersPattern.test(value);
export const isNumbersWithoutDash = (value) => numbersPatternWithoutDash.test(value);
export const onlyNumbers = (value) => onlyNums.test(value);
export const isPrice = (value) => pricePattern.test(value);
export const isValidEmail = (value) => emailPattern.test(value);
export const isValidName = (value) => !containsSpecialCharacters.test(value);
export const noEmptyFieldSpecificChars = (value) => noSpacesNoSpeicalChars.test(value);
export const noSpecialCharacters = (value) => !containsSpecialCharacters.test(value);
export const customSpecialCharactersAllowed = (value) =>
  !containsCustomSpecialCharacters.test(value);
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
export function validatePassword(input, setError) {
  if (input.trim().length < 8) {
    setError(true);
  } else {
    setError(false);
  }
}

export function validateLettersAndNumbersOnly(input, setError) {
  if (!isValidName(input)) {
    setError(true);
  } else {
    setError(false);
  }
}

export function customValidateLettersAndNumbersOnly(input, setError) {
  if (!customSpecialCharactersAllowed(input)) {
    setError(true);
  } else {
    setError(false);
  }
}
