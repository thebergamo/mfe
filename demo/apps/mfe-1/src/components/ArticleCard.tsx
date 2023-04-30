import { formatDate } from '../lib/util'

export type Post = {
  id: string
  image: string
  title: string
  description: string
  date: string | number
  slug: string
}

type Props = Omit<Post, 'id'>

export function ArticleCard(props: Props) {
  return (
    <article className="group relative flex flex-col space-y-2">
      <img
        src={props.image}
        alt={props.title}
        width={804}
        height={452}
        className="rounded-md border border-slate-200 bg-slate-200 transition-colors group-hover:border-slate-900"
      />
      <h2 className="text-2xl font-extrabold">{props.title}</h2>
      {props.description && (
        <p className="text-slate-600">{props.description}</p>
      )}
      {props.date && (
        <p className="text-sm text-slate-600">{formatDate(props.date)}</p>
      )}
      <a href={props.slug} className="absolute inset-0">
        <span className="sr-only">View Article</span>
      </a>
    </article>
  )
}
