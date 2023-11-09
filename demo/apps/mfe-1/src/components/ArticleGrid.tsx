import type { Post } from './ArticleCard'
import { ArticleCard } from './ArticleCard'

type Props = {
  posts?: Post[]
  title: string
  subtitle?: string
}

export function ArticleGrid(props: Props) {
  return (
    <div className="container max-w-4xl lg:p-10 p-6">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h2 className="inline-block text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
            {props.title}
          </h2>
          {props.subtitle && (
            <p className="text-xl text-slate-600">{props.subtitle}</p>
          )}
        </div>
      </div>
      <hr className="my-8 border-slate-200" />
      {props.posts?.length ? (
        <div className="grid gap-10 sm:grid-cols-2">
          {props.posts.map((post, index) => (
            <ArticleCard
              key={post.id}
              image={post.image}
              title={post.title}
              description={post.description}
              date={post.date}
              slug={post.slug}
            />
          ))}
        </div>
      ) : (
        <p>No posts published.</p>
      )}
    </div>
  )
}
