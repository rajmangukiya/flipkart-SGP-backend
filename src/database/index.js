import postgres from 'pg-promise';
import { development } from './config.js';

const database = postgres(development)

export {
  database
}