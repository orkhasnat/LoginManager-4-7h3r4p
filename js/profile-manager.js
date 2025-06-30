async function renderProfiles() {
  const profiles = await getProfiles()
  const list = document.getElementById('profileList')
  list.innerHTML = ''

  Object.keys(profiles).forEach(key => {
    const p = profiles[key]
    const displayText = `${p.code} - ${p.loginName}`

    const info = document.createElement('div')
    info.className = 'profile-info'
    info.textContent = displayText
    info.title = `${key}: ${p.loginName} / ${p.password}`

    const editBtn = document.createElement('button')
    editBtn.className = 'edit-btn'
    editBtn.textContent = 'Edit'
    editBtn.dataset.key = key
    editBtn.addEventListener('click', () => loadProfileForEdit(key))

    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'delete-btn'
    deleteBtn.textContent = 'Delete'
    deleteBtn.dataset.key = key
    deleteBtn.addEventListener('click', async () => {
      await deleteProfile(key)
      await renderProfiles()
      if (editKey === key) resetForm()
    })

    const actions = document.createElement('div')
    actions.className = 'profile-actions'
    actions.append(editBtn, deleteBtn)

    const item = document.createElement('li')
    item.append(info, actions)

    list.appendChild(item)
  })
}

async function loadProfileForEdit(key) {
  const profiles = await getProfiles()
  const profile = profiles[key]
  if (profile) fillForm(key, profile)
}

document.addEventListener('DOMContentLoaded', () => {
  renderProfiles()
  document.getElementById('cancelEditBtn').style.display = 'none'

  document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault()

    const key = document.getElementById('key').value.trim()
    const loginName = document.getElementById('loginName').value.trim()
    const password = document.getElementById('password').value.trim()
    const code = document.getElementById('code').value.trim()

    if (!key || !loginName || !password || !code) return

    const profiles = await getProfiles()
    profiles[key] = { loginName, password, code }
    await saveProfiles(profiles)
    await renderProfiles()
    resetForm()
  })

  document.getElementById('cancelEditBtn').addEventListener('click', (e) => {
    e.preventDefault()
    resetForm()
  })
})
