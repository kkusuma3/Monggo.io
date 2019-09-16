describe('Category', () => {
  it('Visit admin page', () => {
    cy.visit('/admin')
    cy.contains('[data-cy="app-title"]', 'Monggo.IO')
    cy.screenshot()
  })

  it('Visit category page', () => {
    cy.get('[data-cy="category"]').click()
    cy.contains('[data-cy="page-title"]', 'Category')
    cy.screenshot()
    cy.wait(5000)
  })

  it('Add new category', () => {
    cy.get('[data-cy="trigger-add"]').click()
    cy.get('input[name="name"]')
      .clear()
      .type('Monggo Category')
    cy.get('[data-cy="dialog-action"]').click()
    cy.wait(7000)
    cy.screenshot()
  })

  it('Edit existing category', () => {
    cy.get('[data-cy="trigger-edit-monggo-category"]').click()
    cy.wait(7000)
    cy.get('input[name="name"]')
      .clear()
      .type('Monggo Category Awesome')
    cy.get('[data-cy="dialog-action"]').click()
    cy.wait(7000)
    cy.screenshot()
  })

  it('Delete existing category', () => {
    cy.get('[data-cy="trigger-delete-monggo-category-awesome"]').click()
    cy.get('[data-cy="delete-action"]').click()
    cy.screenshot()
  })
})
