/** @type {import("prettier").Options} */
module.exports = {
  useTabs: false,
  printWidth: 80,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'none',
  semi: true,
  plugins: [
    require.resolve('prettier-plugin-tailwindcss'),
    require.resolve('prettier-plugin-organize-imports')
  ]
};
