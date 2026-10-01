import type { Product } from '../support/types'

class ProductPage {
  get name()            { return cy.get('.name') }
  get priceContainer()  { return cy.get('.price-container') }
  get addToCartButton() { return cy.get('a.btn-success') }

  assertProduct({ title, price }: Product): this {
    this.name.should('have.text', title)
    this.priceContainer.should('contain', `$${price}`)
    return this
  }

  addToCart(): this {
    // A stub (not a plain callback) so the test fails if no alert is shown at all
    const addToCartAlert = cy.stub().as('addToCartAlert')
    cy.on('window:alert', addToCartAlert)

    this.addToCartButton.click()
    cy.get('@addToCartAlert').should('have.been.calledWith', 'Product added.')
    return this
  }
}

export default new ProductPage()
