// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Taken from: https://github.com/cypress-io/cypress/issues/170#issuecomment-411289023
/**
 * Uploads a file to an input
 * @memberOf Cypress.Chainable#
 * @name upload_file
 * @function
 * @param {String} selector - element to target
 * @param {String} fileUrl - The file url to upload
 * @param {String} type - content type of the uploaded file
 */
Cypress.Commands.add('uploadFile', (selector, fileUrl, type = '') => {
  return cy.get(selector).then(subject => {
    return cy
      .fixture(fileUrl, 'base64')
      .then(Cypress.Blob.base64StringToBlob)
      .then(blob => {
        return cy.window().then(win => {
          const el = subject[0]
          const nameSegments = fileUrl.split('/')
          const name = nameSegments[nameSegments.length - 1]
          const testFile = new win.File([blob], name, { type })
          const dataTransfer = new DataTransfer()
          dataTransfer.items.add(testFile)
          el.files = dataTransfer.files
          el.dispatchEvent(new Event('change'))
          return subject
        })
      })
  })
})
