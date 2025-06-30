chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "performLogin") {
    chrome.scripting.executeScript({
      target: { tabId: request.tabId },
      files: ["js/jquery-3.7.1.min.js"]
    }).then(() => {
      chrome.scripting.executeScript({
        target: { tabId: request.tabId },
        args: [request.loginInfo],
        func: (loginInfo) => {
          (function (loginConfig) {
            const $ = window.jQuery;
            $('#loginName').val(loginConfig.loginName)
            $('#password').val(loginConfig.password)
            $('[name="_action_submit"]').trigger('click')
            $('#providerCode').val(loginConfig.code)
            $('#submitButton').trigger('click')
          })(loginInfo)
        }
      })
    })
  }
})
