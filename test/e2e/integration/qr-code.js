/* eslint-disable cypress/no-unnecessary-waiting */
describe('QR Code', () => {
  it('Visit admin page', () => {
    cy.visit('/admin')
    cy.contains('[data-cy="app-title"]', 'Monggo.IO')
    cy.screenshot()
  })

  it('Visit QR Code page', () => {
    cy.get('[data-cy="qr-code"]').click()
    cy.contains('[data-cy="page-title"]', 'QR Code')
    cy.screenshot()
    cy.wait(5000)
  })

  it('Add new qr code', () => {
    cy.get('[data-cy="trigger-add"]').click()
    cy.get('input[name="room"]')
      .clear()
      .type('Room B{enter}')
    cy.get('[data-cy="dialog-action"]').click()
    cy.wait(7000)
    cy.screenshot()
  })

  it('Preview existing qr code', () => {
    cy.get('[data-cy="trigger-preview-room-b"]').click()
    cy.get('[data-cy="preview-action"]').click()
    cy.screenshot()
  })

  it('Delete existing qr code', () => {
    cy.get('[data-cy="trigger-delete-room-b"]').click()
    cy.get('[data-cy="delete-action"]').click()
    cy.screenshot()
  })
})
