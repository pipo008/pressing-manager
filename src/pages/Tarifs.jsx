import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Plus, Edit2, Trash2, Save, X, Shirt } from 'lucide-react'

const TARIFS_DEFAUT = [
  { id: 1, nom: 'Chemise',     prix: 500 },
  { id: 2, nom: 'Pantalon',    prix: 700 },
  { id: 3, nom: 'Robe',        prix: 1500 },
  { id: 4, nom: 'Costume',     prix: 2000 },
  { id: 5, nom: 'Drap',        prix: 1000 },
  { id: 6, nom: 'Couverture',  prix: 1200 },
  { id: 7, nom: 'Rideau',      prix: 800 },
  { id: 8, nom: 'Blouse',      prix: 600 },
]

export default function Tarifs() {
  const [tarifs, setTarifs] = useLocalStorage('pm-tarifs', TARIFS_DEFAUT)
  const [nouveau, setNouveau] = useState({ nom: '', prix: '' })
  const [editionId, setEditionId] = useState(null)
  const [editionForm, setEditionForm] = useState({ nom: '', prix: '' })

  // Ajouter
  const ajouter = (e) => {
    e.preventDefault()
    if (!nouveau.nom || !nouveau.prix) return

    setTarifs([
      ...tarifs,
      {
        id: Date.now(),
        nom: nouveau.nom,
        prix: parseFloat(nouveau.prix) || 0,
      },
    ])
    setNouveau({ nom: '', prix: '' })
  }

  // Démarrer l'édition
  const commencerEdition = (tarif) => {
    setEditionId(tarif.id)
    setEditionForm({ nom: tarif.nom, prix: tarif.prix })
  }

  // Sauvegarder l'édition
  const sauvegarderEdition = () => {
    setTarifs(
      tarifs.map((t) =>
        t.id === editionId
          ? { ...t, nom: editionForm.nom, prix: parseFloat(editionForm.prix) || 0 }
          : t
      )
    )
    setEditionId(null)
  }

  // Supprimer
  const supprimer = (id) => {
    if (!confirm('Supprimer ce tarif ?')) return
    setTarifs(tarifs.filter((t) => t.id !== id))
  }

  // Réinitialiser aux tarifs par défaut
  const reinitialiser = () => {
    if (!confirm('Réinitialiser la grille tarifaire aux valeurs par défaut ?')) return
    setTarifs(TARIFS_DEFAUT)
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">🏷️ Tarifs</h1>
          <p className="page-subtitle">
            Votre grille tarifaire pour les articles
          </p>
        </div>
        <button
          onClick={reinitialiser}
          className="text-sm text-blue-500 hover:underline"
        >
          Réinitialiser
        </button>
      </div>

      {/* Formulaire ajout */}
      <form onSubmit={ajouter} className="card mb-6">
        <h2 className="font-display font-bold text-lg mb-4">➕ Ajouter un tarif</h2>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={nouveau.nom}
            onChange={(e) => setNouveau({ ...nouveau, nom: e.target.value })}
            placeholder="Nom de l'article (ex: Chemise)"
            className="input flex-1"
            required
          />
          <input
            type="number"
            value={nouveau.prix}
            onChange={(e) => setNouveau({ ...nouveau, prix: e.target.value })}
            placeholder="Prix en FCFA"
            className="input md:w-40"
            min="0"
            required
          />
          <button type="submit" className="btn-primary flex items-center justify-center gap-2">
            <Plus size={18} />
            Ajouter
          </button>
        </div>
      </form>

      {/* Liste des tarifs */}
      <div className="card">
        <h2 className="font-display font-bold text-lg mb-4">
          📋 Grille actuelle ({tarifs.length})
        </h2>

        {tarifs.length === 0 ? (
          <p className="text-center py-8 text-blue-400">
            Aucun tarif défini
          </p>
        ) : (
          <div className="divide-y divide-blue-100">
            {tarifs.map((tarif) => (
              <div key={tarif.id} className="py-3 flex items-center justify-between gap-3">
                {editionId === tarif.id ? (
                  // Mode édition
                  <>
                    <input
                      type="text"
                      value={editionForm.nom}
                      onChange={(e) => setEditionForm({ ...editionForm, nom: e.target.value })}
                      className="input flex-1"
                    />
                    <input
                      type="number"
                      value={editionForm.prix}
                      onChange={(e) => setEditionForm({ ...editionForm, prix: e.target.value })}
                      className="input w-28"
                    />
                    <button
                      onClick={sauvegarderEdition}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={() => setEditionId(null)}
                      className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  // Mode affichage
                  <>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <Shirt size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-ink">{tarif.nom}</p>
                        <p className="text-sm text-blue-600 font-bold">
                          {tarif.prix.toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => commencerEdition(tarif)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => supprimer(tarif.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="card mt-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100">
        <p className="text-sm text-ink/70">
          💡 <strong>Astuce :</strong> Ces tarifs apparaissent comme raccourcis dans le formulaire 
          de nouvelle commande. Vous pouvez modifier les prix à tout moment.
        </p>
      </div>
    </div>
  )
}