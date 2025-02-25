import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa'
import path from "path";
import checker from 'vite-plugin-checker'

const manifestForPlugIn = {
  registerType:'prompt',
  includeAssets:['favicon.ico', "apple-touc-icon.png", "masked-icon.svg"],
  manifest:{
    name:"React-vite-app",
    short_name:"react-vite-app",
    description:"I am a simple vite app",
    icons:[{
      src: '/itachi.jpeg',
      sizes:'192x192',
      type:'image/jpeg',
      purpose:'favicon'
    },
    {
      src:'/itachi.jpeg',
      sizes:'512x512',
      type:'image/jpeg',
      purpose:'favicon'
    },
    // {
    //   src: '/apple-touch-icon.png',
    //   sizes:'180x180',
    //   type:'image/png',
    //   purpose:'apple touch icon',
    // },
    {
      src: '/itachi.jpeg',
      sizes:'512x512',
      type:'image/jpeg',
      purpose:'any maskable',
    }
  ],
  theme_color:'#171717',
  background_color:'#f0e7db',
  display:"standalone",
  scope:'/',
  start_url:"/",
  orientation:'portrait'
  }
}

export default defineConfig({
  plugins: [tailwindcss(), react(),  VitePWA({ registerType: 'autoUpdate', manifest: manifestForPlugIn }),  checker({ typescript: false })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
