import { Icons } from '@/components/Icons'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/NavigationMenu'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { UserStatus } from '@/components/User/UserStatus'
import { UserInfo } from '@/hooks/useMfeContext'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import React from 'react'

type ListItemProps = React.ComponentPropsWithoutRef<'a'> & { level?: 'nav' }

const listItemStyle = cva('', {
  variants: {
    level: {
      nav: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:bg-primary-600 disabled:opacity-50 dark:focus:bg-primary-800 disabled:pointer-events-none bg-transparent hover:bg-primary-600 dark:hover:bg-primary-800 dark:text-primary-100 dark:hover:text-primary-100 h-10 py-2 px-4 group w-max',
      item: 'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary-700 focus:bg-primary-700 dark:hover:bg-primary-700 dark:focus:bg-primary-700',
    },
  },
  defaultVariants: {
    level: 'item',
  },
})

const ListItem = React.forwardRef<React.ElementRef<'a'>, ListItemProps>(
  ({ className, title, level, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(listItemStyle({ level }), className)}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-primary-500 dark:text-primary-400">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = 'ListItem'

export type MenuItem = {
  title: string
  href?: string
  items?: Omit<MenuItem, 'items'>[]
}

export type NavProps = {
  menu: MenuItem[]
  user?: UserInfo
}

export function MainNav(props: NavProps) {
  return (
    <div className="hidden md:flex w-full">
      <a href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-8 w-8" />
        <span className="hidden font-bold sm:inline-block">Edgy Portal</span>
      </a>
      <NavigationMenu className="justify-start">
        <NavigationMenuList>
          {props.menu.map((item, index) => (
            <NavigationMenuItem key={`menu-${index}`}>
              {item.href && (
                <ListItem href={item.href} title={item.title} level="nav" />
              )}
              {!item.href && (
                <>
                  <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ScrollArea className="h-[200px]">
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        {item.items?.map((childItem, index) => (
                          <ListItem
                            href={childItem.href}
                            title={childItem.title}
                            key={`subMenu-${index}`}
                          />
                        ))}
                      </ul>
                    </ScrollArea>
                  </NavigationMenuContent>
                </>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <UserStatus user={props.user} />
    </div>
  )
}
