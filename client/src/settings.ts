export const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/'
    : 'https://api.portfolio.isidel.com/';

const MS_BASE_URL = 'https://api.marketstack.com/v1/';

export const MS_EOD_LATEST_BASE_URL = `${MS_BASE_URL}eod/latest/`;

export const MS_INTRADAY_LATEST_BASE_URL = `${MS_BASE_URL}intraday/latest/`;
