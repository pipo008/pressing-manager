import { useState } from 'react'
import Navbar from './Navbar'
import TrialBanner from './TrialBanner'
import TrialLock from './TrialLock'
import { useTrial } from '../hooks/useTrial'

export default function Layout({ children }) {
  const { joursRestants, licenceActive, expire } = useTrial()
  const [refreshKey, setRefreshKey] = useState(0)

  // 🔄 Callback appelé après activation du code
  const handleActivation = () => {
    setRefreshKey((k) => k + 1) // Force le re-render
    // Ou pour être sûr :
    window.location.reload()
  }

  // 🔒 Si l'essai est terminé ET pas de licence active → Bloquer
  if (expire && !licenceActive) {
    return <TrialLock onActivation={handleActivation} />
  }

  // Sinon, afficher l'app normalement
  return (
    <div key={refreshKey} className="min-h-screen flex flex-col bg-cloud">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 pb-24 md:pb-6">
        {!licenceActive && (
          <TrialBanner joursRestants={joursRestants} licenceActive={licenceActive} />
        )}
        {children}
      </main>
    </div>
  )
}