import { defineConfig } from "tsup";

// @ts-ignore - out of scope
import { createBanner } from "../../build.utils.js";

import pkg from "./package.json";

const entry = ["server.ts"];

const external = ["virtual:react-manifest"];

const config = (enableDevWarnings: boolean) =>
  defineConfig([
    {
      clean: false,
      entry,
      format: ["cjs"],
      outDir: enableDevWarnings ? "dist/development" : "dist/production",
      dts: true,
      banner: {
        js: createBanner(pkg.name, pkg.version),
      },
      define: {
        "import.meta.hot": "undefined",
        REACT_ROUTER_VERSION: JSON.stringify(pkg.version),
        __DEV__: JSON.stringify(enableDevWarnings),
      },
      treeshake: true,
      external,
    },
    {
      clean: false,
      entry,
      format: ["esm"],
      outDir: enableDevWarnings ? "dist/development" : "dist/production",
      dts: true,
      banner: {
        js: createBanner(pkg.name, pkg.version),
      },
      define: {
        REACT_ROUTER_VERSION: JSON.stringify(pkg.version),
        __DEV__: JSON.stringify(enableDevWarnings),
      },
      treeshake: true,
      external,
    },
  ]);

export default defineConfig([
  // @ts-expect-error
  ...config(false),
  ...config(true),
]);
