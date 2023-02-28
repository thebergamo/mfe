export type MfeContext = {
  assetsMap: Record<string, string>;
  scripts?: string[];
  styles?: string[];
  title?: string;
};
type Props = React.PropsWithChildren<{
  context: MfeContext;
}>;

export function Mfe({
  context: { assetsMap, styles, scripts, title },
  children,
}: Props) {
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
          <div id="stage">{children}</div>
        </main>
        {scripts?.map((script) => (
          <script type="module" src={assetsMap[script]} />
        ))}
      </body>
    </html>
  );
}
