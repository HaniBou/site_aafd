import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Témoignages - AAFD Val de Saône',
  description: 'Découvrez les témoignages des familles accompagnées et des bénévoles de l\'AAFD',
}

export default function TemoignagesPage() {
  return (
    <main className="min-h-screen bg-white">
      <PageHero
        title="Témoignages"
        description="Ils ont été accompagnés par l'AAFD ou se sont engagés comme bénévoles. Découvrez leurs histoires et leurs parcours."
        imageSrc="/images/hero_temoignages.webp"
        imageAlt="Témoignages"
      />

      {/* Introduction */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            Chaque témoignage est une histoire unique. Des parcours de vie, des rencontres, 
            des moments de solidarité qui changent des vies. Découvrez les visages et les voix 
            de celles et ceux qui font vivre l&apos;AAFD au quotidien.
          </p>
        </div>
      </section>

      {/* Témoignages des familles */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900">
              Témoignages des familles accompagnées
            </h2>
            <p className="text-body-large text-gray-600">
              Des parcours de résilience et d&apos;espoir
            </p>
          </div>

          <div className="space-y-16">
            {/* Témoignage 1 */}
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-100 to-blue-200">
                <div className="absolute inset-0 flex items-center justify-center text-blue-300">
                  <div className="text-center">
                    <svg className="h-32 w-32 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-2xl font-semibold text-blue-400"> </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-6">
                  <svg className="h-10 w-10 text-blue-900 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed mb-6 text-justify">
                  &quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
                  voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat 
                  non proident, sunt in culpa qui officia deserunt mollit anim.&quot;
                </p>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">Sarah M.</p>
                  <p className="text-gray-600">Famille accompagnée depuis 2020</p>
                </div>
              </div>
            </div>

            {/* Témoignage 2 */}
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="order-2 md:order-1">
                <div className="mb-6">
                  <svg className="h-10 w-10 text-orange-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed mb-6 text-justify">
                  &quot;Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque 
                  laudantium, totam rem aperiam. Eaque ipsa quae ab illo inventore veritatis et quasi architecto 
                  beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut 
                  odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.&quot;
                </p>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">Karim D.</p>
                  <p className="text-gray-600">Jeune accompagné depuis 2019</p>
                </div>
              </div>
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-orange-100 to-orange-200 order-1 md:order-2">
                <div className="absolute inset-0 flex items-center justify-center text-orange-300">
                  <div className="text-center">
                    <svg className="h-32 w-32 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-2xl font-semibold text-orange-400"> </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Témoignage 3 */}
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-green-100 to-green-200">
                <div className="absolute inset-0 flex items-center justify-center text-green-300">
                  <div className="text-center">
                    <svg className="h-32 w-32 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-2xl font-semibold text-green-400"> </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-6">
                  <svg className="h-10 w-10 text-green-700 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed mb-6 text-justify">
                  &quot;At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium 
                  voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati 
                  cupiditate non provident. Similique sunt in culpa qui officia deserunt mollitia animi, id est 
                  laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.&quot;
                </p>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">Famille L.</p>
                  <p className="text-gray-600">Famille accompagnée depuis 2018</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages des bénévoles */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Témoignages des bénévoles
            </h2>
            <p className="text-xl text-gray-600">
              L&apos;engagement qui enrichit
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Bénévole 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="relative h-96 bg-gradient-to-br from-purple-100 to-purple-200">
                <img
                  src="/images/v1.webp"
                  alt="Bénévole 1"
                  className="object-cover object-top"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4 italic text-justify">
                  &quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus suspendisse 
                  lectus tortor aliquam nulla facilisi cras fermentum. Dignissim enim sit amet venenatis 
                  urna cursus eget nunc scelerisque.&quot;
                </p>
                <p className="font-semibold text-gray-900">Marie T.</p>
                <p className="text-sm text-gray-600">Bénévole depuis 2020</p>
              </div>
            </div>

            {/* Bénévole 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="relative h-96 bg-gradient-to-br from-blue-100 to-blue-200">
                <img
                  src="/images/v2.webp"
                  alt="Bénévole 2"
                  className="object-fill object-bottom"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4 italic text-justify">
                  &quot;Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis 
                  egestas. Vestibulum tortor quam, feugiat vitae ultricies eget tempor sit amet.&quot;
                </p>
                <p className="font-semibold text-gray-900">Pierre L.</p>
                <p className="text-sm text-gray-600">Bénévole depuis 2018</p>
              </div>
            </div>

            {/* Bénévole 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="relative h-96 bg-gradient-to-br from-orange-100 to-orange-200">
                <img
                  src="/images/v5.webp"
                  alt="Bénévole 3"
                  className="object-cover w-full h-full"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4 italic text-justify">
                  &quot;Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil 
                  molestiae consequatur vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.&quot;
                </p>
                <p className="font-semibold text-gray-900">Sophie B.</p>
                <p className="text-sm text-gray-600">Bénévole accompagnement</p>
              </div>
            </div>

            {/* Bénévole 4 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="relative h-96 bg-gradient-to-br from-red-100 to-red-200">
                <img
                  src="/images/v6.webp"
                  alt="Bénévole 4"
                  className="object-cover w-full h-full"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4 italic text-justify">
                  &quot;Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe 
                  eveniet ut et voluptates repudiandae sint et molestiae non recusandae.&quot;
                </p>
                <p className="font-semibold text-gray-900">Julien M.</p>
                <p className="text-sm text-gray-600">Bénévole organisation</p>
              </div>
            </div>

            {/* Bénévole 5 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="relative h-96 bg-gradient-to-br from-yellow-100 to-yellow-200">
                <img
                  src="/images/v9.webp"
                  alt="Bénévole 5"
                  className="object-cover w-full h-full"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4 italic text-justify">
                  &quot;Itaque earum rerum hic tenetur a sapiente delectus ut aut reiciendis voluptatibus 
                  maiores alias consequatur aut perferendis doloribus asperiores repellat.&quot;
                </p>
                <p className="font-semibold text-gray-900">André D.</p>
                <p className="text-sm text-gray-600">Bénévole depuis 2021</p>
              </div>
            </div>

            {/* Bénévole 6 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="relative h-96 bg-gradient-to-br from-green-100 to-green-200">
                <img
                  src="/images/v7.webp"
                  alt="Bénévole 6"
                  className="object-cover w-full h-full object-top"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4 italic text-justify">
                  &quot;Nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit quo minus 
                  id quod maxime placeat facere possimus omnis voluptas assumenda est.&quot;
                </p>
                <p className="font-semibold text-gray-900">Emma R.</p>
                <p className="text-sm text-gray-600">Bénévole communication</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moments partagés */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Moments partagés
            </h2>
            <p className="text-xl text-gray-600">
              Quelques instants de nos événements et actions
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Photo événement 1 */}
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-200 to-blue-300">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-400">
                <svg className="h-20 w-20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-semibold">Vente de plats</p>
                <p className="text-sm mt-1">Photo à venir</p>
              </div>
            </div>

            {/* Photo événement 2 */}
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-orange-200 to-orange-300">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-orange-400">
                <svg className="h-20 w-20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-semibold">Tournoi de pétanque</p>
                <p className="text-sm mt-1">Photo à venir</p>
              </div>
            </div>

            {/* Photo événement 3 */}
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-green-200 to-green-300">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-green-400">
                <svg className="h-20 w-20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-semibold">Nettoyage Val de Saône</p>
                <p className="text-sm mt-1">Photo à venir</p>
              </div>
            </div>

            {/* Photo événement 4 */}
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-purple-200 to-purple-300">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-purple-400">
                <svg className="h-20 w-20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-semibold">Cours de français</p>
                <p className="text-sm mt-1">Photo à venir</p>
              </div>
            </div>

            {/* Photo événement 5 */}
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-red-200 to-red-300">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400">
                <svg className="h-20 w-20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-semibold">Réunion bénévoles</p>
                <p className="text-sm mt-1">Photo à venir</p>
              </div>
            </div>

            {/* Photo événement 6 */}
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-yellow-200 to-yellow-300">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-yellow-500">
                <svg className="h-20 w-20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-semibold">Fête de fin d'année</p>
                <p className="text-sm mt-1">Photo à venir</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-900 py-16 md:py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2>
            Vous aussi, écrivez votre histoire avec l&apos;AAFD
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            Rejoignez notre communauté et devenez acteur du changement
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/nous-rejoindre"
              className="inline-block rounded-full bg-orange-500 px-8 py-4 text-lg font-semibold text-white hover:bg-orange-600 transition-colors"
            >
              Devenir bénévole
            </Link>
            <Link
              href="/nous-soutenir"
              className="inline-block rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-blue-900 transition-colors"
            >
              Soutenir nos actions
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
