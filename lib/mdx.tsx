import { evaluate, type EvaluateOptions } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import rehypeSlug from 'rehype-slug'
import { mdxComponents } from '@/components/mdx/components'

const options = { ...runtime, rehypePlugins: [rehypeSlug] } as unknown as EvaluateOptions

export async function Mdx({ source }: { source: string }) {
  const { default: Content } = await evaluate(source, options)
  return <Content components={mdxComponents} />
}
