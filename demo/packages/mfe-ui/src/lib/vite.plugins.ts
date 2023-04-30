import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Plugin, SSROptions } from 'vite'

export function assetsMapPlugin({ prefix }: { prefix: string }): Plugin {
  return {
    name: 'assetsMapPlugin',
    apply(config, { command }) {
      // apply only on build but not for SSR
      return command === 'build' && !config.build?.ssr
    },
    writeBundle: async (options, bundle) => {
      const bundleKeys = Object.keys(bundle)

      const assetsMap: Record<string, string> = bundleKeys.reduce(
        (map, key) => {
          if (!bundle[key].name) {
            return map
          }

          const fileName = `${
            bundle[key].type === 'chunk'
              ? `${bundle[key].name}.js`
              : bundle[key].name
          }`

          return {
            ...map,
            [fileName]: `${prefix}/${key}`,
          }
        },
        {},
      )

      try {
        if (!options.dir) {
          throw new Error('Output dir is missing')
        }
        await writeFile(
          join(options.dir, 'assetsMap.json'),
          JSON.stringify(assetsMap, null, 4),
        )
        console.info('assetsMap.json was written')
      } catch (err: unknown) {
        console.error(
          'assetsMap.json file was not written due to error.',
          (err as Error).message,
        )
      }
    },
  }
}

// We assume the stack is the same across all the MFEs
export function ssrConfig(): SSROptions | undefined {
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  return {
    external: ['react', 'react-dom'],
    target: 'webworker',
  } as SSROptions
}
