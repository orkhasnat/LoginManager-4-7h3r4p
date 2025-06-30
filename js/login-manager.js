function populateDropdown($dropdown, profiles) {
  $dropdown.empty()
  Object.keys(profiles).forEach(key => {
    const label = `${profiles[key].code} ${profiles[key].loginName}`
    $dropdown.append($('<option>').val(key).text(label))
  })
}

function refreshDropdown($dropdown) {
  getProfiles((profiles) => populateDropdown($dropdown, profiles))
}

document.addEventListener('DOMContentLoaded', () => {
  const $extLoginButton = $('#extLoginButton')
  const $dropdown = $('#dropdown')

  refreshDropdown($dropdown) // initial load

  // Listen for storage changes
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.loginProfiles) {
      refreshDropdown($dropdown)
    }
  })

  $extLoginButton.on('click', async () => {
    const selectedKey = $dropdown.val()

    getProfiles((profiles) => {
      const loginInfo = profiles[selectedKey]
      if (!loginInfo) return

      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        chrome.runtime.sendMessage({
          action: "performLogin",
          tabId: tab.id,
          loginInfo: loginInfo
        })
      })
    })
  })
})
