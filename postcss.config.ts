import { Config } from 'postcss-load-config';

const config: Config = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};

export default config;