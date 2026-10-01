import type { CategoryResponse, Product } from '../support/types'

class HomePage {
  get categoryLinks() { return cy.get('.list-group-item') }
  get productCards()  { return cy.get('#tbodyid .card') }
  get productTitles() { return cy.get('.card-title a') }

  openFirstProductOf(category: string): Cypress.Chainable<Product> {
    // The previous category's cards stay in the DOM until the response re-renders the list,
    // so pick the product from the API response instead of trusting the first visible card.
    cy.intercept('POST', '**/bycat').as('loadCategory')
    this.categoryLinks.contains(category).click()

    return cy.wait('@loadCategory').then(({ response }) => {
      const product = (response?.body as CategoryResponse).Items[0]
      return this.productTitles.contains(product.title).click().then(() => product)
    })
  }
}

export default new HomePage()
