function populateDropdown(profileDropdown) {
  Object.keys(loginDetails).forEach(key => {
    const label = `${loginDetails[key].code} ${loginDetails[key].loginName}`
    profileDropdown.append($('<option>').val(key).text(label))
  })
}

function getLoginInfo(profile) {
  return loginDetails[profile]
}

document.addEventListener('DOMContentLoaded', () => {
  const $extLoginButton = $('#extLoginButton')
  const $dropdown = $('#dropdown')

  populateDropdown($dropdown)

  $extLoginButton.on('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const loginInfo = getLoginInfo($dropdown.val());

    chrome.runtime.sendMessage({
      action: "performLogin",
      tabId: tab.id,
      loginInfo: loginInfo
    })
  })
})
