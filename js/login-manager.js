function populateDropdown($dropdown, profiles) {
  $dropdown.empty()
  Object.keys(profiles).forEach(key => {
    const label = `${profiles[key].code} ${profiles[key].loginName}`
    $dropdown.append($('<option>').val(key).text(label))
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const $extLoginButton = $('#extLoginButton')
  const $dropdown = $('#dropdown')

  getProfiles((profiles) => {
    populateDropdown($dropdown, profiles)

    $extLoginButton.on('click', async () => {
      const selectedKey = $dropdown.val()
      const loginInfo = profiles[selectedKey]
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

      chrome.runtime.sendMessage({
        action: "performLogin",
        tabId: tab.id,
        loginInfo: loginInfo
      })
    })
  })
})
