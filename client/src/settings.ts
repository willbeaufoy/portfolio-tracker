import {Currency} from './api';

export const API_BASE =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/'
    : 'https://api.portfolio.isidel.com/';

export const FX_API_BASE = 'https://api.exchangeratesapi.io/';

export const USER_CURRENCY: Currency = 'GBP';
