import { Layout } from '../components/Layout'

type Props = {}

export function PostsPage(props: Props) {
  return (
    <Layout>
      <section id="content" className="pb-4">
        <h2 className="text-4xl bg-secondary-200">Just posts here</h2>
      </section>
    </Layout>
  )
}
