let editKey = null

function createElement(tag, className, textContent) {
  const el = document.createElement(tag)
  if (className) el.className = className
  if (textContent) el.textContent = textContent
  return el
}

function renderProfiles() {
  getProfiles((profiles) => {
    const list = document.getElementById('profileList')
    list.innerHTML = ''

    Object.keys(profiles).forEach(key => {
      const p = profiles[key]
      const displayText = `${p.code} - ${p.loginName}`

      const info = createElement('div', 'profile-info', displayText)
      info.title = `${key}: ${p.loginName} / ${p.password}`

      const editBtn = createElement('button', 'edit-btn', 'Edit')
      editBtn.dataset.key = key
      editBtn.addEventListener('click', () => loadProfileForEdit(key))

      const deleteBtn = createElement('button', 'delete-btn', 'Delete')
      deleteBtn.dataset.key = key
      deleteBtn.addEventListener('click', () => {
        deleteProfile(key, renderProfiles)
        if (editKey === key) resetForm()
      })

      const actions = createElement('div', 'profile-actions')
      actions.append(editBtn, deleteBtn)

      const item = document.createElement('li')
      item.append(info, actions)

      list.appendChild(item)
    })
  })
}

function fillForm(key, profile) {
  const keyInput = document.getElementById('key')
  keyInput.value = key
  keyInput.disabled = true

  document.getElementById('loginName').value = profile.loginName
  document.getElementById('password').value = profile.password
  document.getElementById('code').value = profile.code

  document.getElementById('submitBtn').value = 'Update Profile'
  document.getElementById('cancelEditBtn').style.display = 'inline-block'

  editKey = key
}

function resetForm() {
  document.getElementById('profileForm').reset()
  const keyInput = document.getElementById('key')
  keyInput.disabled = false

  document.getElementById('submitBtn').value = 'Add Profile'
  document.getElementById('cancelEditBtn').style.display = 'none'

  editKey = null
}

function loadProfileForEdit(key) {
  getProfiles((profiles) => {
    const profile = profiles[key]
    if (profile) fillForm(key, profile)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  renderProfiles()
  document.getElementById('cancelEditBtn').style.display = 'none'

  document.getElementById('profileForm').addEventListener('submit', (e) => {
    e.preventDefault()

    const key = document.getElementById('key').value.trim()
    const loginName = document.getElementById('loginName').value.trim()
    const password = document.getElementById('password').value.trim()
    const code = document.getElementById('code').value.trim()

    if (!key || !loginName || !password || !code) return

    getProfiles((profiles) => {
      profiles[key] = { loginName, password, code }
      saveProfiles(profiles, () => {
        renderProfiles()
        resetForm()
      })
    })
  })

  document.getElementById('cancelEditBtn').addEventListener('click', (e) => {
    e.preventDefault()
    resetForm()
  })
})
