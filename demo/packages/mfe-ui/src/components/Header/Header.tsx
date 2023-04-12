import { MainNav } from '@/components/Header/MainNav'
import { MobileNav } from '@/components/Header/MobileNav'
import { useMfeContext } from '@/hooks/useMfeContext'

export function Header() {
  const { menu = [], user } = useMfeContext()
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-primary border-b-secondary-200 dark:border-b-secondary-600 dark:bg-primary-900">
      <div className="container flex h-16 items-center p-4">
        <MainNav menu={menu} user={user} />
        <MobileNav menu={menu} user={user} />
      </div>
    </header>
  )
}
