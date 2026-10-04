import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "next-env.d.ts",


    "src/components/animate-ui/**",
    "src/components/unlumen-ui/**",
    "src/components/animated-chart.tsx",
    "src/components/ui/hover-video-player.tsx",
    "src/components/ui/skiper-ui/**",
    "src/components/ui/fps.tsx",
    "src/components/ui/comet-card.tsx",
    "src/components/ui/vu-meter.tsx",
    "src/components/ui/file-system.tsx",
    "src/components/ui/text-shimmer.tsx",
  ]),
]);