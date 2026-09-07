import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
          Page non trouvée
        </h2>
        <p className="mb-8 text-gray-600">
          Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Button href="/" variant="primary" size="md">
          Retour à l&apos;accueil
        </Button>
      </div>
    </main>
  )
}
