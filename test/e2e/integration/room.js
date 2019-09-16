/* eslint-disable cypress/no-unnecessary-waiting */
describe('Room', () => {
  it('Visit admin page', () => {
    cy.visit('/admin')
    cy.contains('[data-cy="app-title"]', 'Monggo.IO')
    cy.screenshot()
  })

  it('Visit room page', () => {
    cy.get('[data-cy="room"]').click()
    cy.contains('[data-cy="page-title"]', 'Room')
    cy.screenshot()
  })

  it('Add new room', () => {
    cy.get('[data-cy="trigger-add"]').click()
    cy.get('input[name="hotel"]')
      .clear()
      .type('Hotel A{enter}')
    cy.get('input[name="name"]')
      .clear()
      .type('Monggo Room')
    cy.get('textarea[name="description"]')
      .clear()
      .type('Monggo Room is really awesome place to stay!')
    cy.uploadFile('input[name="images"]', 'img/hotel-mumbai-room.jpg', 'jpg')
    cy.get('[data-cy="dialog-action"]').click()
    cy.wait(7000)
    cy.screenshot()
  })

  it('Edit existing room', () => {
    cy.get('[data-cy="trigger-edit-monggo-room"]').click()
    cy.wait(7000)
    cy.get('input[name="hotel"]')
      .clear()
      .type('Hotel B{enter}')
    cy.get('input[name="name"]')
      .clear()
      .type('Monggo Room Awesome')
    cy.get('textarea[name="description"]')
      .clear()
      .type('Monggo Room Awesome is really awesome place to stay!')
    cy.uploadFile('input[name="images"]', 'img/hotel-mumbai-room-2.jpg', 'jpg')
    cy.get('[data-cy="dialog-action"]').click()
    cy.wait(7000)
    cy.screenshot()
  })

  it('Delete existing room', () => {
    cy.get('[data-cy="trigger-delete-monggo-room-awesome"]').click()
    cy.get('[data-cy="delete-action"]').click()
    cy.screenshot()
  })
})
