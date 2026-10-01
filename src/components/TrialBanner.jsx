import { Clock, AlertTriangle } from 'lucide-react'

export default function TrialBanner({ joursRestants, licenceActive }) {
  if (licenceActive) return null

  // Couleur selon le nombre de jours
  let colorClass, icon
  
  if (joursRestants > 7) {
    colorClass = 'bg-blue-50 border-blue-200 text-blue-800'
    icon = <Clock size={16} />
  } else if (joursRestants > 3) {
    colorClass = 'bg-amber-50 border-amber-200 text-amber-800'
    icon = <Clock size={16} />
  } else {
    colorClass = 'bg-red-50 border-red-200 text-red-800'
    icon = <AlertTriangle size={16} />
  }

  return (
    <div className={`${colorClass} border rounded-xl px-4 py-2 mb-6 flex items-center gap-2 text-sm`}>
      {icon}
      <span>
        <strong>Essai gratuit :</strong> {joursRestants} jour{joursRestants > 1 ? 's' : ''} restant{joursRestants > 1 ? 's' : ''}
      </span>
    </div>
  )
}