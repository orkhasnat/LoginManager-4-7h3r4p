function populateDropdown(dropdown, profiles) {
  dropdown.innerHTML = ''
  Object.keys(profiles).forEach(key => {
    const option = document.createElement('option')
    option.value = key
    option.textContent = `${profiles[key].code} ${profiles[key].loginName}`
    dropdown.appendChild(option)
  })
}

async function refreshDropdown(dropdown) {
  const profiles = await getProfiles()
  populateDropdown(dropdown, profiles)
}

document.addEventListener('DOMContentLoaded', () => {
  const extLoginButton = document.getElementById('extLoginButton')
  const dropdown = document.getElementById('dropdown')

  refreshDropdown(dropdown)

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.loginProfiles) {
      refreshDropdown(dropdown)
    }
  })

  extLoginButton.addEventListener('click', async () => {
    const selectedKey = dropdown.value
    if (!selectedKey) return

    const profiles = await getProfiles()
    const loginInfo = profiles[selectedKey]
    if (!loginInfo) return

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (!activeTab) return

      chrome.runtime.sendMessage({
        action: "performLogin",
        tabId: activeTab.id,
        loginInfo
      })
    })
  })
})
