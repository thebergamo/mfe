import { Header } from './Header'

type Props = {
  children: React.ReactNode
}
export function Layout(props: Props) {
  return (
    <div id="page">
      <Header />
      {props.children}
    </div>
  )
}
