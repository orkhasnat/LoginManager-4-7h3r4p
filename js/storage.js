const STORAGE_KEY = 'loginProfiles'

function getProfiles(callback) {
  chrome.storage.sync.get([STORAGE_KEY], (result) => {
    callback(result[STORAGE_KEY] || {})
  })
}

function saveProfiles(profiles, callback) {
  chrome.storage.sync.set({ [STORAGE_KEY]: profiles }, () => {
    if (callback) callback()
  })
}

function deleteProfile(profileKey, callback) {
  getProfiles((profiles) => {
    delete profiles[profileKey]
    saveProfiles(profiles, callback)
  })
}
