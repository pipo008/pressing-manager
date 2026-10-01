import { useState } from 'react'
import { MessageCircle, Phone, Lock, CheckCircle2, Key, ChevronDown, ChevronUp } from 'lucide-react'

// ⚠️ PERSONNALISEZ CES COORDONNÉES
const CONTACT_WHATSAPP = '2250544779229' // Votre WhatsApp (format international sans +)
const CONTACT_TEL = '+225 05 44 77 92 29' // Votre téléphone affiché
const PRIX_MENSUEL = '10 000'

// 🎫 Liste des 20 codes uniques (IDENTIQUE à Parametres.jsx)
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

export default function TrialLock({ onActivation }) {
  const [showCodeForm, setShowCodeForm] = useState(false)
  const [codeLicence, setCodeLicence] = useState('')
  const [erreur, setErreur] = useState('')

  // Message WhatsApp pré-rempli
  const messageWhatsApp = encodeURIComponent(
    `Bonjour, je suis gérant(e) de pressing. Mon essai gratuit de Pressing Manager est terminé. Je souhaite m'abonner (${PRIX_MENSUEL} FCFA/mois).`
  )

  // 🎫 Activer la licence avec un code
  const activerAvecCode = () => {
    const codeSaisi = codeLicence.toUpperCase().trim()
    setErreur('')

    // 1. Vérifier que le code existe
    if (!CODES_VALIDES.includes(codeSaisi)) {
      setErreur('Code invalide. Vérifiez votre saisie.')
      return
    }

    // 2. Vérifier qu'il n'a pas déjà été utilisé
    const codesUtilises = JSON.parse(
      localStorage.getItem('pm-codes-utilises') || '[]'
    )

    if (codesUtilises.includes(codeSaisi)) {
      setErreur('Ce code a déjà été utilisé. Demandez-en un nouveau.')
      return
    }

    // 3. Activer la licence pour 30 jours
    const expiration = new Date()
    expiration.setDate(expiration.getDate() + 30)

    localStorage.setItem(
      'pm-license',
      JSON.stringify({
        active: true,
        activation: new Date().toISOString(),
        expiration: expiration.toISOString(),
      })
    )

    // 4. Marquer le code comme utilisé
    localStorage.setItem(
      'pm-codes-utilises',
      JSON.stringify([...codesUtilises, codeSaisi])
    )

    // 5. Notifier le parent (pour rafraîchir l'app)
    if (onActivation) {
      onActivation()
    } else {
      // Fallback : recharger la page
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-in">

        {/* Icône */}
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Lock size={40} className="text-red-500" />
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-display font-bold text-ink mb-2">
          Votre essai gratuit est terminé
        </h1>
        <p className="text-blue-500 text-sm mb-6">
          Vous avez utilisé Pressing Manager pendant 14 jours.
        </p>

        {/* Message */}
        <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-left">
          <p className="text-sm text-ink mb-3 font-medium">
            📊 <strong>Ça vous a fait gagner du temps ?</strong>
          </p>
          <p className="text-sm text-ink/70 mb-4">
            Pour continuer à utiliser Pressing Manager et gérer vos commandes,
            choisissez votre abonnement :
          </p>

          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-ink">
              <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
              Commandes illimitées
            </li>
            <li className="flex items-center gap-2 text-ink">
              <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
              Historique complet des clients
            </li>
            <li className="flex items-center gap-2 text-ink">
              <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
              Notification client par WhatsApp
            </li>
            <li className="flex items-center gap-2 text-ink">
              <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
              Sauvegardes automatiques
            </li>
            <li className="flex items-center gap-2 text-ink">
              <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
              Support par WhatsApp
            </li>
          </ul>
        </div>

        {/* Prix */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 mb-6 text-white">
          <p className="text-sm opacity-90 mb-1">Abonnement mensuel</p>
          <p className="text-4xl font-display font-bold">
            {PRIX_MENSUEL} <span className="text-lg">FCFA</span>
          </p>
          <p className="text-xs opacity-90 mt-1">Sans engagement · Annulable à tout moment</p>
        </div>

        {/* 🎫 SECTION CODE D'ACTIVATION */}
        <div className="mb-6">
          <button
            onClick={() => setShowCodeForm(!showCodeForm)}
            className="w-full flex items-center justify-between px-4 py-3 
                       bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors
                       text-blue-700 font-medium text-sm"
          >
            <span className="flex items-center gap-2">
              <Key size={18} />
              J'ai déjà un code d'activation
            </span>
            {showCodeForm ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showCodeForm && (
            <div className="mt-3 space-y-2 animate-in">
              <input
                type="text"
                value={codeLicence}
                onChange={(e) => {
                  setCodeLicence(e.target.value)
                  setErreur('')
                }}
                placeholder="PRS-XXXX-XXXX-XXXX"
                className="input text-center font-mono uppercase tracking-wider"
                autoFocus
              />

              {erreur && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg p-2">
                  ⚠️ {erreur}
                </p>
              )}

              <button
                onClick={activerAvecCode}
                className="btn-primary w-full"
              >
                🎉 Activer ma licence
              </button>

              <p className="text-xs text-blue-400 text-center">
                💡 Le code vous a été envoyé par WhatsApp après paiement
              </p>
            </div>
          )}
        </div>

        {/* Actions principales */}
        <div className="space-y-3">
          <a
            href={`https://wa.me/${CONTACT_WHATSAPP}?text=${messageWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 
                       text-white font-medium py-3 rounded-xl transition-all hover:scale-[1.02]"
          >
            <MessageCircle size={20} />
            S'abonner via WhatsApp
          </a>

          <a
            href={`tel:${CONTACT_TEL.replace(/\s/g, '')}`}
            className="flex items-center justify-center gap-2 w-full bg-blue-100 hover:bg-blue-200 
                       text-blue-700 font-medium py-3 rounded-xl transition-all"
          >
            <Phone size={18} />
            {CONTACT_TEL}
          </a>
        </div>

        {/* Note */}
        <p className="text-xs text-blue-400 mt-6">
          💡 Vous pouvez prolonger votre essai en contactant le développeur
        </p>
      </div>
    </div>
  )
}