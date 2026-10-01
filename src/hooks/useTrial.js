import { useState, useEffect } from 'react'

const TRIAL_DURATION_DAYS = 14
const STORAGE_KEY = 'pm-trial-start'
const LICENSE_KEY = 'pm-license' // Si le client a payé

export function useTrial() {
  const [etat, setEtat] = useState({
    joursRestants: TRIAL_DURATION_DAYS,
    expire: false,
    licenceActive: false,
    dateDebut: null,
  })

  useEffect(() => {
    // 1. Vérifier si une licence est active
    const licence = localStorage.getItem(LICENSE_KEY)
    if (licence) {
      try {
        const data = JSON.parse(licence)
        if (data.active && (!data.expiration || new Date(data.expiration) > new Date())) {
          setEtat((prev) => ({ ...prev, licenceActive: true, expire: false }))
          return
        }
      } catch (e) {
        // Licence invalide, on ignore
      }
    }

    // 2. Sinon, vérifier le test gratuit
    let dateDebut = localStorage.getItem(STORAGE_KEY)

    if (!dateDebut) {
      // Premier lancement → enregistrer la date
      dateDebut = new Date().toISOString()
      localStorage.setItem(STORAGE_KEY, dateDebut)
    }

    const debut = new Date(dateDebut)
    const maintenant = new Date()
    const diffJours = Math.floor((maintenant - debut) / (1000 * 60 * 60 * 24))
    const joursRestants = Math.max(0, TRIAL_DURATION_DAYS - diffJours)
    const expire = joursRestants === 0

    setEtat({
      joursRestants,
      expire,
      licenceActive: false,
      dateDebut: debut,
    })
  }, [])

  // Activer une licence (après paiement)
  const activerLicence = (dureeJours = 30) => {
    const expiration = new Date()
    expiration.setDate(expiration.getDate() + dureeJours)

    localStorage.setItem(
      LICENSE_KEY,
      JSON.stringify({
        active: true,
        activation: new Date().toISOString(),
        expiration: expiration.toISOString(),
      })
    )

    setEtat((prev) => ({
      ...prev,
      licenceActive: true,
      expire: false,
    }))
  }

  return { ...etat, activerLicence }
}