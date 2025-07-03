let editKey = null

async function renderProfiles() {
  const profiles = await getProfiles()
  const list = document.getElementById('profileList')
  list.innerHTML = ''

  Object.keys(profiles).forEach(key => {
    const p = profiles[key]
    const displayHTML = `<strong>${key}</strong> : [${p.code}] - <em>${p.loginName}</em> - <small>${p.password}</small>`

    const info = document.createElement('div')
    info.className = 'profile-info'
    info.innerHTML = displayHTML

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

function resetForm() {
  editKey = null
  document.getElementById('key').value = ''
  document.getElementById('loginName').value = ''
  document.getElementById('password').value = ''
  document.getElementById('code').value = ''
  document.getElementById('key').disabled = false
  document.getElementById('submitBtn').value = 'Add Profile'
  document.getElementById('cancelEditBtn').style.display = 'none'
}

function fillForm(key, profile) {
  editKey = key
  document.getElementById('key').value = key
  document.getElementById('loginName').value = profile.loginName
  document.getElementById('password').value = profile.password
  document.getElementById('code').value = profile.code
  document.getElementById('key').disabled = true
  document.getElementById('submitBtn').value = 'Update Profile'
  document.getElementById('cancelEditBtn').style.display = 'inline-block'
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


document.getElementById('importBtn').addEventListener('click', () => {
  document.getElementById('importFile').click()
})

document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (event) => {
    try {
      const importedData = JSON.parse(event.target.result)
      const existingProfiles = await getProfiles()
      const merged = { ...existingProfiles, ...importedData }
      await saveProfiles(merged)
      await renderProfiles()
      alert('Profiles imported successfully.')
    } catch (err) {
      alert('Invalid JSON file. Import failed.')
    }
  }
  reader.readAsText(file)
})

document.getElementById('exportBtn').addEventListener('click', async () => {
  const profiles = await getProfiles()
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profiles, null, 2))
  const downloadAnchor = document.createElement('a')
  downloadAnchor.setAttribute("href", dataStr)
  downloadAnchor.setAttribute("download", "profiles.json")
  document.body.appendChild(downloadAnchor)
  downloadAnchor.click()
  downloadAnchor.remove()
})
