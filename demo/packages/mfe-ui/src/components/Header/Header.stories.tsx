import type { Meta, StoryObj } from '@storybook/react'
import { Header } from './Header'

const menu = [
  {
    title: 'Breaking news',
    href: '/breaking',
  },
  {
    title: 'Growth Hacking',
    items: [
      {
        title: 'GH 101',
        href: '/growth/101',
      },
      {
        title: 'Tooling',
        href: '/growth/tooling',
      },
    ],
  },
  {
    title: 'Geekland',
    items: [
      {
        title: 'Manga Zone',
        href: '/geek/manga',
      },
      {
        title: 'Cartoon Mania',
        href: '/geek/cartoon',
      },
    ],
  },
]

const user = {
  image: 'https://avatars.githubusercontent.com/u/1778730',
  initials: 'YO',
  name: 'Marcos Bérgamo',
}

const meta = {
  title: 'core components/Header/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Header>

export default meta

type Story = StoryObj<typeof meta>

export const UnLogged: Story = {
  args: { menu },
}
export const Logged: Story = {
  args: { menu, user },
}
