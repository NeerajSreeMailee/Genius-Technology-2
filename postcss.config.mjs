/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'autoplace'
    },
    ...(process.env.NODE_ENV === 'production' ? {
      'postcss-flexbugs-fixes': {},
      'postcss-preset-env': {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
        features: {
          'custom-properties': false,
        },
      },
    } : {}),
  },
};

export default config;