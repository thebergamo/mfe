import { UserStatus } from '@/components/User/UserStatus'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'core components/User/UserStatus',
  component: UserStatus,
  // decorators: [
  //   (story) => <MfeProvider configurations={{ menu }}>{story()}</MfeProvider>,
  // ],
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof UserStatus>

export default meta

type Story = StoryObj<typeof meta>

export const SignIn: Story = {}

export const LoggedNoImage: Story = {
  args: {
    user: {
      initials: 'YO',
      name: 'Marcos',
    },
  },
}
export const LoggedImage: Story = {
  args: {
    user: {
      image: 'https://avatars.githubusercontent.com/u/1778730',
      initials: 'YO',
      name: 'Marcos Bérgamo',
    },
  },
}
