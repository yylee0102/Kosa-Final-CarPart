import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080, // 프런트 포트
    proxy: {
      // 프런트에서 /api로 호출하면 백엔드로 프록시
      "/api": {
        target: "http://localhost:9000", // ← 백엔드 주소/포트에 맞게 변경
        changeOrigin: true,
        secure: false,
        // 필요하면 경로 재작성
        // rewrite: (p) => p.replace(/^\/api/, "/api"),
        // SSE나 웹소켓 쓰면 켜기
        // ws: true,
      },
    },
  },
  // ✅ 이 부분을 추가하여 'global is not defined' 오류를 해결합니다.

  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
    define: {
    global: 'globalThis'
  }
}));