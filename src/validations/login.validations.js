import {
  isValidEmail,
  isNumbersOnly,
  startsWith05,
  isPhoneLengthValid,
} from 'functions/validate';

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
