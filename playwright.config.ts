import { defineConfig } from 'playwright/test';
import dotenv from 'dotenv';
import path from 'path'; 

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  // timeout: 100000,
  // workers: 1
});