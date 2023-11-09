'use client'
import { MainNav, MenuItem } from '@/components/Header/MainNav'
import { MobileNav } from '@/components/Header/MobileNav'
import { UserInfo } from '@/hooks/useMfeContext'

type Props = {
  menu: MenuItem[]
  user?: UserInfo
}

export function Header(props: Props) {
  const { menu = [], user } = props
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-primary border-b-secondary-200 dark:border-b-secondary-600 dark:bg-primary-900">
      <div className="container flex h-16 items-center p-4">
        <MainNav menu={menu} user={user} />
        <MobileNav menu={menu} user={user} />
      </div>
    </header>
  )
}
