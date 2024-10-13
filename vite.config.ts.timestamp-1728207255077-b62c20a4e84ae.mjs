// vite.config.ts
import { defineConfig } from "file:///K:/vocab/chrome-extension-boilerplate-react-vite-typescript/node_modules/vite/dist/node/index.js";
import react from "file:///K:/vocab/chrome-extension-boilerplate-react-vite-typescript/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { crx } from "file:///K:/vocab/chrome-extension-boilerplate-react-vite-typescript/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "Vocab Learning",
  version: "0.2",
  default_locale: "en",
  description: "This Extension for anyone want to learn English by reading",
  icons: {
    "48": "src/assets/icon.png"
  },
  action: {
    default_popup: "index.html"
  },
  background: {
    service_worker: "./src/background/background.ts",
    persistent: false
  },
  options_page: "src/optionsPage/optionsPage.html",
  oauth2: {
    client_id: "<fill-me>.apps.googleusercontent.com",
    scopes: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile"
    ]
  },
  permissions: [
    "storage",
    "activeTab",
    "scripting",
    "identity",
    "contextMenus"
  ],
  content_scripts: [
    {
      js: [
        "src/content/content.tsx"
      ],
      matches: [
        "<all_urls>"
      ]
    }
  ]
};

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [
    react(),
    crx({ manifest: manifest_default })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIks6XFxcXHZvY2FiXFxcXGNocm9tZS1leHRlbnNpb24tYm9pbGVycGxhdGUtcmVhY3Qtdml0ZS10eXBlc2NyaXB0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJLOlxcXFx2b2NhYlxcXFxjaHJvbWUtZXh0ZW5zaW9uLWJvaWxlcnBsYXRlLXJlYWN0LXZpdGUtdHlwZXNjcmlwdFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vSzovdm9jYWIvY2hyb21lLWV4dGVuc2lvbi1ib2lsZXJwbGF0ZS1yZWFjdC12aXRlLXR5cGVzY3JpcHQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgY3J4IH0gZnJvbSAnQGNyeGpzL3ZpdGUtcGx1Z2luJ1xuaW1wb3J0IG1hbmlmZXN0IGZyb20gJy4vbWFuaWZlc3QuanNvbidcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGNyeCh7IG1hbmlmZXN0IH0pLFxuICBdLFxufSlcbiIsICJ7XG4gIFwibWFuaWZlc3RfdmVyc2lvblwiOiAzLFxuICBcIm5hbWVcIjogXCJWb2NhYiBMZWFybmluZ1wiLFxuICBcInZlcnNpb25cIjogXCIwLjJcIixcbiAgXCJkZWZhdWx0X2xvY2FsZVwiOiBcImVuXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJUaGlzIEV4dGVuc2lvbiBmb3IgYW55b25lIHdhbnQgdG8gbGVhcm4gRW5nbGlzaCBieSByZWFkaW5nXCIsXG4gIFwiaWNvbnNcIjoge1xuICAgIFwiNDhcIjogXCJzcmMvYXNzZXRzL2ljb24ucG5nXCJcbiAgfSxcbiAgXCJhY3Rpb25cIjoge1xuICAgIFwiZGVmYXVsdF9wb3B1cFwiOiBcImluZGV4Lmh0bWxcIlxuICB9LFxuICBcImJhY2tncm91bmRcIjoge1xuICAgIFwic2VydmljZV93b3JrZXJcIjogXCIuL3NyYy9iYWNrZ3JvdW5kL2JhY2tncm91bmQudHNcIixcbiAgICBcInBlcnNpc3RlbnRcIjogZmFsc2VcbiAgfSxcbiAgXCJvcHRpb25zX3BhZ2VcIjogXCJzcmMvb3B0aW9uc1BhZ2Uvb3B0aW9uc1BhZ2UuaHRtbFwiLFxuICBcIm9hdXRoMlwiOiB7XG4gICAgXCJjbGllbnRfaWRcIjogXCI8ZmlsbC1tZT4uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb21cIixcbiAgICBcInNjb3Blc1wiOiBbXG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvdXNlcmluZm8uZW1haWxcIixcbiAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC91c2VyaW5mby5wcm9maWxlXCJcbiAgICBdXG4gIH0sXG4gIFwicGVybWlzc2lvbnNcIjogW1xuICAgIFwic3RvcmFnZVwiLFxuICAgIFwiYWN0aXZlVGFiXCIsXG4gICAgXCJzY3JpcHRpbmdcIixcbiAgICBcImlkZW50aXR5XCIsXG4gICAgXCJjb250ZXh0TWVudXNcIlxuICBdLFxuICBcImNvbnRlbnRfc2NyaXB0c1wiOiBbXG4gICAge1xuICAgICAgXCJqc1wiOiBbXG4gICAgICAgIFwic3JjL2NvbnRlbnQvY29udGVudC50c3hcIlxuICAgICAgXSxcbiAgICAgIFwibWF0Y2hlc1wiOiBbXG4gICAgICAgIFwiPGFsbF91cmxzPlwiXG4gICAgICBdXG4gICAgfVxuICBdXG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5VyxTQUFTLG9CQUFvQjtBQUN0WSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxXQUFXOzs7QUNGcEI7QUFBQSxFQUNFLGtCQUFvQjtBQUFBLEVBQ3BCLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxFQUNYLGdCQUFrQjtBQUFBLEVBQ2xCLGFBQWU7QUFBQSxFQUNmLE9BQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxRQUFVO0FBQUEsSUFDUixlQUFpQjtBQUFBLEVBQ25CO0FBQUEsRUFDQSxZQUFjO0FBQUEsSUFDWixnQkFBa0I7QUFBQSxJQUNsQixZQUFjO0FBQUEsRUFDaEI7QUFBQSxFQUNBLGNBQWdCO0FBQUEsRUFDaEIsUUFBVTtBQUFBLElBQ1IsV0FBYTtBQUFBLElBQ2IsUUFBVTtBQUFBLE1BQ1I7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGFBQWU7QUFBQSxJQUNiO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGlCQUFtQjtBQUFBLElBQ2pCO0FBQUEsTUFDRSxJQUFNO0FBQUEsUUFDSjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVc7QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7OztBRG5DQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixJQUFJLEVBQUUsMkJBQVMsQ0FBQztBQUFBLEVBQ2xCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
