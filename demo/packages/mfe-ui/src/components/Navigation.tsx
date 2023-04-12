function MenuItems() {
  return <>HI</>
}

type NavLink = {
  label: string
  href: string
}

type Props = {
  pages?: NavLink[]
}

export function Navigation({ pages }: Props) {
  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {pages?.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-white rounded-md px-3 py-2 text-sm font-medium"
                    aria-current="page"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
