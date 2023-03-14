const palindrome = require('../utils/palindrome')
test.skip('palindrome of santiago', () => {
  const result = palindrome('santiago')
  expect(result).toBe('ogaitnas')
})
