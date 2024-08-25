import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from "dotenv";
const environment = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${environment}` });
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
