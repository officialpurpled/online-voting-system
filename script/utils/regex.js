export function validateInput(input) {
  // 1. Remove all spaces and convert to uppercase for consistency
  const cleanRegNo = input.replace(/\s+/g, '').toUpperCase();

  // 2. Test against the regex pattern
  const jambRegex = /^\d{12}[A-Z]{2}$/;
  const oouFtRegex = /^[A-Z]{3,}\/\d{2}\/\d{2}\/\d{4}$/;

  if (jambRegex.test(cleanRegNo) || oouFtRegex.test(cleanRegNo)) {
    return { isValid: true, formatted: cleanRegNo };
  } else {
    return { isValid: false, formatted: input };
  }
}

// let matricNo = 'qwe/2/23/2017'
// matricNo = '202330245104ea'

// // const regex = /^[a-z]{3,}\/\d{2}\/\d{2}\/\d{4}$/i;
// const validation = validateInput(matricNo);

// if (validation.isValid) {
//   console.log(`Valid JAMB Number! Saved as: ${validation.formatted}`, validation);
// } else {
//   console.log("Invalid JAMB Registration Number format. Please check it and try again.");
// }