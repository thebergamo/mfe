import { MenuItem } from '@/components/Header/MainNav'
import { createContext, useContext } from 'react'

export type UserInfo = {
  name: string
  image?: string
  initials?: string
}

type Mfe = {
  menu: MenuItem[]
  user?: UserInfo
}

const MfeContext = createContext<Mfe>({} as Mfe)

type Props = { configurations: Mfe }

export function MfeProvider({
  children,
  configurations,
}: React.PropsWithChildren<Props>) {
  return (
    <MfeContext.Provider value={configurations}>{children}</MfeContext.Provider>
  )
}

export const useMfeContext = () => {
  return useContext<Mfe>(MfeContext)
}
