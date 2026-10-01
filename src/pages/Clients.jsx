import { useState, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Plus, Search, Phone, MessageCircle, Trash2, User, X } from 'lucide-react'

export default function Clients() {
  const [clients, setClients] = useLocalStorage('pm-clients', [])
  const [commandes] = useLocalStorage('pm-commandes', [])

  const [formOuvert, setFormOuvert] = useState(false)
  const [recherche, setRecherche] = useState('')

  const [form, setForm] = useState({
    nom: '',
    telephone: '',
    adresse: '',
    notes: '',
  })

  // Ajouter un client
  const ajouterClient = (e) => {
    e.preventDefault()
    if (!form.nom || !form.telephone) return

    // Vérifier si le téléphone existe déjà
    const existe = clients.some((c) => c.telephone === form.telephone)
    if (existe) {
      alert('Un client avec ce numéro existe déjà.')
      return
    }

    setClients([
      ...clients,
      {
        id: Date.now(),
        ...form,
        creeLe: new Date().toISOString(),
      },
    ])

    setForm({ nom: '', telephone: '', adresse: '', notes: '' })
    setFormOuvert(false)
  }

  const supprimerClient = (id) => {
    if (!confirm('Supprimer ce client ?')) return
    setClients(clients.filter((c) => c.id !== id))
  }

  // Filtrer + enrichir avec le nombre de commandes
  const clientsEnrichis = useMemo(() => {
    return clients
      .map((c) => {
        const commandesClient = commandes.filter(
          (cmd) => cmd.clientTel === c.telephone
        )
        return {
          ...c,
          nbCommandes: commandesClient.length,
          totalDepense: commandesClient.reduce((s, cmd) => s + cmd.montantPaye, 0),
          derniereCommande: commandesClient[0]?.creeLe || null,
        }
      })
      .filter((c) => {
        if (!recherche.trim()) return true
        const q = recherche.toLowerCase()
        return (
          c.nom.toLowerCase().includes(q) ||
          c.telephone.includes(q)
        )
      })
      .sort((a, b) => b.nbCommandes - a.nbCommandes)
  }, [clients, commandes, recherche])

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">👥 Clients</h1>
          <p className="page-subtitle">
            {clients.length} client{clients.length > 1 ? 's' : ''} enregistré{clients.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setFormOuvert(!formOuvert)}
          className="btn-primary flex items-center gap-2"
        >
          {formOuvert ? <><X size={18} /> Annuler</> : <><Plus size={18} /> Nouveau client</>}
        </button>
      </div>

      {/* Formulaire */}
      {formOuvert && (
        <form onSubmit={ajouterClient} className="card mb-6 animate-in">
          <h2 className="font-display font-bold text-lg mb-4">
            ➕ Nouveau client
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Nom complet *</label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                placeholder="Ex: Aya Koné"
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Téléphone *</label>
              <input
                type="tel"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                placeholder="Ex: 0701020304"
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Adresse</label>
              <input
                type="text"
                value={form.adresse}
                onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                placeholder="Ex: Cocody Angré"
                className="input"
              />
            </div>
            <div>
              <label className="label">Notes</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Info supplémentaire..."
                className="input"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            ✅ Enregistrer le client
          </button>
        </form>
      )}

      {/* Recherche */}
      {clients.length > 0 && (
        <div className="card mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
            <input
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher un client par nom ou téléphone..."
              className="input pl-10"
            />
          </div>
        </div>
      )}

      {/* Liste */}
      {clientsEnrichis.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-5xl mb-3">👥</p>
          {clients.length === 0 ? (
            <>
              <p className="text-ink font-medium mb-1">Aucun client pour le moment</p>
              <p className="text-sm text-blue-400">
                Les clients sont ajoutés automatiquement lors d'une commande
              </p>
            </>
          ) : (
            <p className="text-blue-400">Aucun résultat</p>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {clientsEnrichis.map((client) => (
            <div key={client.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User size={22} />
                  </div>
                  <div>
                    <p className="font-display font-bold text-ink">{client.nom}</p>
                    <p className="text-xs text-blue-500">{client.telephone}</p>
                  </div>
                </div>
                <button
                  onClick={() => supprimerClient(client.id)}
                  className="text-red-300 hover:text-red-500 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Stats client */}
              <div className="flex gap-4 text-sm mb-3">
                <div>
                  <p className="text-xs text-ink/50">Commandes</p>
                  <p className="font-bold text-blue-600">{client.nbCommandes}</p>
                </div>
                <div>
                  <p className="text-xs text-ink/50">Total dépensé</p>
                  <p className="font-bold text-blue-600">
                    {client.totalDepense.toLocaleString('fr-FR')} F
                  </p>
                </div>
              </div>

              {client.adresse && (
                <p className="text-xs text-ink/60 mb-2">📍 {client.adresse}</p>
              )}
              {client.notes && (
                <p className="text-xs text-ink/60 mb-2 italic">"{client.notes}"</p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-blue-100">
                <a
                  href={`tel:${client.telephone}`}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 
                             text-blue-700 rounded-lg text-sm transition-colors"
                >
                  <Phone size={14} />
                  Appeler
                </a>
                <a
                  href={`https://wa.me/${client.telephone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 
                             text-green-700 rounded-lg text-sm transition-colors"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}