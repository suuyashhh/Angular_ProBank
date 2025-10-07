import { defineConfig } from 'vite'; 
 
export default defineConfig({ 
  server: { 
    port: 4200, 
    open: true, 
    fs: { 
      allow: ['.'] // allow serving project files 
    } 
    // Angular SPA routing works without `historyApiFallback` in dev 
  }, 
  build: { 
    outDir: 'dist', 
  } 
});