import { Header } from '@/components/Header/Header'
import { MenuItem } from '@/components/Header/MainNav'
import { MfeProvider, UserInfo } from '@/hooks/useMfeContext'

// @ts-ignore
import tailwindConfig from '@tailwind'
import React from 'react'

interface RouteData {
  [routeId: string]: any
}

export type MfeContext = {
  routerHydration: {
    loaderData: RouteData
  }
  assetsMap: Record<string, string>
  scripts?: string[]
  styles?: string[]
  title?: string
  menu: MenuItem[]
  user?: UserInfo
  id: string
}
type Props = React.PropsWithChildren<{
  context: MfeContext
}>

export function MfeTemplate({
  context: { assetsMap, styles, scripts, title, menu = [], user, id: mfeId },
  children,
}: Props) {
  return (
    <html hidden>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        {/* FIXME: Use proper favicon */}
        <link
          rel="icon"
          href="https://miro.medium.com/v2/1*m-R_BkNf1Qjr1YbyOIJY2w.png"
        />
        {styles?.map(
          (style) => (
            <link rel="stylesheet" href={assetsMap[style]} />
          ),
          // ),
        )}
        <script type="module" src="https://cdn.skypack.dev/twind/shim"></script>
        <script
          type="twind-config"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              hash: true,
              theme: tailwindConfig.theme,
              darkMode: tailwindConfig.darkMode,
            }),
          }}
        ></script>
      </head>
      <body>
        <main className={mfeId}>
          <MfeProvider configurations={{ menu, user }}>
            <section id="stage">
              <Header />
              <section id="root">{children}</section>
            </section>
          </MfeProvider>
        </main>
        {scripts?.map((script) => (
          <script type="module" src={assetsMap[script]} />
        ))}
      </body>
    </html>
  )
}
