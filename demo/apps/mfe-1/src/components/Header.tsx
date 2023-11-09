import { Menu } from './Menu'

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-secondary border-b-secondary-200 dark:border-b-secondary-600 dark:bg-primary-900">
      <div className="container flex h-16 items-center p-4">
        <Menu />
        <div className="w-full">
          <span className="mr-6 flex items-center space-x-2">
            <h2 className="text-2xl text-center text-gray-100 w-full">MFE 1</h2>
          </span>
        </div>
      </div>
    </header>
  )
}
