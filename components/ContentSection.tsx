import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { PortableTextContent } from './PortableTextContent'

interface ContentSectionProps {
  title?: string
  content: any[]
  image?: any
  imagePosition?: 'left' | 'right'
  className?: string
}

export function ContentSection({
  title,
  content,
  image,
  imagePosition = 'right',
  className = '',
}: ContentSectionProps) {
  const hasImage = image?.asset

  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h2>
        )}

        <div
          className={`grid gap-12 ${
            hasImage
              ? 'md:grid-cols-2 md:gap-16 items-center'
              : 'max-w-4xl'
          }`}
        >
          {/* Image à gauche */}
          {hasImage && imagePosition === 'left' && (
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={urlFor(image).width(800).url()}
                alt={image.alt || ''}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Contenu */}
          <div className="prose prose-lg prose-blue max-w-none">
            <PortableTextContent content={content} />
          </div>

          {/* Image à droite */}
          {hasImage && imagePosition === 'right' && (
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={urlFor(image).width(800).url()}
                alt={image.alt || ''}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
