import { defineConfig, SSROptions, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const isProd = process.env.NODE_ENV === "production";

const ssr = isProd
  ? ({
      // noExternal: true,
      external: ["react", "react-dom"],
      target: "webworker",
    } as SSROptions)
  : undefined;

function assetsMapPlugin({ prefix }: { prefix: string }): Plugin {
  return {
    name: "assetsMapPlugin",
    apply(config, { command }) {
      // apply only on build but not for SSR
      return command === "build" && !config.build.ssr;
    },
    writeBundle: async (options, bundle) => {
      const bundleKeys = Object.keys(bundle);

      const assetsMap: Record<string, string> = bundleKeys.reduce(
        (map, key) => {
          if (!bundle[key].name) {
            return map;
          }

          const fileName =
            bundle[key].type === "chunk"
              ? `${bundle[key].name}.js`
              : bundle[key].name;

          return {
            ...map,
            [fileName]: `${prefix}/${key}`,
          };
        },
        {}
      );

      try {
        await writeFile(
          join(options.dir, "assetsMap.json"),
          JSON.stringify(assetsMap, null, 4)
        );
        console.info("assetsMap.json was written");
      } catch (err) {
        console.error(
          "assetsMap.json file was not written due to error.",
          err.message
        );
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    assetsMapPlugin({ prefix: "mfe-2" }),
  ],
  base: '/mfe-2/',
  build: {
    minify: false,
    // rollupOptions: {
    //   output: {
    //     assetFileNames: "mfe-2/[name][extname]",
    //   },
    // },
  },
  ssr,
});
