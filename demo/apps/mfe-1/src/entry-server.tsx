import { MfeTemplate } from 'mfe-ui/comps'
import { MfeContext } from 'mfe-ui/dist/components/MfeTemplate'

export { routes } from './routes'

function MfeServer(props: { context: MfeContext; children: React.ReactNode }) {
  return <MfeTemplate context={props.context}>{props.children}</MfeTemplate>
}

export default MfeServer
