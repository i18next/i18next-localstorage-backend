module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',

  rules: {
    'max-len': 'off',
    'padded-blocks': 'off',
    'react/prop-types': 'off',
    'no-constant-condition': 'off',
    'comma-dangle': ['error', 'never'],
    'arrow-body-style': ['warn', 'as-needed'],
    'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
    'no-param-reassign': 'off',
    'prefer-rest-params': 'off',
  },
  globals: {
    window: true,
    expect: false,
  },
};
