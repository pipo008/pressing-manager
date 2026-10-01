import { useState, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  Plus, Search, Filter, Phone, MessageCircle,
  Clock, CheckCircle2, Package, X, Trash2, Shirt
} from 'lucide-react'

// Statuts d'une commande
const STATUTS = {
  en_attente: { label: 'En attente', color: 'bg-gray-100 text-gray-700', icon: Clock },
  en_cours:   { label: 'En cours',   color: 'bg-amber-100 text-amber-700', icon: Package },
  pret:       { label: 'Prêt',       color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  retire:     { label: 'Retiré',     color: 'bg-blue-100 text-blue-700',  icon: CheckCircle2 },
}

// Articles proposés par défaut
const ARTICLES_DEFAUT = [
  { nom: 'Chemise', prix: 500 },
  { nom: 'Pantalon', prix: 700 },
  { nom: 'Robe', prix: 1500 },
  { nom: 'Costume', prix: 2000 },
  { nom: 'Drap', prix: 1000 },
  { nom: 'Couverture', prix: 1200 },
]

export default function Commandes() {
  const [commandes, setCommandes] = useLocalStorage('pm-commandes', [])
  const [clients, setClients] = useLocalStorage('pm-clients', [])
  const [tarifs] = useLocalStorage('pm-tarifs', ARTICLES_DEFAUT)

  const [formOuvert, setFormOuvert] = useState(false)
  const [recherche, setRecherche] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('tous')

  // État du formulaire
  const [form, setForm] = useState({
    clientNom: '',
    clientTel: '',
    dateRetrait: '',
    notes: '',
    articles: [],
    montantPaye: 0,
  })

  // État de l'article en cours d'ajout
  const [articleEnCours, setArticleEnCours] = useState({
    nom: '',
    quantite: 1,
    prix: '',
  })

  // ---------- Gestion du formulaire ----------

  const ajouterArticle = () => {
    if (!articleEnCours.nom || !articleEnCours.prix) return

    setForm({
      ...form,
      articles: [
        ...form.articles,
        {
          id: Date.now(),
          nom: articleEnCours.nom,
          quantite: parseInt(articleEnCours.quantite) || 1,
          prix: parseFloat(articleEnCours.prix) || 0,
        },
      ],
    })

    setArticleEnCours({ nom: '', quantite: 1, prix: '' })
  }

  const supprimerArticle = (id) => {
    setForm({
      ...form,
      articles: form.articles.filter((a) => a.id !== id),
    })
  }

  const ajouterArticleRapide = (article) => {
    setForm({
      ...form,
      articles: [
        ...form.articles,
        {
          id: Date.now(),
          nom: article.nom,
          quantite: 1,
          prix: article.prix,
        },
      ],
    })
  }

  // Calcul du total
  const totalForm = form.articles.reduce(
    (sum, a) => sum + a.prix * a.quantite, 0
  )

  const enregistrerCommande = (e) => {
    e.preventDefault()

    if (!form.clientNom || !form.clientTel || form.articles.length === 0) {
      alert('Veuillez remplir le nom, téléphone et au moins un article.')
      return
    }

    // Générer un numéro de commande
    const numero = 'CMD-' + String(commandes.length + 1).padStart(4, '0')

    // Créer la commande
    const nouvelle = {
      id: Date.now(),
      numero,
      clientNom: form.clientNom,
      clientTel: form.clientTel,
      dateDepot: new Date().toISOString(),
      dateRetrait: form.dateRetrait || null,
      notes: form.notes,
      articles: form.articles,
      total: totalForm,
      montantPaye: parseFloat(form.montantPaye) || 0,
      statut: 'en_attente',
      creeLe: new Date().toISOString(),
    }

    setCommandes([nouvelle, ...commandes])

    // Ajouter le client s'il n'existe pas
    const clientExiste = clients.some((c) => c.telephone === form.clientTel)
    if (!clientExiste) {
      setClients([
        ...clients,
        {
          id: Date.now(),
          nom: form.clientNom,
          telephone: form.clientTel,
          creeLe: new Date().toISOString(),
        },
      ])
    }

    // Reset
    setForm({
      clientNom: '',
      clientTel: '',
      dateRetrait: '',
      notes: '',
      articles: [],
      montantPaye: 0,
    })
    setFormOuvert(false)
  }

  // ---------- Actions sur les commandes ----------

  const changerStatut = (id, nouveauStatut) => {
    setCommandes(
      commandes.map((c) =>
        c.id === id ? { ...c, statut: nouveauStatut } : c
      )
    )
  }

  const supprimerCommande = (id) => {
    if (!confirm('Supprimer cette commande ?')) return
    setCommandes(commandes.filter((c) => c.id !== id))
  }

  const encaisser = (commande) => {
    const reste = commande.total - commande.montantPaye
    if (reste <= 0) {
      alert('Cette commande est déjà entièrement payée.')
      return
    }

    const montant = prompt(
      `Montant à encaisser (reste : ${reste.toLocaleString('fr-FR')} FCFA) :`,
      reste
    )
    if (!montant) return

    const montantNum = parseFloat(montant)
    if (isNaN(montantNum) || montantNum <= 0) return

    setCommandes(
      commandes.map((c) =>
        c.id === commande.id
          ? { ...c, montantPaye: c.montantPaye + montantNum }
          : c
      )
    )
  }

  const notifierClient = (commande) => {
    const message = `Bonjour ${commande.clientNom}, votre commande ${commande.numero} est prête. Vous pouvez venir la retirer. Merci ! 🧺`
    const tel = commande.clientTel.replace(/\D/g, '')
    const url = `https://wa.me/${tel}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  // ---------- Filtres ----------

  const commandesFiltrees = useMemo(() => {
    return commandes
      .filter((c) => filtreStatut === 'tous' || c.statut === filtreStatut)
      .filter((c) => {
        if (!recherche.trim()) return true
        const q = recherche.toLowerCase()
        return (
          c.clientNom.toLowerCase().includes(q) ||
          c.clientTel.includes(q) ||
          c.numero.toLowerCase().includes(q)
        )
      })
  }, [commandes, filtreStatut, recherche])

  // ---------- Statistiques ----------

  const stats = useMemo(() => ({
    enAttente: commandes.filter((c) => c.statut === 'en_attente').length,
    enCours: commandes.filter((c) => c.statut === 'en_cours').length,
    prets: commandes.filter((c) => c.statut === 'pret').length,
    caJour: commandes
      .filter((c) => new Date(c.creeLe).toDateString() === new Date().toDateString())
      .reduce((s, c) => s + c.montantPaye, 0),
  }), [commandes])

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">📋 Commandes</h1>
          <p className="page-subtitle">
            {commandes.length} commande{commandes.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={() => setFormOuvert(!formOuvert)}
          className="btn-primary flex items-center gap-2"
        >
          {formOuvert ? (
            <><X size={18} /> Annuler</>
          ) : (
            <><Plus size={18} /> Nouvelle commande</>
          )}
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="card text-center">
          <p className="text-xs text-ink/60 mb-1">En attente</p>
          <p className="text-2xl font-bold text-gray-600">{stats.enAttente}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-ink/60 mb-1">En cours</p>
          <p className="text-2xl font-bold text-amber-500">{stats.enCours}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-ink/60 mb-1">Prêts</p>
          <p className="text-2xl font-bold text-green-600">{stats.prets}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-ink/60 mb-1">CA du jour</p>
          <p className="text-2xl font-bold text-blue-600">
            {stats.caJour.toLocaleString('fr-FR')}
          </p>
          <p className="text-xs text-blue-400">FCFA</p>
        </div>
      </div>

      {/* Formulaire nouvelle commande */}
      {formOuvert && (
        <form onSubmit={enregistrerCommande} className="card mb-6 animate-in">
          <h2 className="font-display font-bold text-lg mb-4">
            ➕ Nouvelle commande
          </h2>

          {/* Client */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Nom du client *</label>
              <input
                type="text"
                value={form.clientNom}
                onChange={(e) => setForm({ ...form, clientNom: e.target.value })}
                placeholder="Ex: Aya Koné"
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Téléphone *</label>
              <input
                type="tel"
                value={form.clientTel}
                onChange={(e) => setForm({ ...form, clientTel: e.target.value })}
                placeholder="Ex: 0701020304"
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Date de retrait prévue</label>
              <input
                type="date"
                value={form.dateRetrait}
                onChange={(e) => setForm({ ...form, dateRetrait: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Montant payé (FCFA)</label>
              <input
                type="number"
                value={form.montantPaye}
                onChange={(e) => setForm({ ...form, montantPaye: e.target.value })}
                placeholder="0"
                className="input"
                min="0"
              />
            </div>
          </div>

          {/* Articles */}
          <div className="mb-4">
            <label className="label">Articles *</label>

            {/* Boutons rapides */}
            {tarifs.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tarifs.slice(0, 6).map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => ajouterArticleRapide(t)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 
                               text-blue-700 rounded-full text-sm transition-colors
                               flex items-center gap-1"
                  >
                    <Shirt size={14} />
                    {t.nom} ({t.prix} F)
                  </button>
                ))}
              </div>
            )}

            {/* Ajout manuel */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={articleEnCours.nom}
                onChange={(e) => setArticleEnCours({ ...articleEnCours, nom: e.target.value })}
                placeholder="Nom de l'article"
                className="input flex-1"
              />
              <input
                type="number"
                value={articleEnCours.quantite}
                onChange={(e) => setArticleEnCours({ ...articleEnCours, quantite: e.target.value })}
                min="1"
                className="input w-20"
              />
              <input
                type="number"
                value={articleEnCours.prix}
                onChange={(e) => setArticleEnCours({ ...articleEnCours, prix: e.target.value })}
                placeholder="Prix"
                min="0"
                className="input w-24"
              />
              <button
                type="button"
                onClick={ajouterArticle}
                className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Liste des articles ajoutés */}
            {form.articles.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-3 space-y-2">
                {form.articles.map((a) => (
                  <div key={a.id} className="flex items-center justify-between text-sm">
                    <span className="text-ink">
                      <strong>{a.quantite}×</strong> {a.nom}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-blue-700">
                        {(a.prix * a.quantite).toLocaleString('fr-FR')} F
                      </span>
                      <button
                        type="button"
                        onClick={() => supprimerArticle(a.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-t border-blue-200 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-blue-700">
                    {totalForm.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="label">Notes (optionnel)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Instructions spéciales..."
              className="input"
              rows="2"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            ✅ Enregistrer la commande
          </button>
        </form>
      )}

      {/* Recherche + filtres */}
      {commandes.length > 0 && (
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
              <input
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher par nom, téléphone ou numéro..."
                className="input pl-10"
              />
            </div>
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="input md:w-48"
            >
              <option value="tous">Tous les statuts</option>
              {Object.entries(STATUTS).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Liste des commandes */}
      {commandesFiltrees.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-5xl mb-3">🧺</p>
          {commandes.length === 0 ? (
            <>
              <p className="text-ink font-medium mb-1">Aucune commande pour le moment</p>
              <p className="text-sm text-blue-400">
                Cliquez sur "Nouvelle commande" pour commencer
              </p>
            </>
          ) : (
            <p className="text-blue-400">Aucun résultat trouvé</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {commandesFiltrees.map((commande) => {
            const statut = STATUTS[commande.statut]
            const Icone = statut.icon
            const reste = commande.total - commande.montantPaye

            return (
              <div key={commande.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <Icone size={22} />
                    </div>
                    <div>
                      <p className="font-display font-bold text-ink">
                        {commande.clientNom}
                      </p>
                      <p className="text-xs text-blue-500">
                        {commande.numero} · {commande.clientTel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`badge ${statut.color}`}>
                      <Icone size={12} />
                      {statut.label}
                    </span>
                    <button
                      onClick={() => supprimerCommande(commande.id)}
                      className="text-red-300 hover:text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Articles */}
                <div className="bg-blue-50 rounded-xl p-3 mb-3 text-sm">
                  {commande.articles.map((a, i) => (
                    <div key={i} className="flex justify-between text-ink/80">
                      <span>{a.quantite}× {a.nom}</span>
                      <span>{(a.prix * a.quantite).toLocaleString('fr-FR')} F</span>
                    </div>
                  ))}
                </div>

                {/* Montants */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-sm">
                  <span className="text-ink/60">
                    Total : <strong className="text-ink">
                      {commande.total.toLocaleString('fr-FR')} F
                    </strong>
                  </span>
                  <span className="text-ink/60">
                    Payé : <strong className="text-green-600">
                      {commande.montantPaye.toLocaleString('fr-FR')} F
                    </strong>
                  </span>
                  {reste > 0 ? (
                    <span className="text-ink/60">
                      Reste : <strong className="text-red-500">
                        {reste.toLocaleString('fr-FR')} F
                      </strong>
                    </span>
                  ) : (
                    <span className="badge bg-green-100 text-green-700">
                      ✓ Entièrement payé
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-blue-100">
                  {/* Changer statut */}
                  <select
                    value={commande.statut}
                    onChange={(e) => changerStatut(commande.id, e.target.value)}
                    className="text-sm border border-blue-200 rounded-lg px-2 py-1.5"
                  >
                    {Object.entries(STATUTS).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>

                  {/* Notifier (si prêt) */}
                  {commande.statut === 'pret' && (
                    <button
                      onClick={() => notifierClient(commande)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 
                                 text-white rounded-lg text-sm transition-colors"
                    >
                      <MessageCircle size={14} />
                      Notifier
                    </button>
                  )}

                  {/* Encaisser (si reste à payer) */}
                  {reste > 0 && (
                    <button
                      onClick={() => encaisser(commande)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 
                                 text-white rounded-lg text-sm transition-colors"
                    >
                      💰 Encaisser
                    </button>
                  )}

                  {/* Appeler */}
                  <a
                    href={`tel:${commande.clientTel}`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 
                               text-blue-700 rounded-lg text-sm transition-colors"
                  >
                    <Phone size={14} />
                    Appeler
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}