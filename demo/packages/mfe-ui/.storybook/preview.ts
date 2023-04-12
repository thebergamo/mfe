import { withThemeByDataAttribute } from '@storybook/addon-styling'
import type { Preview } from '@storybook/react'
import '../src/index.css'

const viewports = {
  sm: {
    name: 'sm',
    styles: {
      width: '640px',
      height: '100%',
    },
  },
  md: {
    name: 'md',
    styles: {
      width: '768px',
      height: '100%',
    },
  },
  lg: {
    name: 'lg',
    styles: {
      width: '1024px',
      height: '100%',
    },
  },
  xl: {
    name: 'xl',
    styles: {
      width: '1280px',
      height: '100%',
    },
  },
  '2xl': {
    name: '2xl',
    styles: {
      width: '1536px',
      height: '100%',
    },
  },
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    layout: 'fullscreen',
    viewport: { viewports },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export const decorators = [
  withThemeByDataAttribute({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
    attributeName: 'data-mode',
  }),
]

export default preview
