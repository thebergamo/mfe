import { MenuItem } from '@/components/Header/MainNav'
import { MfeProvider } from '@/hooks/useMfeContext'
import React from 'react'

export type MfeContext = {
  assetsMap: Record<string, string>
  scripts?: string[]
  styles?: string[]
  title?: string
  menu: MenuItem[]
}
type Props = React.PropsWithChildren<{
  context: MfeContext
}>

export function MfeTemplate({
  context: { assetsMap, styles, scripts, title, menu = [] },
  children,
}: Props) {
  console.log(assetsMap, styles, scripts)
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        {styles?.map((style) => (
          <link rel="stylesheet" href={assetsMap[style]} />
        ))}
      </head>
      <body>
        <main>
          <div id="stage">
            <MfeProvider configurations={{ menu }}>{children}</MfeProvider>
          </div>
        </main>
        {scripts?.map((script) => (
          <script type="module" src={assetsMap[script]} />
        ))}
      </body>
    </html>
  )
}
