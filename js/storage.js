const STORAGE_KEY = 'loginProfiles'

function getProfiles() {
  return new Promise((resolve) => {
    chrome.storage.sync.get([STORAGE_KEY], (result) => {
      resolve(result[STORAGE_KEY] || {})
    })
  })
}

function saveProfiles(profiles) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [STORAGE_KEY]: profiles }, resolve)
  })
}

async function deleteProfile(profileKey) {
  const profiles = await getProfiles()
  if (profileKey in profiles) {
    delete profiles[profileKey]
    await saveProfiles(profiles)
  }
}
