import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'mfe-ui/comps'
import { NavLink } from 'react-router-dom'
import burger from '../assets/burger.svg'

export function Menu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-base focus:ring-0 focus:ring-offset-0"
        >
          <img src={burger} className="h-10 w-10" alt="Burger menu" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[300px] bg-secondary-600 dark:bg-secondary-700 p-6"
      >
        <DropdownMenuItem asChild className="hover:bg-secondary-200 mb-2">
          <NavLink
            to="/"
            className="text-xl text-gray-100 hover:text-gray-200 py-4 px-2"
          >
            Home
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-secondary-200">
          <NavLink
            to="/posts"
            className="text-xl text-gray-100 hover:text-gray-200 py-4 px-2"
          >
            Blog
          </NavLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
