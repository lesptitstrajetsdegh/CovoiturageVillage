import { useEffect, useState } from 'react'
import { AdminNotifications } from '../components/AdminNotifications'

export function Admin() {
  const [status, setStatus] = useState('loading')
  const [schoolYears, setSchoolYears] = useState([])
  const [locations, setLocations] = useState([])
  const [stagePeriods, setStagePeriods] = useState([])
  const [families, setFamilies] = useState([])
  const [newSchoolYear, setNewSchoolYear] = useState('')
  const [createStatus, setCreateStatus] = useState('')
  const [newStagePeriod, setNewStagePeriod] = useState({
    school_year_id: '',
    label: '',
  })
  const [stagePeriodCreateStatus, setStagePeriodCreateStatus] =
    useState('')
  const [editingStagePeriodId, setEditingStagePeriodId] = useState(null)
  const [editingStagePeriodLabel, setEditingStagePeriodLabel] = useState('')
  const [newLocation, setNewLocation] = useState({
    name: '',
    address_street: '',
    address_postal_village: '',
  })
  const [locationCreateStatus, setLocationCreateStatus] = useState('')
  const [familyActionStatus, setFamilyActionStatus] = useState({})
  const [locationActionStatus, setLocationActionStatus] = useState({})
  const [editingLocationId, setEditingLocationId] = useState(null)
  const [editingLocation, setEditingLocation] = useState({
    name: '',
    address_street: '',
    address_postal_village: '',
  })
  const [locationRequests, setLocationRequests] = useState([])

  async function loadAdminData() {
    const [
      schoolYearsResponse,
      locationsResponse,
      stagePeriodsResponse,
      familiesResponse,
      locationRequestsResponse,
    ] = await Promise.all([
      fetch('/api/admin-school-years'),
      fetch('/api/admin-locations'),
      fetch('/api/admin-stage-periods'),
      fetch('/api/admin-families'),
      fetch('/api/admin-location-requests'),
    ])

    if (
      !schoolYearsResponse.ok ||
      !locationsResponse.ok ||
      !stagePeriodsResponse.ok ||
      !familiesResponse.ok
    ) {
      throw new Error('Impossible de charger les données.')
    }

    const schoolYearsData = await schoolYearsResponse.json()
    const locationsData = await locationsResponse.json()
    const stagePeriodsData = await stagePeriodsResponse.json()
    const familiesData = await familiesResponse.json()
    const locationRequestsData = await locationRequestsResponse.json()

    setSchoolYears(schoolYearsData.school_years)
    setLocations(locationsData.locations)
    setStagePeriods(stagePeriodsData.stage_periods)
    setFamilies(familiesData.families)
    setLocationRequests(locationRequestsData.location_requests)
  }

  useEffect(() => {
    async function loadAdmin() {
      try {
        const adminResponse = await fetch('/api/admin')

        if (!adminResponse.ok) {
          setStatus('forbidden')
          return
        }

        await loadAdminData()
        setStatus('authorized')
      } catch {
        setStatus('error')
      }
    }

    loadAdmin()
  }, [])

  async function handleArchiveSchoolYear(schoolYearId) {
    if (
      !window.confirm(
        'Voulez-vous vraiment archiver cette année scolaire ?',
      )
    ) {
      return
    }

    setCreateStatus('loading')

    try {
      const response = await fetch('/api/admin-school-years-archive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          school_year_id: schoolYearId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setCreateStatus(
          data.error || 'Erreur lors de l’archivage de l’année scolaire.',
        )
        return
      }

      setSchoolYears((current) =>
        current.map((schoolYear) =>
          schoolYear.school_year_id === schoolYearId
            ? data.school_year
            : schoolYear,
        ),
      )

      setCreateStatus('archived')
    } catch {
      setCreateStatus('error')
    }
  }


  async function handleCreateSchoolYear(event) {
    event.preventDefault()
    setCreateStatus('loading')

    try {
      const response = await fetch('/api/admin-school-years-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: newSchoolYear,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setCreateStatus(data.error || 'Erreur lors de la création.')
        return
      }

      setNewSchoolYear('')
      await loadAdminData()
      setCreateStatus('success')
    } catch {
      setCreateStatus('error')
    }
  }

  async function handleCreateStagePeriod(event) {
    event.preventDefault()
    setStagePeriodCreateStatus('loading')

    try {
      const response = await fetch('/api/admin-stage-periods-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          school_year_id: Number(newStagePeriod.school_year_id),
          label: newStagePeriod.label,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStagePeriodCreateStatus(
          data.error || 'Erreur lors de la création de la période.',
        )
        return
      }

      setNewStagePeriod({
        school_year_id: '',
        label: '',
      })

      await loadAdminData()
      setStagePeriodCreateStatus('success')
    } catch {
      setStagePeriodCreateStatus('error')
    }
  }

async function handleUpdateStagePeriod(periodId, label, status) {
  const newLabel = label.trim()

  if (!newLabel || !['active', 'archived'].includes(status)) {
    return
  }

  setStagePeriodCreateStatus('loading')

  try {
    const response = await fetch('/api/admin-stage-periods-update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        period_id: periodId,
        label: newLabel,
        status: status,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setStagePeriodCreateStatus(
        data.error || 'Erreur lors de la modification de la période.',
      )
      return
    }

    await loadAdminData()
    setEditingStagePeriodId(null)
    setEditingStagePeriodLabel('')
    setStagePeriodCreateStatus('success')
  } catch {
    setStagePeriodCreateStatus('error')
  }
}

async function handleArchiveStagePeriod(periodId) {
  setStagePeriodCreateStatus('loading')

  try {
    const response = await fetch('/api/admin-stage-periods-archive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        period_id: periodId,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setStagePeriodCreateStatus(
        data.error || "Erreur lors de l'archivage de la période.",
      )
      return
    }

    await loadAdminData()
    setStagePeriodCreateStatus('success')
  } catch {
    setStagePeriodCreateStatus('error')
  }
}

async function handleReactivateStagePeriod(periodId) {
  setStagePeriodCreateStatus('loading')

  try {
    const response = await fetch('/api/admin-stage-periods-reactivate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        period_id: periodId,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setStagePeriodCreateStatus(
        data.error || 'Erreur lors de la réactivation de la période.',
      )
      return
    }

    await loadAdminData()
    setStagePeriodCreateStatus('success')
  } catch {
    setStagePeriodCreateStatus('error')
  }
}

async function handleDeleteStagePeriod(periodId) {
  if (!window.confirm('Supprimer cette période de stage ?')) {
    return
  }

  setStagePeriodCreateStatus('loading')

  try {
    const response = await fetch('/api/admin-stage-periods-delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        period_id: periodId,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setStagePeriodCreateStatus(
        data.error || 'Erreur lors de la suppression de la période.',
      )
      return
    }

    await loadAdminData()
    setStagePeriodCreateStatus('success')
  } catch {
    setStagePeriodCreateStatus('error')
  }
}

   async function handleCreateLocation(event) {
     event.preventDefault()
     setLocationCreateStatus('loading')

     try {
       const response = await fetch('/api/admin-locations-create', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(newLocation),
       })

       const data = await response.json()

       if (!response.ok) {
         setLocationCreateStatus(
           data.error || 'Erreur lors de la création du lieu.',
         )
         return
       }

       setNewLocation({
         name: '',
         address_street: '',
         address_postal_village: '',
       })

       await loadAdminData()
       setLocationCreateStatus('success')
     } catch {
       setLocationCreateStatus('error')
     }
   }

  async function handleDisableLocation(locationId) {
    if (
      !window.confirm(
        'Voulez-vous vraiment désactiver ce lieu ?',
      )
    ) {
      return
    }

    setLocationActionStatus((current) => ({
      ...current,
      [locationId]: 'loading',
    }))

    try {
      const response = await fetch('/api/admin-locations-disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location_id: locationId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setLocationActionStatus((current) => ({
          ...current,
          [locationId]:
            data.error || 'Erreur lors de la désactivation.',
        }))
        return
      }

      setLocations((current) =>
        current.map((location) =>
          location.location_id === locationId
            ? data.location
            : location,
        ),
      )

      setLocationActionStatus((current) => ({
        ...current,
        [locationId]: 'disabled',
      }))
    } catch {
      setLocationActionStatus((current) => ({
        ...current,
        [locationId]: 'error',
      }))
    }
  }

async function handleReactivateLocation(locationId) {
  if (
    !window.confirm(
      'Voulez-vous vraiment réactiver ce lieu ?',
    )
  ) {
    return
  }

  setLocationActionStatus((current) => ({
    ...current,
    [locationId]: 'loading',
  }))

  try {
    const response = await fetch('/api/admin-locations-reactivate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location_id: locationId,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setLocationActionStatus((current) => ({
        ...current,
        [locationId]:
          data.error || 'Erreur lors de la réactivation.',
      }))
      return
    }

    setLocations((current) =>
      current.map((location) =>
        location.location_id === locationId
          ? data.location
          : location,
      ),
    )

    setLocationActionStatus((current) => ({
      ...current,
      [locationId]: 'reactivated',
    }))
  } catch {
    setLocationActionStatus((current) => ({
      ...current,
      [locationId]: 'error',
    }))
  }
}

  function handleEditLocation(location) {
    setEditingLocationId(location.location_id)
    setEditingLocation({
      name: location.name,
      address_street: location.address_street,
      address_postal_village: location.address_postal_village,
    })
  }

async function handleSaveLocation() {
  setLocationActionStatus((current) => ({
    ...current,
    [editingLocationId]: 'loading',
  }))

  try {
    const response = await fetch('/api/admin-locations-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location_id: editingLocationId,
        name: editingLocation.name,
        address_street: editingLocation.address_street,
        address_postal_village: editingLocation.address_postal_village,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setLocationActionStatus((current) => ({
        ...current,
        [editingLocationId]:
          data.error || 'Erreur lors de la modification.',
      }))
      return
    }

    setLocations((current) =>
      current.map((location) =>
        location.location_id === editingLocationId
          ? data.location
          : location,
      ),
    )

    setEditingLocationId(null)
    setLocationActionStatus((current) => ({
      ...current,
      [editingLocationId]: 'saved',
    }))
  } catch {
    setLocationActionStatus((current) => ({
      ...current,
      [editingLocationId]: 'error',
    }))
  }
}

  async function handleApproveLocationRequest(locationRequestId) {
    try {
      const response = await fetch('/api/admin-location-request-approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location_request_id: locationRequestId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Erreur lors de la validation.')
        return
      }

      await loadAdminData()
    } catch {
      alert('Erreur lors de la validation.')
    }
  }

  async function handleRejectLocationRequest(locationRequestId) {
    try {
      const response = await fetch('/api/admin-location-request-reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location_request_id: locationRequestId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Erreur lors du refus.')
        return
      }

      await loadAdminData()
    } catch {
      alert('Erreur lors du refus.')
    }
  }

  async function handleActivateFamily(familyId) {
    setFamilyActionStatus((current) => ({
      ...current,
      [familyId]: 'loading',
    }))

    try {
      const response = await fetch('/api/admin-families-activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          family_id: familyId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setFamilyActionStatus((current) => ({
          ...current,
          [familyId]: data.error || 'Erreur lors de la validation.',
        }))
        return
      }

      setFamilies((current) =>
        current.map((family) =>
          family.family_id === familyId ? data.family : family,
        ),
      )

      setFamilyActionStatus((current) => ({
        ...current,
        [familyId]: 'success',
      }))
    } catch {
      setFamilyActionStatus((current) => ({
        ...current,
        [familyId]: 'error',
      }))
    }
  }

  async function handleSuspendFamily(familyId) {
    if (
      !window.confirm(
        'Voulez-vous vraiment suspendre cette famille ?',
      )
    ) {
      return
    }

    setFamilyActionStatus((current) => ({
      ...current,
      [familyId]: 'loading',
    }))

    try {
      const response = await fetch('/api/admin-families-suspend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          family_id: familyId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setFamilyActionStatus((current) => ({
          ...current,
          [familyId]: data.error || 'Erreur lors de la suspension.',
        }))
        return
      }

      setFamilies((current) =>
        current.map((family) =>
          family.family_id === familyId ? data.family : family,
        ),
      )

      setFamilyActionStatus((current) => ({
        ...current,
        [familyId]: 'suspended',
      }))
    } catch {
      setFamilyActionStatus((current) => ({
        ...current,
        [familyId]: 'error',
      }))
    }
  }

async function handleResetFamilyPassword(family) {
  if (
    !window.confirm(
      `Voulez-vous vraiment réinitialiser le mot de passe de ${family.parent_first_name} ${family.parent_last_name} ?\n\nUn mot de passe temporaire sera généré et les sessions existantes seront déconnectées.`,
    )
  ) {
    return
  }

  setFamilyActionStatus((current) => ({
    ...current,
    [family.family_id]: 'loading',
  }))

  try {
    const response = await fetch(
      '/api/admin-auth-reset-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: family.auth_user_id,
        }),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      setFamilyActionStatus((current) => ({
        ...current,
        [family.family_id]:
          data.error ||
          'Erreur lors de la réinitialisation du mot de passe.',
      }))
      return
    }

    const temporaryPassword = data.temporary_password
    
    const passwordWindow = window.open(    
      '',
      '_blank',
      'width=500,height=300',
    )
    
    if (passwordWindow) {
      passwordWindow.document.write(`
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <title>Mot de passe temporaire</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 24px;
              }
    
              h2 {
                margin-top: 0;
              }
    
              input {
                width: 100%;
                box-sizing: border-box;
                padding: 10px;
                font-size: 16px;
                margin: 12px 0;
              }
    
              button {
                padding: 10px 16px;
                font-size: 15px;
                cursor: pointer;
              }
    
              p {
                line-height: 1.5;
              }
            </style>
          </head>
          <body>
            <h2>Mot de passe temporaire</h2>
    
            <p>
              Mot de passe temporaire pour
              ${family.parent_first_name} ${family.parent_last_name} :
            </p>
    
            <input
              id="password"
              type="text"
              value="${temporaryPassword}"
              readonly
            >

            <button
              onclick="
                const input = document.getElementById('password');
                input.select();
                navigator.clipboard.writeText(input.value);
              "
            >
              Copier le mot de passe
            </button>
    
            <p>
              Communiquez ce mot de passe à la famille par un moyen approprié.
              Elle pourra ensuite le remplacer dans « Mon compte ».
            </p>
          </body>
        </html>
      `)

      passwordWindow.document.close()
    }

    setFamilyActionStatus((current) => ({
      ...current,
      [family.family_id]: 'password-reset',
    }))
  } catch {
    setFamilyActionStatus((current) => ({
      ...current,
      [family.family_id]: 'error',
    }))
  }
}

async function handleReactivateFamily(familyId) {
  if (
    !window.confirm(
      'Voulez-vous vraiment réactiver cette famille ?',
    )
  ) {
    return
  }

  setFamilyActionStatus((current) => ({
    ...current,
    [familyId]: 'loading',
  }))

  try {
    const response = await fetch('/api/admin-families-reactivate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        family_id: familyId,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setFamilyActionStatus((current) => ({
        ...current,
        [familyId]: data.error || 'Erreur lors de la réactivation.',
      }))
      return
    }

    setFamilies((current) =>
      current.map((family) =>
        family.family_id === familyId ? data.family : family,
      ),
    )

    setFamilyActionStatus((current) => ({
      ...current,
      [familyId]: 'active',
    }))
  } catch {
    setFamilyActionStatus((current) => ({
      ...current,
      [familyId]: 'error',
    }))
  }
}

async function handleApproveAddress(familyId) {
  const response = await fetch('/api/admin-families-address-approve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ family_id: familyId }),
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Erreur lors de la validation de l’adresse.')
  }

  await loadAdminData()
}

async function handleRejectAddress(familyId) {
  const response = await fetch('/api/admin-families-address-reject', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ family_id: familyId }),
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Erreur lors du refus de l’adresse.')
  }

  await loadAdminData()
}

async function handleDisableFamily(familyId) {
  if (
    !window.confirm(
      'Voulez-vous vraiment désactiver cette famille ?',
    )
  ) {
    return
  }

  setFamilyActionStatus((current) => ({
    ...current,
    [familyId]: 'loading',
  }))

  try {
    const response = await fetch('/api/admin-families-disable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        family_id: familyId,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setFamilyActionStatus((current) => ({
        ...current,
        [familyId]: data.error || 'Erreur lors de la désactivation.',
      }))
      return
    }

    setFamilies((current) =>
      current.map((family) =>
        family.family_id === familyId ? data.family : family,
      ),
    )

    setFamilyActionStatus((current) => ({
      ...current,
      [familyId]: 'disabled',
    }))
  } catch {
    setFamilyActionStatus((current) => ({
      ...current,
      [familyId]: 'error',
    }))
  }
}

if (status === 'loading') {
    return (
      <main>
        <h1>Administration</h1>
        <p>Chargement…</p>
      </main>
    )
  }

  if (status === 'forbidden') {
    return (
      <main>
        <h1>Accès interdit</h1>
        <p>Vous n'avez pas accès à l'administration.</p>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main>
        <h1>Erreur</h1>
        <p>Impossible de charger les données d'administration.</p>
      </main>
    )
  }


  const sortFamiliesByParentLastName = (a, b) =>
    a.parent_last_name.localeCompare(
      b.parent_last_name,
      'fr',
      { sensitivity: 'base' },
    )

  const pendingFamilies = families
    .filter((family) => family.status === 'pending')
    .sort(sortFamiliesByParentLastName)

  const activeFamilies = families
    .filter((family) => family.status === 'active')
    .sort(sortFamiliesByParentLastName)

  const suspendedFamilies = families
    .filter((family) => family.status === 'suspended')
    .sort(sortFamiliesByParentLastName)

  const disabledFamilies = families
    .filter((family) => family.status === 'disabled')
    .sort(sortFamiliesByParentLastName)

  return (
    <main>
      <h1>Administration</h1>

<AdminNotifications />

      <details>
        <summary><h2>Familles</h2></summary>

        {families.length === 0 ? (
  <p>Aucune famille inscrite.</p>
) : (
  <>
    {pendingFamilies.length > 0 && (
      <section
        className="admin-family-group"
        style={{
          background: '#fff4f4',
          border: '1px solid #e0b4b4',
          padding: '16px',
          marginBottom: '20px',
          borderRadius: '8px',
        }}
      >
        <h3>Inscriptions en attente</h3>

        <ul>
          {pendingFamilies.map((family) => (
            <li
              key={family.family_id}
              style={{
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              <strong>
                {family.parent_first_name} {family.parent_last_name}
              </strong>
              {' — '}
              E-mail : {family.email}
              {' — '}
              Enfants : {family.children_last_name}
              {' — '}
              Adresse : {family.address_street},{' '}
              {family.address_postal_village}
              {' — '}
              Téléphone : {family.phone}
              {' — '}
              Statut : {family.status}

              {family.pending_address_status === 'pending' && (
                <div>
                  <strong>
                    🔔 Demande de changement d’adresse en attente
                  </strong>
                  <br />
                  Adresse demandée : {family.pending_address_street},{' '}
                  {family.pending_address_postal_village}
                  <br />
                  <button
                    type="button"
                    onClick={() =>
                      handleApproveAddress(family.family_id)
                    }
                  >
                    Valider
                  </button>{' '}
                  <button
                    type="button"
                    onClick={() =>
                      handleRejectAddress(family.family_id)
                    }
                  >
                    Refuser
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  handleActivateFamily(family.family_id)
                }
                disabled={
                  familyActionStatus[family.family_id] === 'loading'
                }
              >
                {familyActionStatus[family.family_id] === 'loading'
                  ? 'Validation…'
                  : 'Valider'}
              </button>{' '}

              {['pending', 'active', 'suspended'].includes(family.status) && (
                <button
                  type="button"
                  onClick={() =>
                    handleDisableFamily(family.family_id)
                  }
                  disabled={
                    familyActionStatus[family.family_id] === 'loading'
                  }
                >
                  {familyActionStatus[family.family_id] === 'loading'
                    ? 'Désactivation…'
                    : 'Désactiver'}
                </button>
              )}

              {familyActionStatus[family.family_id] === 'success' && (
                <p>Famille validée.</p>
              )}

              {familyActionStatus[family.family_id] === 'disabled' && (
                <p>Famille désactivée.</p>
              )}

              {familyActionStatus[family.family_id] === 'error' && (
                <p>Erreur lors de l'action.</p>
              )}

              {typeof familyActionStatus[family.family_id] === 'string' &&
                ![
                  'loading',
                  'success',
                  'suspended',
                  'active',
                  'disabled',
                  'error',
                ].includes(familyActionStatus[family.family_id]) && (
                  <p>{familyActionStatus[family.family_id]}</p>
                )}
            </li>
          ))}
        </ul>
      </section>
    )}

    {activeFamilies.length > 0 && (
      <section
        className="admin-family-group admin-family-active"
        style={{
          background: '#f2f8f2',
          border: '1px solid #b8d8b8',
          padding: '16px',
          marginBottom: '20px',
          borderRadius: '8px',
        }}
      >
        <h3>Familles actives</h3>
    
        <ul>

          {activeFamilies.map((family) => (
            <li
              key={family.family_id}
              style={{ marginBottom: '16px' }}
            >
              <strong>
                {family.parent_first_name} {family.parent_last_name}
              </strong>
              {' — '}
              E-mail : {family.email}
              {' — '}
              Enfants : {family.children_last_name}
              {' — '}
              Adresse : {family.address_street},{' '}
              {family.address_postal_village}
              {' — '}
              Téléphone : {family.phone}
              {' — '}
              Statut : {family.status}

              {family.pending_address_status === 'pending' && (
                <div>
                  <strong>
                    🔔 Demande de changement d’adresse en attente
                  </strong>
                  <br />
                  Adresse demandée : {family.pending_address_street},{' '}
                  {family.pending_address_postal_village}
                  <br />
                  <button
                    type="button"
                    onClick={() =>
                      handleApproveAddress(family.family_id)
                    }
                  >
                    Valider
                  </button>{' '}
                  <button
                    type="button"
                    onClick={() =>
                      handleRejectAddress(family.family_id)
                    }
                  >
                    Refuser
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  handleResetFamilyPassword(family)
                }
                disabled={
                  familyActionStatus[family.family_id] === 'loading'
                }
              >
                {familyActionStatus[family.family_id] === 'loading'
                  ? 'Réinitialisation…'
                  : 'Réinitialiser le mot de passe'}
              </button>{' '}

              <button
                type="button"
                onClick={() =>
                  handleSuspendFamily(family.family_id)
                }
                disabled={
                  familyActionStatus[family.family_id] === 'loading'
                }
              >
                {familyActionStatus[family.family_id] === 'loading'
                  ? 'Suspension…'
                  : 'Suspendre'}
              </button>{' '}

              <button
                type="button"
                onClick={() =>
                  handleDisableFamily(family.family_id)
                }
                disabled={
                  familyActionStatus[family.family_id] === 'loading'
                }
              >
                {familyActionStatus[family.family_id] === 'loading'
                  ? 'Désactivation…'
                  : 'Désactiver'}
              </button>

              {familyActionStatus[family.family_id] === 'suspended' && (
                <p>Famille suspendue.</p>
              )}

              {familyActionStatus[family.family_id] === 'disabled' && (
                <p>Famille désactivée.</p>
              )}

              {familyActionStatus[family.family_id] === 'error' && (
                <p>Erreur lors de l'action.</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    )}

    {suspendedFamilies.length > 0 && (
      <section
        className="admin-family-group"
        style={{
          background: '#fff8ed',
          border: '1px solid #e5c48a',
          padding: '16px',
          marginBottom: '20px',
          borderRadius: '8px',
        }}
      >
        <h3>Familles suspendues</h3>
    
        <ul>

          {suspendedFamilies.map((family) => (
            <li
              key={family.family_id}
              style={{ marginBottom: '16px' }}
            >
              <strong>
                {family.parent_first_name} {family.parent_last_name}
              </strong>
              {' — '}
              E-mail : {family.email}
              {' — '}
              Enfants : {family.children_last_name}
              {' — '}
              Adresse : {family.address_street},{' '}
              {family.address_postal_village}
              {' — '}
              Téléphone : {family.phone}
              {' — '}
              Statut : {family.status}

              {family.pending_address_status === 'pending' && (
                <div>
                  <strong>
                    🔔 Demande de changement d’adresse en attente
                  </strong>
                  <br />
                  Adresse demandée : {family.pending_address_street},{' '}
                  {family.pending_address_postal_village}
                  <br />
                  <button
                    type="button"
                    onClick={() =>
                      handleApproveAddress(family.family_id)
                    }
                  >
                    Valider
                  </button>{' '}
                  <button
                    type="button"
                    onClick={() =>
                      handleRejectAddress(family.family_id)
                    }
                  >
                    Refuser
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  handleReactivateFamily(family.family_id)
                }
                disabled={
                  familyActionStatus[family.family_id] === 'loading'
                }
              >
                {familyActionStatus[family.family_id] === 'loading'
                  ? 'Réactivation…'
                  : 'Réactiver'}
              </button>{' '}

              <button
                type="button"
                onClick={() =>
                  handleDisableFamily(family.family_id)
                }
                disabled={
                  familyActionStatus[family.family_id] === 'loading'
                }
              >
                {familyActionStatus[family.family_id] === 'loading'
                  ? 'Désactivation…'
                  : 'Désactiver'}
              </button>

              {familyActionStatus[family.family_id] === 'active' && (
                <p>Famille réactivée.</p>
              )}

              {familyActionStatus[family.family_id] === 'disabled' && (
                <p>Famille désactivée.</p>
              )}

              {familyActionStatus[family.family_id] === 'error' && (
                <p>Erreur lors de l'action.</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    )}

    {disabledFamilies.length > 0 && (
      <section
        className="admin-family-group admin-family-disabled"
        style={{
          background: '#f3f3f3',
          border: '1px solid #cccccc',
          padding: '16px',
          marginBottom: '20px',
          borderRadius: '8px',
        }}
      >
        <h3>Familles désactivées</h3>
    
        <ul>

          {disabledFamilies.map((family) => (
            <li
              key={family.family_id}
              style={{ marginBottom: '16px' }}
            >
              <strong>
                {family.parent_first_name} {family.parent_last_name}
              </strong>
              {' — '}
              E-mail : {family.email}
              {' — '}
              Enfants : {family.children_last_name}
              {' — '}
              Adresse : {family.address_street},{' '}
              {family.address_postal_village}
              {' — '}
              Téléphone : {family.phone}
              {' — '}
              Statut : {family.status}

              {family.disabled_at && (
                <>
                  {' — '}
                  Désactivée le :{' '}
                  {new Date(
                    family.disabled_at,
                  ).toLocaleDateString('fr-BE')}
                </>
              )}

              {family.pending_address_status === 'pending' && (
                <div>
                  <strong>
                    🔔 Demande de changement d’adresse en attente
                  </strong>
                  <br />
                  Adresse demandée : {family.pending_address_street},{' '}
                  {family.pending_address_postal_village}
                  <br />
                  <button
                    type="button"
                    onClick={() =>
                      handleApproveAddress(family.family_id)
                    }
                  >
                    Valider
                  </button>{' '}
                  <button
                    type="button"
                    onClick={() =>
                      handleRejectAddress(family.family_id)
                    }
                  >
                    Refuser
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  handleReactivateFamily(family.family_id)
                }
                disabled={
                  familyActionStatus[family.family_id] === 'loading'
                }
              >
                {familyActionStatus[family.family_id] === 'loading'
                  ? 'Réactivation…'
                  : 'Réactiver'}
              </button>

              {familyActionStatus[family.family_id] === 'active' && (
                <p>Famille réactivée.</p>
              )}

              {familyActionStatus[family.family_id] === 'error' && (
                <p>Erreur lors de l'action.</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    )}
  </>
)}
</details>      
      
      <section>
      <details>
        <summary><h2>Années scolaires</h2></summary>

        <form onSubmit={handleCreateSchoolYear}>
          <label>
            Nouvelle année scolaire
            <input
              type="text"
              value={newSchoolYear}
              onChange={(event) => setNewSchoolYear(event.target.value)}
              placeholder="Ex. 2027-2028"
            />
          </label>

          <button type="submit" disabled={createStatus === 'loading'}>
            Ajouter
          </button>
        </form>

        {createStatus === 'success' && (
          <p>Année scolaire créée.</p>
        )}

        {createStatus &&
          createStatus !== 'loading' &&
          createStatus !== 'success' &&
          createStatus !== 'error' && (
            <p>{createStatus}</p>
          )}

        {createStatus === 'error' && (
          <p>Erreur lors de la création.</p>
        )}

        {schoolYears.length === 0 ? (
          <p>Aucune année scolaire.</p>
        ) : (
          <ul>
{schoolYears.map((schoolYear) => (
  <li key={schoolYear.school_year_id}>
    <strong>{schoolYear.label}</strong> — {schoolYear.status}

    {schoolYear.status === 'active' && (
      <>
        {' '}
        <button
          type="button"
          onClick={() =>
            handleArchiveSchoolYear(schoolYear.school_year_id)
          }
          disabled={createStatus === 'loading'}
        >
          {createStatus === 'loading'
            ? 'Archivage…'
            : 'Archiver'}
        </button>
      </>
    )}
  </li>
))}

          </ul>
        )}
      </details>
      </section>
	
      <section>
        <details>
          <summary><h2>Lieux</h2></summary>

{locations.length === 0 ? (
  <p>Aucun lieu.</p>
) : (
  <ul>
    {locations.map((location) => (
      <li key={location.location_id}>
        <strong>{location.name}</strong> —{' '}
        {location.address_street},{' '}
        {location.address_postal_village} — {location.status}

        {location.status === 'active' && (
          <>
            {' '}

            <button
              type="button"
              onClick={() => handleEditLocation(location)}
            >
              Modifier
            </button>

            <button
              type="button"
              onClick={() =>
                handleDisableLocation(location.location_id)
              }
              disabled={
                locationActionStatus[location.location_id] ===
                'loading'
              }
            >
              {locationActionStatus[location.location_id] === 'loading'
                ? 'Désactivation…'
                : 'Désactiver'}
            </button>

            {editingLocationId === location.location_id && (
              <div>
                <p>
                  <label>
                    Nom du lieu
                    <input
                      type="text"
                      value={editingLocation.name}
                      onChange={(event) =>
                        setEditingLocation((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                    />
                  </label>
                </p>

                <p>
                  <label>
                    Rue et numéro
                    <input
                      type="text"
                      value={editingLocation.address_street}
                      onChange={(event) =>
                        setEditingLocation((current) => ({
                          ...current,
                          address_street: event.target.value,
                        }))
                      }
                    />
                  </label>
                </p>

                <p>
                  <label>
                    Code postal et village
                    <input
                      type="text"
                      value={editingLocation.address_postal_village}
                      onChange={(event) =>
                        setEditingLocation((current) => ({
                          ...current,
                          address_postal_village: event.target.value,
                        }))
                      }
                    />
                  </label>
                </p>

                <p>
                  <button
                    type="button"
                    onClick={handleSaveLocation}
                    disabled={
                      locationActionStatus[location.location_id] ===
                      'loading'
                    }
                  >
                    {locationActionStatus[location.location_id] ===
                    'loading'
                      ? 'Enregistrement…'
                      : 'Enregistrer'}
                  </button>{' '}
                  <button
                    type="button"
                    onClick={() => setEditingLocationId(null)}
                  >
                    Annuler
                  </button>
                </p>
              </div>
            )}
          </>
        )}

        {location.status === 'disabled' && (
          <>
            <p>Lieu désactivé.</p>
        
            <button
              type="button"
              onClick={() =>
                handleReactivateLocation(location.location_id)
              }
              disabled={
                locationActionStatus[location.location_id] === 'loading'
              }
            >
              {locationActionStatus[location.location_id] === 'loading'
                ? 'Réactivation…'
                : 'Réactiver'}
            </button>
          </>
        )}

        {locationActionStatus[location.location_id] === 'error' && (
          <p>Erreur lors de l'action sur le lieu.</p>
        )}

        {typeof locationActionStatus[location.location_id] === 'string' &&
          !['loading', 'disabled', 'error'].includes(
            locationActionStatus[location.location_id],
          ) && (
            <p>{locationActionStatus[location.location_id]}</p>
          )}
      </li>
    ))}
  </ul>
)}

<h3>Demandes de création de lieu</h3>

<p>
  Nombre de demandes en attente :{' '}
  {locationRequests.filter(
    (request) => request.status === 'pending',
  ).length}
</p>

{locationRequests.filter(
  (request) => request.status === 'pending',
).length === 0 ? (
  <p>Aucune demande en attente.</p>
) : (
  <ul>
    {locationRequests
      .filter((request) => request.status === 'pending')
      .map((request) => (
        <li key={request.location_request_id}>
          <strong>{request.requested_name}</strong> —{' '}
          {request.requested_address_street},{' '}
          {request.requested_address_postal_village}

          <div>
            <button
              type="button"
              onClick={() =>
                handleApproveLocationRequest(request.location_request_id)
              }
            >
              Valider
            </button>{' '}
            <button
              type="button"
              onClick={() =>
                handleRejectLocationRequest(request.location_request_id)
              }
            >
              Refuser
            </button>
          </div>
        </li>
      ))}
  </ul>
)}

      </details>
      </section>

      <section>
        <details>
          <summary><h2>Périodes de stage</h2></summary>

        <form onSubmit={handleCreateStagePeriod}>
          <label>
            Année scolaire
            <select
              value={newStagePeriod.school_year_id}
              onChange={(event) =>
                setNewStagePeriod((current) => ({
                  ...current,
                  school_year_id: event.target.value,
                }))
              }
              required
            >
              <option value="">Choisir…</option>
              {schoolYears.map((schoolYear) => (
                <option
                  key={schoolYear.school_year_id}
                  value={schoolYear.school_year_id}
                >
                  {schoolYear.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Nom de la période
            <input
              type="text"
              value={newStagePeriod.label}
              onChange={(event) =>
                setNewStagePeriod((current) => ({
                  ...current,
                  label: event.target.value,
                }))
              }
              placeholder="Ex. Toussaint"
              required
            />
          </label>

          <button
            type="submit"
            disabled={stagePeriodCreateStatus === 'loading'}
          >
            {stagePeriodCreateStatus === 'loading'
              ? 'Ajout…'
              : 'Ajouter'}
          </button>
        </form>

        {stagePeriodCreateStatus === 'success' && (
          <p>Opération effectuée avec succès.</p>
        )}

        {stagePeriodCreateStatus === 'error' && (
          <p>Erreur lors de la création.</p>
        )}

        {stagePeriodCreateStatus &&
          stagePeriodCreateStatus !== 'loading' &&
          stagePeriodCreateStatus !== 'success' &&
          stagePeriodCreateStatus !== 'error' && (
            <p>{stagePeriodCreateStatus}</p>
          )}

{stagePeriods.length === 0 ? (
  <p>Aucune période.</p>
) : (
  <>
    <h3>Périodes actives</h3>

    {stagePeriods.filter(
      (stagePeriod) => stagePeriod.status === 'active',
    ).length === 0 ? (
      <p>Aucune période active.</p>
    ) : (
      <ul>
        {stagePeriods
          .filter(
            (stagePeriod) => stagePeriod.status === 'active',
          )
          .map((stagePeriod) => (
            <li key={stagePeriod.period_id}>
              {editingStagePeriodId === stagePeriod.period_id ? (
                <>
                  <input
                    type="text"
                    value={editingStagePeriodLabel}
                    onChange={(event) =>
                      setEditingStagePeriodLabel(event.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateStagePeriod(
                        stagePeriod.period_id,
                        editingStagePeriodLabel,
                        stagePeriod.status,
                      )
                    }
                  >
                    Enregistrer
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingStagePeriodId(null)
                      setEditingStagePeriodLabel('')
                    }}
                  >
                    Annuler
                  </button>
                </>
              ) : (
                <>
                  <strong>{stagePeriod.label}</strong> — Actif

                  <button
                    type="button"
                    style={{ marginLeft: '10px' }}
                    onClick={() => {
                      setEditingStagePeriodId(stagePeriod.period_id)
                      setEditingStagePeriodLabel(stagePeriod.label)
                      setStagePeriodCreateStatus('')
                    }}
                  >
                    Modifier
                  </button>

                  <button
                    type="button"
                    style={{ marginLeft: '10px' }}
                    onClick={() =>
                      handleArchiveStagePeriod(stagePeriod.period_id)
                    }
                  >
                    Archiver
                  </button>

                  <button
                    type="button"
                    style={{ marginLeft: '10px' }}
                    onClick={() =>
                      handleDeleteStagePeriod(stagePeriod.period_id)
                    }
                  >
                    Supprimer
                  </button>
                </>
              )}
            </li>
          ))}
      </ul>
    )}

    <h3>Périodes archivées</h3>

    {stagePeriods.filter(
      (stagePeriod) => stagePeriod.status === 'archived',
    ).length === 0 ? (
      <p>Aucune période archivée.</p>
    ) : (
      <ul>
        {stagePeriods
          .filter(
            (stagePeriod) => stagePeriod.status === 'archived',
          )
          .map((stagePeriod) => (
            <li key={stagePeriod.period_id}>
              {editingStagePeriodId === stagePeriod.period_id ? (
                <>
                  <input
                    type="text"
                    value={editingStagePeriodLabel}
                    onChange={(event) =>
                      setEditingStagePeriodLabel(event.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateStagePeriod(
                        stagePeriod.period_id,
                        editingStagePeriodLabel,
                        stagePeriod.status,
                      )
                    }
                  >
                    Enregistrer
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingStagePeriodId(null)
                      setEditingStagePeriodLabel('')
                    }}
                  >
                    Annuler
                  </button>
                </>
              ) : (
                <>
                  <strong>{stagePeriod.label}</strong> — Archivé

                  <button
                    type="button"
                    style={{ marginLeft: '10px' }}
                    onClick={() => {
                      setEditingStagePeriodId(stagePeriod.period_id)
                      setEditingStagePeriodLabel(stagePeriod.label)
                      setStagePeriodCreateStatus('')
                    }}
                  >
                    Modifier
                  </button>

                  <button
                    type="button"
                    style={{ marginLeft: '10px' }}
                    onClick={() => handleReactivateStagePeriod(stagePeriod.period_id)}
                  >
                    Réactiver
                  </button>

                  <button
                    type="button"
                    style={{ marginLeft: '10px' }}
                    onClick={() =>
                      handleDeleteStagePeriod(stagePeriod.period_id)
                    }
                  >
                    Supprimer
                  </button>
                </>
              )}
            </li>
          ))}
      </ul>
    )}
  </>
)}

      </details>
    </section>
  </main>
)
}