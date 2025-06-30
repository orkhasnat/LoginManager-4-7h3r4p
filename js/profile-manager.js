let editKey = null

function renderProfiles() {
  getProfiles((profiles) => {
    const $list = $('#profileList')
    $list.empty()

    Object.keys(profiles).forEach(key => {
      const p = profiles[key]
      const label = `${key}: ${p.code} ${p.loginName} ${p.password}`

      const $item = $(`
        <li>
          ${label}
          <button data-key="${key}" class="edit-btn">✏️ Edit</button>
          <button data-key="${key}" class="delete-btn">❌ Delete</button>
        </li>
      `)

      $list.append($item)
    })
  })
}

function fillForm(key, profile) {
  $('#key').val(key).prop('disabled', true); // disable key editing during update
  $('#loginName').val(profile.loginName)
  $('#password').val(profile.password)
  $('#code').val(profile.code)

  $('#submitBtn').val('Update Profile')
  $('#cancelEditBtn').show()

  editKey = key
}

function resetForm() {
  $('#profileForm')[0].reset()
  $('#key').prop('disabled', false)
  $('#submitBtn').val('Add Profile')
  $('#cancelEditBtn').hide()
  editKey = null
}

$(document).ready(() => {
  renderProfiles()
  $('#cancelEditBtn').hide()

  $('#profileForm').on('submit', (e) => {
    e.preventDefault()

    const key = $('#key').val().trim()
    const loginName = $('#loginName').val().trim()
    const password = $('#password').val().trim()
    const code = $('#code').val().trim()

    if (!key || !loginName || !password || !code) return

    getProfiles((profiles) => {
      profiles[key] = { loginName, password, code }
      saveProfiles(profiles, () => {
        renderProfiles()
        resetForm()
      })
    })
  })

  $('#cancelEditBtn').on('click', (e) => {
    e.preventDefault()
    resetForm()
  })

  $('#profileList')
    .on('click', '.delete-btn', function () {
      const key = $(this).data('key')
      deleteProfile(key, renderProfiles)

      // If deleting the currently edited profile, reset form
      if (editKey === key) {
        resetForm()
      }
    })
    .on('click', '.edit-btn', function () {
      const key = $(this).data('key')
      getProfiles((profiles) => {
        const profile = profiles[key]
        if (profile) fillForm(key, profile)
      })
    })
})
