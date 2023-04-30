import { useLoaderData } from 'react-router-dom'
import image1 from '../assets/blog-post-1.jpg'
import image2 from '../assets/blog-post-2.jpg'
import type { Post } from '../components/ArticleCard'
import { ArticleGrid } from '../components/ArticleGrid'
import { Hero } from '../components/Hero'
import { Layout } from '../components/Layout'

function getPosts(): Post[] {
  console.log('FROM SERVER?')
  const posts = [
    {
      id: '1',
      title: 'Preview Mode for Headless CMS',
      image: image1,
      description: 'How to implement preview mode in your headless CMS.',
      date: '2023-03-01',
      slug: '/blog/preview-mode-headless-cms',
    },
    {
      id: '2',
      title: 'Dynamic Routing and Static Regeneration',
      image: image2,
      description:
        'How to use incremental static regeneration using dynamic routes.',
      date: '2023-03-01',
      slug: '/blog/dynamic-routing-static-regeneration',
    },
  ]

  return posts
}

export async function loader() {
  const posts = await getPosts()
  return { posts }
}

export function HomePage() {
  const { posts } = useLoaderData() as Awaited<ReturnType<typeof loader>>
  return (
    <Layout>
      <section id="content" className="pb-4">
        <Hero />
        <ArticleGrid
          title={'Latest Posts'}
          subtitle={'Checkout this amazing news that are poping in your region'}
          posts={posts}
        />
      </section>
    </Layout>
  )
}
