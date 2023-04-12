import { NavProps } from '@/components/Header/MainNav'
import { Icons } from '@/components/Icons'
import { Button } from '@/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropDownMenu'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { UserStatus } from '@/components/User/UserStatus'
import { cn } from '@/lib/utils'
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu'
import { Fragment } from 'react'

export function MobileNav(props: NavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-base focus:ring-0  focus:ring-offset-0 md:hidden"
        >
          <Icons.logo className="mr-2 h-4 w-4" />{' '}
          <span className="font-bold">Edgy Portal</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={24}
        alignOffset={4}
        className="w-[300px] bg-primary-600 dark:bg-primary-700"
      >
        <DropdownMenuItem asChild>
          <UserStatus user={props.user} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/" className="flex items-center text-primary-0">
            <Icons.logo className="mr-2 h-4 w-4" /> Home
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {props.menu.map((item, index) => (
            <Fragment key={index}>
              {item.href && (
                <DropdownMenuItem key={index} asChild>
                  <a href={item.href}>{item.title}</a>
                </DropdownMenuItem>
              )}
              {item.items?.length && (
                <DropdownMenuGroup>
                  <DropdownMenuSeparator
                    className={cn({
                      hidden: index === 0,
                    })}
                  />
                  <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="-mx-2" />
                  {item?.items?.length &&
                    item.items.map((item) => (
                      <DropdownMenuItem key={item.title} asChild>
                        {item.href ? (
                          <a href={item.href}>{item.title}</a>
                        ) : (
                          item.title
                        )}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
              )}
            </Fragment>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
