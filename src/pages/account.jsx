import { useEffect, useState } from 'react'

import { auth } from '../lib/auth'

export function Account() {
  const [family, setFamily] = useState(null)
  const [form, setForm] = useState({
    parent_first_name: '',
    parent_last_name: '',
    children_last_name: '',
    address_street: '',
    address_postal_village: '',
    phone: '',
    pending_address_street: '',
    pending_address_postal_village: '',
    pending_address_requested_at: null,
    pending_address_status: null,
   })

  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [passwordEditing, setPasswordEditing] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',  
  })
  const [passwordError, setPasswordError] = useState(null)
  const [passwordSuccess, setPasswordSuccess] = useState(null)

  useEffect(() => {
    async function loadFamily() {
      try {
        const response = await fetch('/api/family')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors du chargement')
        }

        setFamily(data.family)

        if (data.family) {
          setForm({
            parent_first_name: data.family.parent_first_name,
            parent_last_name: data.family.parent_last_name,
            children_last_name: data.family.children_last_name,
            address_street: data.family.address_street,
            address_postal_village: data.family.address_postal_village,
            phone: data.family.phone,
            pending_address_street: data.family.pending_address_street ?? '',
            pending_address_postal_village:
              data.family.pending_address_postal_village ?? '',
            pending_address_requested_at:
              data.family.pending_address_requested_at ?? null,
            pending_address_status:
              data.family.pending_address_status ?? null,
          })
        }

      } catch (error) {
        setError(
          error instanceof Error ? error.message : String(error),
        )
      }
    }

    loadFamily()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleCancel() {
    setForm({
      parent_first_name: family.parent_first_name,
      parent_last_name: family.parent_last_name,
      children_last_name: family.children_last_name,
      address_street: family.address_street,
      address_postal_village: family.address_postal_village,
      phone: family.phone,
      pending_address_street: family.pending_address_street ?? '',
      pending_address_postal_village:
        family.pending_address_postal_village ?? '',
      pending_address_requested_at:
        family.pending_address_requested_at ?? null,
      pending_address_status:
        family.pending_address_status ?? null,
    })

    setEditing(false)
  }

async function handleCreateFamily(event) {
  event.preventDefault()
  setError(null)
  setSaving(true)
  setSaved(false)

  try {
    const response = await fetch('/api/family', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent_first_name: form.parent_first_name,
        parent_last_name: form.parent_last_name,
        children_last_name: form.children_last_name,
        address_street: form.address_street,
        address_postal_village: form.address_postal_village,
        phone: form.phone,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.error || 'Erreur lors de l’enregistrement',
      )
    }

    setFamily(data.family)
    setSaved(true)


  } catch (error) {
    setError(
      error instanceof Error ? error.message : String(error),
    )
  } finally {
    setSaving(false)
  }
}

async function handleSave() {
  setError(null)

  try {
    const response = await fetch('/api/family-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent_first_name: form.parent_first_name,
        parent_last_name: form.parent_last_name,
        children_last_name: form.children_last_name,
        address_street: form.address_street,
        address_postal_village: form.address_postal_village,
        phone: form.phone,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.error || 'Erreur lors de l’enregistrement',
      )
    }

    setFamily(data.family)
    setEditing(false)
  } catch (error) {
    setError(
      error instanceof Error ? error.message : String(error),
    )
  }
}

async function handlePasswordChange() {
  setPasswordError(null)
  setPasswordSuccess(null)

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    setPasswordError('Les deux nouveaux mots de passe ne correspondent pas.')
    return
  }

  try {
    const { error } = await auth.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
      revokeOtherSessions: true,
    })

    if (error) {
      throw new Error(error.message || 'Erreur lors du changement de mot de passe')
    }

    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setPasswordEditing(false)
    setPasswordSuccess('Votre mot de passe a été modifié avec succès.')
  } catch (error) {
    setPasswordError(
      error instanceof Error ? error.message : String(error),
    )
  }
}

  if (error) {
    return (
      <main>
        <h1>Mon compte</h1>
        <p>Erreur : {error}</p>
      </main>
    )
  }

  if (!family) {
  return (
    <main>
      <h1>Mon compte</h1>

      <section>
        <h2>Enregistrer ma famille</h2>

        <p>
          Pour utiliser les P'tits trajets de Grand-Hallet,
          veuillez enregistrer votre famille.
        </p>

        <form onSubmit={handleCreateFamily}>
          <p>
            <label>
              Votre prénom
              <br />
              <input
                name="parent_first_name"
                value={form.parent_first_name}
                onChange={handleChange}
                required
              />
            </label>
          </p>

          <p>
            <label>
              Votre nom
              <br />
              <input
                name="parent_last_name"
                value={form.parent_last_name}
                onChange={handleChange}
                required
              />
            </label>
          </p>

          <p>
            <label>
              Nom de famille des enfants
              <br />
              <input
                name="children_last_name"
                value={form.children_last_name}
                onChange={handleChange}
                required
              />
            </label>
          </p>

          <p>
            <label>
              Rue et numéro
              <br />
              <input
                name="address_street"
                value={form.address_street}
                onChange={handleChange}
                required
              />
            </label>
          </p>

          <p>
            <label>
              Code postal et village
              <br />
              <input
                name="address_postal_village"
                value={form.address_postal_village}
                onChange={handleChange}
                required
              />
            </label>
          </p>

          <p>
            <label>
              Téléphone
              <br />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </label>
          </p>

          {error && <p>Erreur : {error}</p>}

          <p className="account-request-note">
            Les demandes sont traitées manuellement. Aucune notification automatique
            par e-mail n’est envoyée à l’administrateur. La plateforme étant gratuite
            et gérée bénévolement, un petit délai peut parfois être nécessaire.
            Si vous n’avez pas de nouvelles après 3 jours, vous pouvez nous contacter
            à{' '}
            lesptitstrajetsdegh (at) gmail.com.
          </p>

          <button type="submit" disabled={saving}>
            {saving
              ? 'Enregistrement…'
              : 'Enregistrer mon inscription'}
          </button>
        </form>
      </section>
    </main>
  )
}

  return (
    <main>
      <h1>Mon compte</h1>

      <section>

        {saved && (
  <div className="account-success-message">
    <strong>Votre inscription a bien été enregistrée.</strong>
    <br />
    Votre compte doit encore être validé par l’administrateur.
    Dès que votre compte sera validé, vous pourrez profiter
    pleinement de la plateforme et créer ou rechercher des trajets.

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

        <h2>Mes coordonnées</h2>

        {!editing ? (
          <>
            <p>Prénom : {family.parent_first_name}</p>
            <p>Nom : {family.parent_last_name}</p>
            <p>Adresse e-mail : {family.email}</p>
            <p>Nom de famille des enfants : {family.children_last_name}</p>
            <p>Téléphone : {family.phone}</p>

            <p>
              <strong>Adresse actuelle</strong>
              <br />
              Rue et numéro : {family.address_street}
              <br />
              Code postal et village : {family.address_postal_village}
            </p>
            
            {family.pending_address_status === 'pending' && (
              <p>
                <strong>Nouvelle adresse en attente de validation</strong>
                <br />
                Rue et numéro : {family.pending_address_street}
                <br />
                Code postal et village : {family.pending_address_postal_village}
              </p>
            )}
            
            {family.pending_address_status === 'rejected' && (
              <p>
                <strong>Dernière demande d’adresse refusée</strong>
                <br />
                Rue et numéro : {family.pending_address_street}
                <br />
                Code postal et village : {family.pending_address_postal_village}
              </p>
            )}


            <button
              type="button"
              className="account-edit-button"
              onClick={() => setEditing(true)}
            >
              Modifier mes coordonnées
            </button>
          </>
        ) : (
          <form>
            <p>
              <label>
                Prénom
                <input
                  name="parent_first_name"
                  value={form.parent_first_name}
                  onChange={handleChange}
                />
              </label>
            </p>

            <p>
              <label>
                Nom
                <input
                  name="parent_last_name"
                  value={form.parent_last_name}
                  onChange={handleChange}
                />
              </label>
            </p>

            <p>
              <label>
                Nom de famille des enfants
                <input
                  name="children_last_name"
                  value={form.children_last_name}
                  onChange={handleChange}
                />
              </label>
            </p>

            <p>
              <label>
                Téléphone
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </label>
            </p>

            <p>
              <label>
                Rue et numéro
                <input
                  name="address_street"
                  value={form.address_street}
                  onChange={handleChange}
                />
              </label>
            </p>

            <p>
              <label>
                Code postal et village
                <input
                  name="address_postal_village"
                  value={form.address_postal_village}
                  onChange={handleChange}
                />
              </label>
            </p>

            <div className="account-address-note">
              <p>
                <strong>À propos de votre adresse</strong>
              </p>
            
              <p>
                Toute modification d’adresse doit être validée par
                l’administrateur. Cette vérification permet notamment
                de s’assurer que les familles utilisant le service
                résident toujours à Grand-Hallet.
              </p>
            
              <p>
                La nouvelle adresse sera donc enregistrée comme
                « en attente de validation » jusqu’à son acceptation.
              </p>
            
              <p>
                <strong>
                  Votre compte reste actif et vous pouvez continuer à
                  utiliser le service normalement pendant cette
                  vérification.
                </strong>
              </p>
            
              <p>
                <em>
                  Pour plus d’informations, consultez les conditions
                  générales.
                </em>
              </p>
            </div>
            
            <button type="button" onClick={handleSave}>
              Enregistrer les modifications
            </button>

            <button
              type="button"
              onClick={handleCancel}
            >
              Annuler
            </button>
          </form>
        )}
      </section>

<section>
  <h2>Mon mot de passe</h2>

  {!passwordEditing ? (
    <>
      <button
        type="button"
        onClick={() => {
          setPasswordError(null)
          setPasswordSuccess(null)
          setPasswordEditing(true)
        }}
      >
        Modifier mon mot de passe
      </button>

      {passwordSuccess && <p>{passwordSuccess}</p>}
    </>
  ) : (
    <form>
      <p>
        <label>
          Mot de passe actuel
          <div className="password-field">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: event.target.value,
                })
              }
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              aria-label={
                showCurrentPassword
                  ? 'Masquer le mot de passe'
                  : 'Afficher le mot de passe'
              }
            >
              {showCurrentPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </label>
      </p>

      <p>
        <label>
          Nouveau mot de passe
          <div className="password-field">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: event.target.value,
                })
              }
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={
                showNewPassword
                  ? 'Masquer le mot de passe'
                  : 'Afficher le mot de passe'
              }
            >
              {showNewPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </label>
      </p>

      <p>
        <label>
          Confirmer le nouveau mot de passe
          <div className="password-field">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(event) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: event.target.value,
                })
              }
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword
                  ? 'Masquer le mot de passe'
                  : 'Afficher le mot de passe'
              }
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </label>
      </p>

      {passwordError && <p>Erreur : {passwordError}</p>}

      <button type="button" onClick={handlePasswordChange}>
        Modifier mon mot de passe
      </button>

      <button
        type="button"
        onClick={() => {
          setPasswordEditing(false)
          setPasswordError(null)
        }}
      >
        Annuler
      </button>
    </form>
  )}
</section>

    </main>
  )
}

