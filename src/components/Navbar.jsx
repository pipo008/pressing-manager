import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ListOrdered,
  Users,
  Tags,
  Settings,
} from 'lucide-react'

const links = [
  { to: '/',           label: 'Accueil',    icon: LayoutDashboard },
  { to: '/commandes',  label: 'Commandes',  icon: ListOrdered },
  { to: '/clients',    label: 'Clients',    icon: Users },
  { to: '/tarifs',     label: 'Tarifs',     icon: Tags },
  { to: '/parametres', label: 'Réglages',   icon: Settings },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="bg-white shadow-card sticky top-0 z-40 border-b border-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl">🧺</span>
          <div>
            <div className="text-lg font-display font-bold text-blue-600 leading-tight">
              Pressing Manager
            </div>
            <div className="text-xs text-blue-400 leading-tight">
              Gérez votre pressing
            </div>
          </div>
        </Link>

        {/* Liens desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all
                  ${active
                    ? 'bg-blue-600 text-white shadow-soft'
                    : 'text-ink hover:bg-blue-100'
                  }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Navigation mobile (en bas) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-blue-100 shadow-lg">
        <div className="flex justify-around py-2">
          {links.map(({ to, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`p-2 rounded-full transition-all
                  ${active ? 'bg-blue-600 text-white' : 'text-blue-400'}`}
              >
                <Icon size={22} />
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}