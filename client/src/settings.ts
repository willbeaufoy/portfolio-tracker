export const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/'
    : 'https://portfolio-api.eba-ef93xgpm.us-west-2.elasticbeanstalk.com/';

export const MS_EOD_LATEST_BASE_URL =
  'https://api.marketstack.com/v1/eod/latest/';
