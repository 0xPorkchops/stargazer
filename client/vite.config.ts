import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
build: {
  outDir: '../build', // For Express to serve static React build files
  emptyOutDir: true,
},
server: {
  port: 5000, // Change this to your desired port
},
})
