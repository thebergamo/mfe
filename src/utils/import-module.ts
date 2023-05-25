import * as esbuild from "https://deno.land/x/esbuild@v0.17.19/wasm.js";
// import esbuildWasm from "https://deno.land/x/esbuild@v0.17.19/esbuild.wasm";
import stripShebang from "https://esm.sh/strip-shebang@2.0.0?bundle&dev&sourcemap&pin=v99";

let initialized = false;

export async function importModule(modulePath: string) {
  const base = new URL(modulePath);
  const contents = await fetchContents(modulePath);

  if (!initialized) {
    await esbuild.initialize({
      // wasmModule: esbuildWasm,
      worker: false,
    });
    initialized = true;
  }

  return (await buildAndEvaluate({
    stdin: {
      contents,
      loader: "tsx",
      sourcefile: base.href,
    },
  }, base));
}

async function fetchContents(url: string) {
  const response = await fetch(url);

  return response.text();
}

const AsyncFunction = async function () {}.constructor;

const sharedEsbuildOptions: esbuild.BuildOptions = {
  jsx: "transform",

  // jsxDev: denoConfiguration?.compilerOptions?.jsx ===
  // 	'react-jsxdev',
  // jsxFactory:
  // 	denoConfiguration?.compilerOptions?.jsxFactory ?? 'h',

  // jsxFragment: denoConfiguration?.compilerOptions
  // 	?.jsxFragmentFactory ?? 'Fragment',

  // jsxImportSource: denoConfiguration?.compilerOptions
  // 	?.jsxImportSource,
  bundle: true,
  platform: "neutral",
  write: false,
  logLevel: "silent",
  // // @ts-ignore The plugin's types have not been updated
  // plugins: [
  // 	denoPlugin({ importMapURL, loader: 'portable' }),
  // ],
};

async function buildAndEvaluate(
  options: esbuild.BuildOptions,
  url: URL,
) {
  const buildResult = await esbuild.build(
    Object.assign({}, sharedEsbuildOptions, options),
  );

  const { text = "" } = buildResult.outputFiles![0];
  const [before, after = "}"] = text.split("export {");
  const body = stripShebang(before).replaceAll(
    "import.meta",
    `{ main: false, url: '${url}', resolve(specifier) { return new URL(specifier, this.url).href } }`,
  ) +
    "return {" +
    after.replaceAll(
      /(?<local>\w+) as (?<exported>\w+)/g,
      "$<exported>: $<local>",
    );

  const exports = await AsyncFunction(body)();

  const prototypedAndToStringTaggedExports = Object.assign(
    Object.create(null),
    exports,
    {
      [Symbol.toStringTag]: "Module",
    },
  );

  const sortedExports = Object.fromEntries(
    Object.keys(prototypedAndToStringTaggedExports)
      .sort()
      .map((
        key,
      ) => [key, prototypedAndToStringTaggedExports[key]]),
  );

  const sealedExports = Object.seal(sortedExports);

  return sealedExports;
}
