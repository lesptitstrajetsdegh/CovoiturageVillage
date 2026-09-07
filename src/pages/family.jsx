import { useEffect, useState } from 'react'

function getWeekdayLabel(weekday) {
  const labels = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
  }

  return labels[weekday] ?? weekday
}

function getDirectionLabel(direction) {
  return direction === 'outbound' ? 'Aller' : 'Retour'
}

function getParticipationLabel(participationType) {
  const labels = {
    drive_with_space: 'Places disponibles',
    need_ride: "Besoin d'un trajet",
    interested_rotation: 'Rotation',
  }

  return labels[participationType] ?? participationType
}

export function Family() {
  const [family, setFamily] = useState(undefined)
  const [error, setError] = useState(null)
  const [trips, setTrips] = useState([])
  const [tripsError, setTripsError] = useState(null)
  const [years, setYears] = useState([])
  const [locations, setLocations] = useState([])
  const [stagePeriods, setStagePeriods] = useState([])
  const [showTripForm, setShowTripForm] = useState(false)
  const [showMyTrips, setShowMyTrips] = useState(true)
  const [editingTripId, setEditingTripId] = useState(null)
  const [savingTrip, setSavingTrip] = useState(false)
  const [tripSaved, setTripSaved] = useState(false)
  const [tripError, setTripError] = useState(null)
  const [tripContacts, setTripContacts] = useState({})
  const [tripContactError, setTripContactError] = useState(null)
  const [showLocationRequestForm, setShowLocationRequestForm] = useState(false)
  const [locationRequestForm, setLocationRequestForm] = useState({
    requested_name: '',
    requested_address_street: '',
    requested_address_postal_village: '',
  })
  const [locationRequestStatus, setLocationRequestStatus] = useState(null)
  const [searchForm, setSearchForm] = useState({
    category: 'activity',
    location_ids: [],
    weekday: '',
    period_id: '',
    time: '',
    direction: '',
    car_trip_type: '',
    participation_types: [],
  })

  const [searchTrips, setSearchTrips] = useState([])
  const [searchingTrips, setSearchingTrips] = useState(false)
  const [searchTripsError, setSearchTripsError] = useState(null)

  const [tripForm, setTripForm] = useState({
    trip_id: null,
    school_year_id: '',
    category: 'activity',
    location_id: '',
    weekday: 'monday',
    period_id: '',
    time_on_site: '',
    direction: 'outbound',
    car_trip_type: 'simple',
    participation_type: 'need_ride',
    additional_info: '',
  })

  async function loadFamily() {
    try {
      const response = await fetch('/api/family')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement')
      }

      setFamily(data.family)
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error))
    }
  }

  async function loadTrips() {
    try {
      const response = await fetch('/api/family-trips')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement des trajets')
      }

      setTrips(data.trips ?? [])
    } catch (error) {
      setTripsError(
        error instanceof Error ? error.message : String(error),
      )
    }
  }

  async function loadTripOptions() {
    try {
const [yearsResponse, locationsResponse, stagePeriodsResponse] =
  await Promise.all([
    fetch('/api/family-school-years'),
    fetch('/api/family-locations'),
    fetch('/api/family-stage-periods'),
  ])

      const yearsData = await yearsResponse.json()
      const locationsData = await locationsResponse.json()
      const stagePeriodsData = await stagePeriodsResponse.json()

      if (!yearsResponse.ok) {
        throw new Error(
          yearsData.error || 'Erreur lors du chargement des années scolaires',
        )
      }

     if (!stagePeriodsResponse.ok) {
       throw new Error(
         stagePeriodsData.error ||
           'Erreur lors du chargement des périodes de stage',
       )
     }

      if (!locationsResponse.ok) {
        throw new Error(
          locationsData.error || 'Erreur lors du chargement des lieux',
        )
      }

      setYears(yearsData.school_years ?? [])
      setLocations(locationsData.locations ?? [])
      setStagePeriods(stagePeriodsData.stage_periods ?? [])
    } catch (error) {
      setTripError(
        error instanceof Error ? error.message : String(error),
      )
    }
  }

  useEffect(() => {
    loadFamily()
    loadTrips()
    loadTripOptions()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleTripChange(event) {
    const { name, value } = event.target

    setTripForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSearchChange(event) {
    const { name, value } = event.target

    setSearchForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSearchCheckboxChange(event) {
    const { name, value, checked } = event.target

    setSearchForm((current) => ({
      ...current,
      [name]: checked
        ? [...current[name], value]
        : current[name].filter((item) => item !== value),
    }))
  }

  async function handleSearchSubmit() {
    setSearchTripsError(null)
    setSearchingTrips(true)

    try {
      const params = new URLSearchParams()

      params.set('category', searchForm.category)

      searchForm.location_ids.forEach((locationId) => {
        params.append('location_id', locationId)
      })

      if (searchForm.weekday) {
        params.set('weekday', searchForm.weekday)
      }

      if (searchForm.period_id) {
        params.set('period_id', searchForm.period_id)
      }

      if (searchForm.time) {
        params.set('time', searchForm.time)
      }

      if (searchForm.direction) {
        params.set('direction', searchForm.direction)
      }

      if (searchForm.car_trip_type) {
        params.set('car_trip_type', searchForm.car_trip_type)
      }

      searchForm.participation_types.forEach((type) => {
        params.append('participation_type', type)
      })

      const response = await fetch(
        `/api/family-trip-search?${params.toString()}`,
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Erreur lors de la recherche des trajets',
        )
      }

      setSearchTrips(data.trips ?? [])
    } catch (error) {
      setSearchTripsError(
        error instanceof Error ? error.message : String(error),
      )
      setSearchTrips([])
    } finally {
      setSearchingTrips(false)
    }
  }

  function handleSearchReset() {
    setSearchForm({
      category: 'activity',
      location_ids: [],
      weekday: '',
      period_id: '',
      time: '',
      direction: '',
      car_trip_type: '',
      participation_types: [],
    })
    setSearchTrips([])
    setSearchTripsError(null)
    setTripContacts({})
    setTripContactError(null)
  }

async function handleShowTripContact(tripId) {
  setTripContactError(null)

  try {
    const response = await fetch(
      `/api/family-trip-contact?trip_id=${tripId}`,
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.error || 'Erreur lors du chargement des coordonnées',
      )
    }

    setTripContacts((current) => ({
      ...current,
      [tripId]: data.contact,
    }))
  } catch (error) {
    setTripContactError(
      error instanceof Error ? error.message : String(error),
    )
  }
}

  async function handleTripDelete(tripId) {
    const confirmed = window.confirm(
      'Voulez-vous vraiment supprimer ce trajet ?',
    )
  
    if (!confirmed) {
      return
    }
  
    setTripError(null)
    setTripSaved(false)

    try {
      const response = await fetch('/api/family-trips-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trip_id: tripId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Erreur lors de la suppression du trajet',
        )
      }

      setTrips((current) =>
        current.filter((trip) => trip.trip_id !== tripId),
      )
    } catch (error) {
      setTripError(
        error instanceof Error ? error.message : String(error),
      )
    }
  }

  async function handleTripStatusChange(tripId, action) {
    setTripError(null)
    setTripSaved(false)

    try {
      const response = await fetch('/api/family-trips-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trip_id: tripId,
          action,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Erreur lors de la modification du statut',
        )
      }

      setTrips((current) =>
        current.map((trip) =>
          trip.trip_id === tripId
            ? { ...trip, status: data.trip.status }
            : trip,
        ),
      )
    } catch (error) {
      setTripError(
        error instanceof Error ? error.message : String(error),
      )
    }
  }

  async function handleTripSubmit(event) {
    event.preventDefault()
    setTripError(null)
    setTripSaved(false)
    setSavingTrip(true)

    try {
      const isEditing = tripForm.trip_id !== null

      const response = await fetch(
        isEditing
          ? '/api/family-trips-update'
          : '/api/family-trips-create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...tripForm,
            ...(isEditing ? { trip_id: tripForm.trip_id } : {}),
            school_year_id: Number(tripForm.school_year_id),
            location_id: Number(tripForm.location_id),
            period_id:
              tripForm.period_id === ''
                ? null
                : Number(tripForm.period_id),
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error ||
            (isEditing
              ? 'Erreur lors de la modification du trajet'
              : 'Erreur lors de la création du trajet'),
        )
      }

      if (isEditing) {
        setTrips((current) =>
          current.map((trip) =>
            trip.trip_id === editingTripId
              ? data.trip
              : trip,
          ),
        )
      } else {
        setTrips((current) => [...current, data.trip])
      }

      setTripSaved(true)
      setShowTripForm(false)
      setEditingTripId(null)
    } catch (error) {
      setTripError(
        error instanceof Error ? error.message : String(error),
      )
    } finally {
      setSavingTrip(false)
    }
  }

  if (error && family === undefined) {
    return (
      <main>
        <p>Erreur : {error}</p>
      </main>
    )
  }

  if (family === undefined) {
    return (
      <main>
        <p>Chargement…</p>
      </main>
    )
  }

  return (
    <main>


     <h1 className="page-title">Mes trajets</h1>
     
     <button
       type="button"
       className="trip-toggle"
       onClick={() => setShowMyTrips((value) => !value)}
     >
       {showMyTrips ? '▾' : '▸'}
     </button>

     {showMyTrips && (
       <>

      {tripsError && (
        <p>Erreur : {tripsError}</p>
      )}

      {!tripsError && trips.length === 0 && (
        <p>Vous n'avez encore aucun trajet enregistré.</p>
      )}

{trips.length > 0 && (
  <ul>
    {trips.map((trip) => (
      <li key={trip.trip_id} className="trip-item">

<div className="trip-info">
  <strong>
    {trip.category === 'activity'
      ? 'Activité'
      : trip.category === 'school'
        ? 'École'
        : 'Stage'}
  
    {trip.status === 'paused' && (
      <>
        {' — '}
        <span className="trip-paused">
          Trajet en pause
        </span>
      </>
    )}
  </strong>

          <div className="trip-details">
            <span>{trip.location_name}</span>
            <span className="trip-separator">•</span>
            
            {trip.category === 'stage' ? (
              <span>
                {trip.period_label}
              </span>
            ) : (
              <span>
                {trip.weekday === 'monday'
                  ? 'Lundi'
                  : trip.weekday === 'tuesday'
                    ? 'Mardi'
                    : trip.weekday === 'wednesday'
                      ? 'Mercredi'
                      : trip.weekday === 'thursday'
                        ? 'Jeudi'
                        : trip.weekday === 'friday'
                          ? 'Vendredi'
                          : trip.weekday === 'saturday'
                            ? 'Samedi'
                            : 'Dimanche'}
              </span>
            )}
            
            <span className="trip-separator">•</span>
            <span>{trip.time_on_site.slice(0, 5)}</span>
            
          </div>
        
          <div className="trip-details">
            <span>{trip.direction === 'outbound' ? 'Aller' : 'Retour'}</span>
          
            {trip.category === 'activity' && (
              <>
                <span className="trip-separator">•</span>
                <span>
                  {trip.car_trip_type === 'round_trip'
                    ? 'Trajet Aller-retour dans la foulée'
                    : 'Trajet Simple'}
                </span>
              </>
            )}
          </div>

      <div className="trip-participation">
      <span>
        {trip.participation_type === 'drive_with_space'
          ? 'Je peux conduire'
          : trip.participation_type === 'need_ride'
            ? "J'ai besoin d'une place"
            : 'Rotation'}
      </span>
    </div>

    {trip.additional_info && (
      <div>
        Informations complémentaires : {trip.additional_info}
      </div>
    )}

        </div>

        <div>
          <button
            type="button"
            className="trip-action"
            onClick={() => {
              setEditingTripId(trip.trip_id)
              setTripError(null)
              setTripSaved(false)
            
             setTripForm({
               trip_id: trip.trip_id,
               school_year_id: String(trip.school_year_id),
               category: trip.category,
               location_id: String(trip.location_id),
               weekday: trip.weekday ?? 'monday',
               period_id:
                 trip.period_id === null
                   ? ''
                   : String(trip.period_id),
               time_on_site: trip.time_on_site.slice(0, 5),
               direction: trip.direction,
               car_trip_type: trip.car_trip_type ?? 'simple',
               participation_type: trip.participation_type,
               additional_info: trip.additional_info ?? '',
             })
            }}

          >
            Modifier
          </button>

          <button
            type="button"
            className="trip-action"
            onClick={() => handleTripDelete(trip.trip_id)}
          >
            Supprimer
          </button>
          
          {trip.status === 'active' && (
            <button
              type="button"
              className="trip-action"
              title="Masque temporairement ce trajet de la recherche, par exemple si votre voiture est momentanément complète.
Vous pourrez le réactiver plus tard."
              onClick={() => handleTripStatusChange(trip.trip_id, 'pause')}
            >
              Mettre en pause
            </button>
          )}
          
          {trip.status === 'paused' && (
            <button
              type="button"
              className="trip-action"
              onClick={() =>
                handleTripStatusChange(trip.trip_id, 'reactivate')
              }
            >
              Réactiver
            </button>
          )}

          {editingTripId === trip.trip_id && (
            <button
              type="button"
              className="trip-action"
              onClick={() => {
                setEditingTripId(null)
                setTripError(null)
                setTripSaved(false)
              }}
            >
              Annuler
            </button>
          )}

        </div>

        {editingTripId === trip.trip_id && (
          <TripForm
            tripForm={tripForm}
            handleTripChange={handleTripChange}
            handleTripSubmit={handleTripSubmit}
            years={years}
            locations={locations}
            stagePeriods={stagePeriods}
            showLocationRequestForm={showLocationRequestForm}
            setShowLocationRequestForm={setShowLocationRequestForm}
            locationRequestForm={locationRequestForm}
            setLocationRequestForm={setLocationRequestForm}
            locationRequestStatus={locationRequestStatus}
            setLocationRequestStatus={setLocationRequestStatus}
            tripError={tripError}
            savingTrip={savingTrip}
            isEditing={true}
            onCancel={() => {
              setEditingTripId(null)
              setTripError(null)
              setTripSaved(false)
            }}
          />
        )}

      </li>
    ))}
  </ul>
)}

        </>
      )}

      {family.status === 'active' && (
        <button
          type="button"
          onClick={() => {
            setEditingTripId(null)
            setShowTripForm((current) => !current)
            setTripSaved(false)
            setTripError(null)
          
            setTripForm({
              trip_id: null,
              school_year_id: '',
              category: 'activity',
              location_id: '',
              weekday: 'monday',
              period_id: '',
              time_on_site: '',
              direction: 'outbound',
              car_trip_type: 'simple',
              participation_type: 'need_ride',
              additional_info: '',          
            })
          }}

        >
          {showTripForm ? 'Annuler' : '+ Ajouter un trajet'}          
        </button>
      )}

      {showTripForm && editingTripId === null && (
        <TripForm
          tripForm={tripForm}
          handleTripChange={handleTripChange}
          handleTripSubmit={handleTripSubmit}
          years={years}
          locations={locations}
          stagePeriods={stagePeriods}
          showLocationRequestForm={showLocationRequestForm}
          setShowLocationRequestForm={setShowLocationRequestForm}
          locationRequestForm={locationRequestForm}
          setLocationRequestForm={setLocationRequestForm}
          locationRequestStatus={locationRequestStatus}
          setLocationRequestStatus={setLocationRequestStatus}
          tripError={tripError}
          savingTrip={savingTrip}
          isEditing={false}
          onCancel={() => {
            setShowTripForm(false)
            setTripError(null)
          }}
        />
      )}

      {family.status === 'active' && (
        <section className="trip-search">

<hr />

          <h2>Rechercher un trajet</h2>

          <p className="trip-field">
            <label>
              <span className="trip-field-title">Catégorie&nbsp;&nbsp;</span>
              <select
                name="category"
                value={searchForm.category}
                onChange={(event) => {
                  const category = event.target.value

                  setSearchForm((current) => ({
                    ...current,
                    category,
                    weekday:
                      category === 'stage' ? '' : current.weekday,
                    period_id:
                      category === 'stage' ? '' : current.period_id,
                    car_trip_type:
                      category === 'activity'
                        ? current.car_trip_type
                        : '',
                  }))
                }}
              >
                <option value="activity">Activité</option>
                <option value="school">École</option>
                <option value="stage">Stage</option>
              </select>
            </label>
          </p>

          <p className="trip-field">
            <span className="trip-field-title">Lieu</span>

            {locations
              .filter((location) => location.status === 'active')
              .map((location) => (
                <label key={location.location_id}>
                  <input
                    type="checkbox"
                    name="location_ids"
                    value={String(location.location_id)}
                    checked={searchForm.location_ids.includes(
                      String(location.location_id),
                    )}
                    onChange={handleSearchCheckboxChange}
                  />
                  {location.name}
                </label>
              ))}
          </p>

          {searchForm.category !== 'stage' && (
            <p className="trip-field">
              <label>
                <span className="trip-field-title">Jour&nbsp;&nbsp;</span>
                <select
                  name="weekday"
                  value={searchForm.weekday}
                  onChange={handleSearchChange}
                >
                  <option value="">Tous les jours</option>
                  <option value="monday">Lundi</option>
                  <option value="tuesday">Mardi</option>
                  <option value="wednesday">Mercredi</option>
                  <option value="thursday">Jeudi</option>
                  <option value="friday">Vendredi</option>
                  <option value="saturday">Samedi</option>
                  <option value="sunday">Dimanche</option>
                </select>
              </label>
            </p>
          )}

          {searchForm.category === 'stage' && (
            <p className="trip-field">
              <label>
                <span className="trip-field-title">Période de stage&nbsp;&nbsp;</span>
                <select
                  name="period_id"
                  value={searchForm.period_id}
                  onChange={handleSearchChange}
                >
                  <option value="">Toutes les périodes</option>
                  {stagePeriods
                    .filter(
                      (period) =>
                        String(period.school_year_id) ===
                        String(
                          years.find(
                            (schoolYear) =>
                              schoolYear.status === 'active',
                          )?.school_year_id,
                        ),
                    )
                    .map((period) => (
                      <option
                        key={period.period_id}
                        value={period.period_id}
                      >
                        {period.label}
                      </option>
                    ))}
                </select>
              </label>
            </p>
          )}

          <p className="trip-field">
            <label>
              <span className="trip-field-title">Heure sur place</span>
            </label>

            <small>
              Facultatif. Si vous indiquez une heure, les trajets situés
              dans une plage de 15 minutes avant ou après cette heure
              seront recherchés.
            </small>

            <input
              name="time"
              value={searchForm.time}
              onChange={handleSearchChange}
              type="time"
            />
          </p>

          <p className="trip-field">
            <label>
              <span className="trip-field-title">Direction&nbsp;&nbsp;</span>
              <select
                name="direction"
                value={searchForm.direction}
                onChange={handleSearchChange}
              >
                <option value="">Toutes</option>
                <option value="outbound">Aller</option>
                <option value="return">Retour</option>
              </select>
            </label>
          </p>

          {searchForm.category === 'activity' && (
            <p className="trip-field">
              <label>
                <span className="trip-field-title">Type de trajet&nbsp;&nbsp;</span>
                <select
                  name="car_trip_type"
                  value={searchForm.car_trip_type}
                  onChange={handleSearchChange}
                >
                  <option value="">Tous</option>
                  <option value="simple">Simple</option>
                  <option value="round_trip">
                    Aller-retour dans la foulée
                  </option>
                </select>
              </label>
            </p>
          )}

          <p className="trip-field">
            <span className="trip-field-title">
              Type de participation
            </span>

            <label>
              <input
                type="checkbox"
                name="participation_types"
                value="drive_with_space"
                checked={searchForm.participation_types.includes(
                  'drive_with_space',
                )}
                onChange={handleSearchCheckboxChange}
              />
              Places disponibles
            </label>

            <label>
              <input
                type="checkbox"
                name="participation_types"
                value="need_ride"
                checked={searchForm.participation_types.includes(
                  'need_ride',
                )}
                onChange={handleSearchCheckboxChange}
              />
              Besoin d'un trajet
            </label>

            <label>
              <input
                type="checkbox"
                name="participation_types"
                value="interested_rotation"
                checked={searchForm.participation_types.includes(
                  'interested_rotation',
                )}
                onChange={handleSearchCheckboxChange}
              />
              Rotation
            </label>
          </p>

          <button
            type="button"
            onClick={handleSearchSubmit}
            disabled={searchingTrips}
          >
            {searchingTrips ? 'Recherche…' : 'Rechercher'}
          </button>

          <button
            type="button"
            onClick={handleSearchReset}
            disabled={searchingTrips}
          >
            Réinitialiser
          </button>

          {searchTripsError && (
            <p>Erreur : {searchTripsError}</p>
          )}

          {!searchingTrips &&
            !searchTripsError &&
            searchTrips.length === 0 && (
              <>
                <hr className="trip-search-separator" />
                <h3 className="trip-search-results-title">
                  Résultats de la recherche
                </h3>
                <p>Aucun trajet ne correspond à votre recherche.</p>
              </>
          )}

{searchTrips.length > 0 && (
  <>
    <hr className="trip-search-separator" />
    <h3 className="trip-search-results-title">
      Résultats de la recherche
    </h3>

    <ul>
    {searchTrips.map((trip) => (
      <li key={trip.trip_id}>
        <strong>
          {trip.category === 'activity' && 'Activité'}
          {trip.category === 'school' && 'École'}
          {trip.category === 'stage' && 'Stage'}
        </strong>

        <div>
          {trip.weekday && `${getWeekdayLabel(trip.weekday)} — `}
          {trip.period_label && `${trip.period_label} — `}
          {trip.time_on_site.slice(0, 5)} —{' '}
          {getDirectionLabel(trip.direction)}
        </div>

        <div>
          Lieu : {trip.location_name}
        </div>

        {trip.category === 'activity' && (
          <div>
            Type de trajet :{' '}
            {trip.car_trip_type === 'simple'
              ? 'Simple'
              : 'Aller-retour dans la foulée'}
          </div>
        )}

        <div>
          {getParticipationLabel(trip.participation_type)}
        </div>

        {trip.additional_info && (
          <div>
            Informations complémentaires : {trip.additional_info}
          </div>
        )}

        <div>
          Famille : {trip.parent_first_name}{' '}
          {trip.parent_last_name} — enfants :{' '}
          {trip.children_last_name}
        </div>

        <button
          type="button"
          onClick={() => {
            if (tripContacts[trip.trip_id]) {
              setTripContacts((current) => {
                const next = { ...current }
                delete next[trip.trip_id]
                return next
              })
            } else {
              handleShowTripContact(trip.trip_id)
            }
          }}
        >
          {tripContacts[trip.trip_id]
            ? 'Masquer les coordonnées'
            : 'Afficher les coordonnées'}
</button>

        {tripContacts[trip.trip_id] && (
          <div>
            <p>
              <strong>
                {tripContacts[trip.trip_id].parent_first_name}{' '}
                {tripContacts[trip.trip_id].parent_last_name}
              </strong>
            </p>
        
            <p>
              Enfants : {tripContacts[trip.trip_id].children_last_name}
            </p>
               
            <p>
              Téléphone : {tripContacts[trip.trip_id].phone}
            </p>
          </div>
        )}

      </li>
    ))}
  </ul>
 </>
)}

        {tripContactError && (
          <p>Erreur : {tripContactError}</p>
        )}

        </section>
      )}

      {family.status !== 'active' && (
          <p>
            Votre inscription est en attente de validation par l'administrateur.
            Vous pourrez ajouter ou modifier vos trajets une fois votre inscription validée.
          </p>

       )}

      {tripSaved && (
        <p>Le trajet a bien été enregistré.</p>
      )}

    </main>
  )
}

function TripForm({
  tripForm,
  handleTripChange,
  handleTripSubmit,
  years,
  locations,
  stagePeriods,
  showLocationRequestForm,
  setShowLocationRequestForm,
  locationRequestForm,
  setLocationRequestForm,
  locationRequestStatus,
  setLocationRequestStatus,
  tripError,
  savingTrip,
  isEditing,
  onCancel,
}) {
  return (
    <form onSubmit={handleTripSubmit}>
      <h2 className="trip-form-title">
        {isEditing ? 'Modifier le trajet' : 'Ajouter un trajet'}
      </h2>

      <p className="trip-field">
        <label>
          <span className="trip-field-title">Année scolaire</span>
          <select
            name="school_year_id"
            value={tripForm.school_year_id}
            onChange={handleTripChange}
            required
          >
            <option value="">Choisir…</option>
            {years
              .filter((schoolYear) => schoolYear.status === 'active')
              .map((schoolYear) => (
                <option
                  key={schoolYear.school_year_id}
                  value={schoolYear.school_year_id}
                >
                  {schoolYear.label}
                </option>
              ))}
          </select>
        </label>
      </p>

      <p className="trip-field">
        <label>
          <span className="trip-field-title">Catégorie</span>
          <select
            name="category"
            value={tripForm.category}
            onChange={handleTripChange}
            required
          >
            <option value="activity">Activité</option>
            <option value="school">École</option>
            <option value="stage">Stage</option>
          </select>
        </label>
      </p>

      <p className="trip-field">
        <label>
          <span className="trip-field-title">Lieu</span>
          <select
            name="location_id"
            value={tripForm.location_id}
            onChange={handleTripChange}
            required
          >
            <option value="">Choisir…</option>
            {locations.map((location) => (
              <option
                key={location.location_id}
                value={location.location_id}
              >
                {location.name}
              </option>
            ))}
          </select>
        </label>
      </p>

      <p>
        <button
          type="button"
          onClick={() => setShowLocationRequestForm((current) => !current)}
        >
          {showLocationRequestForm
            ? 'Masquer la demande de lieu'
            : 'Le lieu recherché n’est pas dans la liste ? Demander sa création'}
        </button>
      </p>

{showLocationRequestForm && (
  <div>
    <h3>Demander la création d’un lieu</h3>

    <p>
      Indiquez le nom et l’adresse du lieu que vous souhaitez ajouter.
    </p>

    <label>
      Nom du lieu
      <input
        type="text"
        value={locationRequestForm.requested_name}
        onChange={(event) =>
          setLocationRequestForm((current) => ({
            ...current,
            requested_name: event.target.value,
          }))
        }
      />
    </label>

    <label>
      Rue et numéro
      <input
        type="text"
        value={locationRequestForm.requested_address_street}
        onChange={(event) =>
          setLocationRequestForm((current) => ({
            ...current,
            requested_address_street: event.target.value,
          }))
        }
      />
    </label>

    <label>
      Code postal et village
      <input
        type="text"
        value={locationRequestForm.requested_address_postal_village}
        onChange={(event) =>
          setLocationRequestForm((current) => ({
            ...current,
            requested_address_postal_village: event.target.value,
          }))
        }
      />
        </label>

            <p className="account-request-note">
              Les demandes sont traitées manuellement. Aucune notification automatique
              par e-mail n’est envoyée à l’administrateur. La plateforme étant gratuite
              et gérée bénévolement, un petit délai peut parfois être nécessaire.
              Si vous n’avez pas de nouvelles après 3 jours, vous pouvez nous contacter
              à{' '}
              lesptitstrajetsdegh (at) gmail.com.
            </p>

            <button
              type="button"
      disabled={locationRequestStatus === 'loading'}
      onClick={async () => {
        setLocationRequestStatus('loading')
    
        try {
          const response = await fetch('/api/location-request', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(locationRequestForm),
          })
    
          const data = await response.json()
    
          if (!response.ok) {
            setLocationRequestStatus(
              data.error || 'Erreur lors de l’envoi de la demande.',
            )
            return
          }
    
          setLocationRequestStatus('success')
          setLocationRequestForm({
            requested_name: '',
            requested_address_street: '',
            requested_address_postal_village: '',
          })
        } catch {
          setLocationRequestStatus(
            'Erreur lors de l’envoi de la demande.',
          )
        }
      }}
    >

      {locationRequestStatus === 'loading'
        ? 'Envoi…'
        : 'Envoyer la demande'}
    </button>

    {locationRequestStatus === 'success' && (
      <div className="account-success-message">
        <p>Votre demande a été envoyée à l’administrateur.</p>
    
        <p>
          <strong>À savoir :</strong> votre demande est traitée manuellement.
          Aucune notification automatique par e-mail n’est envoyée à
          l’administrateur lorsqu’une demande est introduite. La plateforme
          étant gratuite et gérée bénévolement, l’administrateur n’est pas
          disponible en permanence. Nous faisons notre possible pour traiter
          les demandes rapidement, mais un petit délai peut parfois être
          nécessaire. Merci pour votre indulgence 😊
        </p>

        <p>
          <strong>Vous n’avez pas de nouvelles après 3 jours ?</strong>{' '}
          N’hésitez pas à envoyer un petit mail à{' '}
          lesptitstrajetsdegh (at) gmail.com{' '}
          afin de nous le signaler.
        </p>
      </div>
    )}
    
    {locationRequestStatus &&
      locationRequestStatus !== 'loading' &&
      locationRequestStatus !== 'success' && (
        <p>{locationRequestStatus}</p>
      )}

  </div>
)}

      {tripForm.category !== 'stage' && (
        <p className="trip-field">
          <label>
            <span className="trip-field-title">Jour</span>
            <select
              name="weekday"
              value={tripForm.weekday}
              onChange={handleTripChange}
              required
            >
              <option value="monday">Lundi</option>
              <option value="tuesday">Mardi</option>
              <option value="wednesday">Mercredi</option>
              <option value="thursday">Jeudi</option>
              <option value="friday">Vendredi</option>
              <option value="saturday">Samedi</option>
              <option value="sunday">Dimanche</option>
            </select>
          </label>
        </p>
      )}

      {tripForm.category === 'stage' && (
        <p className="trip-field">
          <label>
            <span className="trip-field-title">Période de stage</span>
            <select
              name="period_id"
              value={tripForm.period_id}
              onChange={handleTripChange}
              required
            >
              <option value="">Choisir…</option>
              {stagePeriods
                .filter(
                  (period) =>
                    String(period.school_year_id) ===
                    String(tripForm.school_year_id),
                )
                .map((period) => (
                  <option
                    key={period.period_id}
                    value={period.period_id}
                  >
                    {period.label}
                  </option>
                ))}
            </select>
          </label>
        </p>
      )}

      <p className="trip-field">
        <label>
          <span className="trip-field-title">Heure sur place</span>
        </label>

        <small>
          Indiquez l’heure à laquelle l’enfant doit être sur place pour
          l’aller, ou l’heure à laquelle l’activité se termine pour le
          retour.
        </small>

        <input
          name="time_on_site"
          value={tripForm.time_on_site}
          onChange={handleTripChange}
          type="time"
          required
        />
      </p>

      <p className="trip-field">
        <label>
          <span className="trip-field-title">Direction</span>
        </label>

        <small>
          <strong>Aller :</strong> trajet du domicile (Grand-Hallet) vers
          le lieu de l’activité, du cours ou du stage.
          <br />
          <strong>Retour :</strong> trajet du lieu de l’activité, du cours
          ou du stage vers le domicile (Grand-Hallet).
        </small>

        <select
          name="direction"
          value={tripForm.direction}
          onChange={handleTripChange}
          required
        >
          <option value="outbound">Aller</option>
          <option value="return">Retour</option>
        </select>

        {tripForm.category === 'activity' && (
          <small className="trip-note">
            <strong>À savoir :</strong> l’aller et le retour sont enregistrés
            séparément. Pour une activité, encodez donc un trajet pour
            l’aller de l’enfant et un autre trajet pour son retour.
          </small>
        )}
      </p>

      {tripForm.category === 'activity' && (
        <p className="trip-field">
          <label>
            <span className="trip-field-title">Type de trajet</span>
          </label>

          <small>
            <strong>Simple :</strong> vous assurez uniquement ce trajet
            (aller ou retour de l’enfant).
            <br />
            <strong>Aller-retour dans la foulée :</strong> vous faites
            l’aller et le retour dans la foulée. Par exemple, vous
            conduisez votre enfant à l’activité et pouvez ramener un autre
            enfant lors de votre retour au village, ou inversement.
            <br />
            ⚠️ <strong>Attention : il ne s’agit PAS du retour de votre enfant</strong> :
            il s’agit bien du retour du parent vers le village, directement
            dans la foulée de l’aller.
          </small>

          <select
            name="car_trip_type"
            value={tripForm.car_trip_type}
            onChange={handleTripChange}
            required
          >
            <option value="simple">Simple</option>
            <option value="round_trip">
              Aller-retour dans la foulée
            </option>
          </select>
        </p>
      )}

      <p className="trip-field">
        <label>
          <span className="trip-field-title">Participation</span>
        </label>

        <small>
          Indiquez si vous conduisez et pouvez accueillir un ou des enfants,
          si votre enfant a besoin d’être conduit, ou si vous souhaitez
          organiser une rotation avec d’autres familles.
        </small>

        <select
          name="participation_type"
          value={tripForm.participation_type}
          onChange={handleTripChange}
          required
        >
          <option value="drive_with_space">
            Je conduis et j’ai de la place
          </option>
          <option value="need_ride">
            J’ai besoin d’un trajet
          </option>
          <option value="interested_rotation">
            Intéressé(e) par une rotation
          </option>
        </select>
      </p>

      <p className="trip-field">
        <label>
          <span className="trip-field-title">
            Informations complémentaires
          </span>
        </label>
      
        <small>
          Précisez ici toute information utile concernant ce trajet.
          <br />
          Ex. : 1 semaine sur 2 ; uniquement par SMS ; disponible uniquement
          le soir ; ce trajet uniquement le 1er trimestre…
        </small>
      
        <textarea
          name="additional_info"
          value={tripForm.additional_info}
          onChange={handleTripChange}
          maxLength={250}
          rows={3}
        />
      </p>

      {tripError && <p>Erreur : {tripError}</p>}

      <button type="submit" disabled={savingTrip}>
        {savingTrip
          ? 'Enregistrement…'
          : isEditing
            ? 'Enregistrer les modifications'
            : 'Enregistrer le trajet'}
      </button>

      {isEditing && (
        <button
          type="button"
          onClick={onCancel}
          disabled={savingTrip}
        >
          Annuler
        </button>
      )}
    </form>
  )
}
