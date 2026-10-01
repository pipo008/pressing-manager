import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useTrial } from '../hooks/useTrial'
import {
  Save, Store, Phone, MessageCircle, Crown, Clock, CheckCircle2,
  AlertTriangle, Key, Trash2
} from 'lucide-react'

// ⚠️ PERSONNALISEZ CES COORDONNÉES
const CONTACT_WHATSAPP = '2250544779229' // Votre WhatsApp (format international sans +)
const CONTACT_TEL = '+225 05 44 77 92 29' // Votre téléphone affiché

// 🎫 Liste de 20 codes uniques — UN SEUL PAR CLIENT
// Chaque code donne 30 jours d'accès
const CODES_VALIDES = [
  'PRS-A1B2-C3D4-E5F6',
  'PRS-G7H8-I9J0-K1L2',
  'PRS-M3N4-O5P6-Q7R8',
  'PRS-S9T0-U1V2-W3X4',
  'PRS-Y5Z6-A7B8-C9D0',
  'PRS-E1F2-G3H4-I5J6',
  'PRS-K7L8-M9N0-O1P2',
  'PRS-Q3R4-S5T6-U7V8',
  'PRS-W9X0-Y1Z2-A3B4',
  'PRS-C5D6-E7F8-G9H0',
  'PRS-I1J2-K3L4-M5N6',
  'PRS-O7P8-Q9R0-S1T2',
  'PRS-U3V4-W5X6-Y7Z8',
  'PRS-A9B0-C1D2-E3F4',
  'PRS-G5H6-I7J8-K9L0',
  'PRS-M1N2-O3P4-Q5R6',
  'PRS-S7T8-U9V0-W1X2',
  'PRS-Y3Z4-A5B6-C7D8',
  'PRS-E9F0-G1H2-I3J4',
  'PRS-K5L6-M7N8-O9P0',
]

export default function Parametres() {
  const [pressing, setPressing] = useLocalStorage('pm-pressing', {
    nom: 'Mon Pressing',
    adresse: '',
    telephone: '',
    devise: 'FCFA',
  })

  const { joursRestants, licenceActive, expire, activerLicence, dateDebut } = useTrial()

  const [form, setForm] = useState(pressing)
  const [codeLicence, setCodeLicence] = useState('')
  const [showCode, setShowCode] = useState(false)

  // Sauvegarder les infos du pressing
  const sauvegarder = (e) => {
    e.preventDefault()
    setPressing(form)
    alert('Informations enregistrées ✅')
  }

  // 🎫 Activer une licence avec un code unique
  const activerAvecCode = () => {
    const codeSaisi = codeLicence.toUpperCase().trim()

    // Vérifier que le code est dans la liste
    if (!CODES_VALIDES.includes(codeSaisi)) {
      alert('❌ Code invalide. Contactez le développeur.')
      return
    }

    // Vérifier que ce code n'a pas déjà été utilisé
    const codesUtilises = JSON.parse(
      localStorage.getItem('pm-codes-utilises') || '[]'
    )

    if (codesUtilises.includes(codeSaisi)) {
      alert(
        '❌ Ce code a déjà été utilisé.\n\n' +
        'Contactez le développeur pour obtenir un nouveau code.'
      )
      return
    }

    // ✅ Code valide et non utilisé → activer
    activerLicence(30)

    // Marquer comme utilisé
    localStorage.setItem(
      'pm-codes-utilises',
      JSON.stringify([...codesUtilises, codeSaisi])
    )

    setCodeLicence('')
    setShowCode(false)

    alert(
      '🎉 Félicitations !\n\n' +
      'Votre licence est activée pour 30 jours.\n' +
      'Merci pour votre confiance !'
    )
  }

  // Réinitialiser complètement (danger)
  const reinitialiserTout = () => {
    if (!confirm('⚠️ ATTENTION : Cela va effacer TOUTES vos données (commandes, clients, tarifs). Continuer ?')) return
    if (!confirm('Êtes-vous VRAIMENT sûr ? Cette action est irréversible.')) return

    localStorage.clear()
    window.location.href = '/'
  }

  // Formatter une date
  const formaterDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div>
      <h1 className="page-title">⚙️ Paramètres</h1>
      <p className="page-subtitle">Configuration et informations de votre pressing</p>

      {/* État de l'abonnement */}
      <div className="card mb-6">
        <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Crown size={20} className="text-blue-500" />
          Mon abonnement
        </h2>

        <div className="flex items-center gap-3 mb-4">
          {licenceActive ? (
            <>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={24} className="text-green-600" />
              </div>
              <div>
                <p className="font-bold text-green-700">Licence active</p>
                <p className="text-sm text-ink/60">Merci pour votre confiance !</p>
              </div>
            </>
          ) : expire ? (
            <>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <div>
                <p className="font-bold text-red-600">Essai terminé</p>
                <p className="text-sm text-ink/60">Abonnez-vous pour continuer</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-blue-700">Essai gratuit</p>
                <p className="text-sm text-ink/60">
                  {joursRestants} jour{joursRestants > 1 ? 's' : ''} restant{joursRestants > 1 ? 's' : ''}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Détails */}
        <div className="grid grid-cols-2 gap-3 text-sm bg-blue-50 rounded-xl p-3 mb-4">
          <div>
            <p className="text-ink/50 text-xs">Date de début</p>
            <p className="font-medium">{formaterDate(dateDebut)}</p>
          </div>
          <div>
            <p className="text-ink/50 text-xs">Statut</p>
            <p className="font-medium">
              {licenceActive ? '✅ Actif' : expire ? '❌ Expiré' : '⏳ Essai'}
            </p>
          </div>
        </div>

        {/* Bouton activer licence */}
        {!licenceActive && (
          <>
            {!showCode ? (
              <button
                onClick={() => setShowCode(true)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Key size={18} />
                J'ai un code d'activation
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={codeLicence}
                  onChange={(e) => setCodeLicence(e.target.value)}
                  placeholder="PRS-XXXX-XXXX-XXXX"
                  className="input text-center font-mono uppercase tracking-wider"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={activerAvecCode} className="btn-primary flex-1">
                    Activer
                  </button>
                  <button
                    onClick={() => {
                      setShowCode(false)
                      setCodeLicence('')
                    }}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                </div>
                <p className="text-xs text-blue-400 text-center mt-2">
                  💡 Le code vous a été envoyé par WhatsApp après paiement
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Infos du pressing */}
      <form onSubmit={sauvegarder} className="card mb-6">
        <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Store size={20} className="text-blue-500" />
          Mon pressing
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">Nom du pressing</label>
            <input
              type="text"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="input"
              placeholder="Ex: Pressing Étoile"
            />
          </div>
          <div>
            <label className="label">Téléphone</label>
            <input
              type="tel"
              value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              className="input"
              placeholder="Ex: 0701020304"
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Adresse</label>
            <input
              type="text"
              value={form.adresse}
              onChange={(e) => setForm({ ...form, adresse: e.target.value })}
              className="input"
              placeholder="Ex: Cocody Angré, 7ème tranche"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
          <Save size={18} />
          Enregistrer
        </button>
      </form>

      {/* Contact développeur */}
      <div className="card mb-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100">
        <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
          📞 Besoin d'aide ?
        </h2>
        <p className="text-sm text-ink/70 mb-4">
          Contactez le développeur pour toute question ou problème technique.
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://wa.me/${CONTACT_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 
                       text-white rounded-xl text-sm transition-colors"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
          <a
            href={`tel:${CONTACT_TEL.replace(/\s/g, '')}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 
                       text-white rounded-xl text-sm transition-colors"
          >
            <Phone size={16} />
            Appeler
          </a>
        </div>
      </div>

      {/* Zone danger */}
      <div className="card border-2 border-red-100">
        <h2 className="font-display font-bold text-lg mb-3 text-red-600 flex items-center gap-2">
          <Trash2 size={20} />
          Zone dangereuse
        </h2>
        <p className="text-sm text-ink/70 mb-4">
          Effacer toutes les données de l'application. ⚠️ Cette action est irréversible.
        </p>
        <button onClick={reinitialiserTout} className="btn-danger w-full">
          🗑️ Réinitialiser toutes les données
        </button>
      </div>
    </div>
  )
}