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
          <button data-key="${key}" class="delete-btn">❌</button>
        </li>
      `)

      $list.append($item)
    })
  })
}

$(document).ready(() => {
  renderProfiles()

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
        $('#profileForm')[0].reset()
      })
    })
  })

  $('#profileList').on('click', '.delete-btn', function () {
    const key = $(this).data('key')
    deleteProfile(key, renderProfiles)
  })
})
