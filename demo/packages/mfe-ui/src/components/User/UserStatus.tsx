import { Icons } from '@/components/Icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropDownMenu'
import { UserInfo } from '@/hooks/useMfeContext'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import React, { Fragment } from 'react'

type Props = {
  profileImage?: string
  profileInitials?: string
  name: string
}

function UserAvatar(props: Omit<Props, 'name'>) {
  return (
    <Avatar>
      <AvatarImage src={props.profileImage} />
      <AvatarFallback>{props.profileInitials}</AvatarFallback>
    </Avatar>
  )
}

const linkItemStyles = cva(
  'relative flex cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm font-medium outline-none hover:bg-primary-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-primary-500 dark:text-primary-300 dark:hover:text-primary-100 text-primary-200 hover:text-primary-300',
)

const LinkItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ children, className, ...props }, ref) => (
  <a ref={ref} className={cn(linkItemStyles(), className)} {...props}>
    {children}
  </a>
))

function UserMenu(props: Props) {
  return (
    <Fragment>
      <div className="md:hidden">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center">
            <UserAvatar
              profileInitials={props.profileInitials}
              profileImage={props.profileImage}
            />
            <p className="justify-center text-primary-0 text-md ml-4">
              Welcome, {props.name}!
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <LinkItem href={'/profile'}>
            <Icons.user className="mr-2 h-4 w-4" />
            Profile Settings
          </LinkItem>
          <LinkItem href={'/bye'}>
            <Icons.close className="mr-2 h-4 w-4" />
            Logout
          </LinkItem>
        </DropdownMenuGroup>
      </div>
      <div className="hidden md:flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="round" size="round">
              <UserAvatar
                profileInitials={props.profileInitials}
                profileImage={props.profileImage}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-60 text-center bg-primary-800"
          >
            <DropdownMenuItem
              disabled
              className="justify-center text-primary-0 text-lg"
            >
              <p>Welcome, {props.name}!</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href={'/profile'} className="flex items-center text-primary-0">
                <Icons.user className="mr-2 h-4 w-4" />
                Profile Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={'/bye'} className="flex items-center text-primary-0">
                <Icons.close className="mr-2 h-4 w-4" />
                Logout
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Fragment>
  )
}

function SignIn() {
  return (
    <>
      <a href="/sign-in" className="flex items-center text-primary-0 md:hidden">
        <Icons.user className="mr-2 h-6 w-6" />
        <span className="font-bold">Sign In</span>
      </a>
      <Button
        variant="ghost"
        className="text-base focus:ring-0 focus:ring-offset-0 border-2 hidden md:flex"
      >
        <Icons.user className="mr-2 h-6 w-6" />
        <span className="font-bold">Sign In</span>
      </Button>
    </>
  )
}

type UserStatusProps = React.ComponentPropsWithoutRef<'section'> & {
  user?: UserInfo
}

export const UserStatus = React.forwardRef<
  React.ElementRef<'section'>,
  UserStatusProps
>(({ className, user }, ref) => (
  <section ref={ref} className={className}>
    {user ? (
      <UserMenu
        profileInitials={user.initials}
        profileImage={user.image}
        name={user.name}
      />
    ) : (
      <SignIn />
    )}
  </section>
))

UserStatus.displayName = 'UserStatus'
