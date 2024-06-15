/* eslint-disable no-useless-escape */
export const emailPattern = /^\w+(?:\.?|\-??\w+)*@\w+(?:\.?|\-??\w+)*(?:\.\w+)+$/;
export const specialCharacters = /[!@#$%^&*£(),.?":{}|<>]/;

export const pricePattern = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
export const numbersPattern = /^(\(?\+?[0-9]*\)?)?[0-9_ \(\)]*$/;
export const numbersPatternWithoutDash = /^(\(?\+?[0-9]*\)?)?[0-9\(\)]*$/;
export const onlyNums = /^[0-9]*$/;
export const containsSpecialCharacters = /[!@#$%^&*€¹²³¾½¾()_+\-=\[\]{};':"\\|,.<>\/?]/;
export const containsCustomSpecialCharacters = /[!#$%^&*€¹²³¾½¾+\=\[\]{};':"|<>?]/;
export const noSpacesNoSpeicalChars = /^(?!\s+$).[أ-ي a-zA-Z0-9.\-:/\\\\ ]*$/;
export const onlySpaces = /^\s*$/;
// export const containsSpecialCharacters = /([-!$%^&*()_+|~=`{}[:;<>?,.@#\]])+$/g;
// export const containsSpecialCharacters = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
