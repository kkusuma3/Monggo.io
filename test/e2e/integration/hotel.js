describe('Hotel', () => {
  it('Visits the hotel page', () => {
    cy.visit('/admin/hotel')
    cy.contains('.headline', 'Hotel')
    cy.screenshot()
  })

  it('Add new hotel', () => {
    cy.get('.trigger-add').click()
    cy.get('input[name="name"]')
      .clear()
      .type('Monggo Hotel')
    cy.get('textarea[name="description"]')
      .clear()
      .type('Monggo Hotel is really awesome place to stay!')
    cy.get('.dialog-action').click()
    cy.screenshot()
  })

  it('Edit existing hotel', () => {
    cy.get('.trigger-edit-monggo-hotel').click()
    cy.get('input[name="name"]')
      .clear()
      .type('Another Monggo Hotel')
    cy.get('textarea[name="description"]')
      .clear()
      .type('Another Monggo Hotel is really awesome place to stay!')
    cy.get('.dialog-action').click()
    cy.screenshot()
  })

  it('Delete existing hotel', () => {
    cy.get('.trigger-delete-another-monggo-hotel').click()
    cy.get('.delete-action').click()
    cy.screenshot()
  })
})
