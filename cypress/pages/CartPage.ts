import type { OrderDetails, Product } from '../support/types'

const TITLE_COLUMN = 1
const PRICE_COLUMN = 2

class CartPage {
  get cartTotal()         { return cy.get('#totalp') }
  get placeOrderButton()  { return cy.get('button[data-target="#orderModal"]') }
  get orderModal()        { return cy.get('#orderModal') }
  get nameField()         { return cy.get('#name') }
  get countryField()      { return cy.get('#country') }
  get cityField()         { return cy.get('#city') }
  get cardField()         { return cy.get('#card') }
  get monthField()        { return cy.get('#month') }
  get yearField()         { return cy.get('#year') }
  get purchaseButton()    { return cy.get('button[onclick="purchaseOrder()"]') }
  get confirmationModal() { return cy.get('.sweet-alert') }
  get confirmationTitle() { return cy.get('.sweet-alert h2') }
  get confirmationDetails() { return cy.get('.sweet-alert p.lead') }
  get confirmOkButton()   { return cy.get('.sweet-alert .confirm') }
  cartRowFor(title: string) { return cy.contains('#tbodyid tr', title) }

  assertContainsProduct({ title, price }: Product): this {
    // cartRowFor matches by substring, so the title cell is compared exactly
    this.cartRowFor(title).find('td').eq(TITLE_COLUMN).should('have.text', title)
    this.cartRowFor(title).find('td').eq(PRICE_COLUMN).should('have.text', String(price))
    return this
  }

  openPlaceOrder(): this {
    // The cart total renders last; opening the modal earlier lets a late re-render steal focus
    this.cartTotal.should('not.be.empty')
    this.placeOrderButton.click()
    this.orderModal.should('be.visible')
    return this
  }

  fillOrderForm({ name, country, city, cardNumber, month, year }: OrderDetails): this {
    // Wait for the fade-in to finish so the first keystrokes are not dropped
    this.orderModal.should('have.class', 'show')
    this.nameField.typeReliably(name)
    this.countryField.typeReliably(country)
    this.cityField.typeReliably(city)
    this.cardField.typeReliably(cardNumber)
    this.monthField.typeReliably(month)
    this.yearField.typeReliably(year)
    return this
  }

  submitOrder(): this {
    this.purchaseButton.click()
    return this
  }

  assertOrderConfirmed({ name, cardNumber }: OrderDetails, amount: number): this {
    this.confirmationModal.should('be.visible')
    this.confirmationTitle.should('contain', 'Thank you for your purchase!')
    // The id and date are generated dynamically, so only their presence is checked (id) and skipped (date)
    this.confirmationDetails.invoke('text').should('match', /Id: \d+/)
    this.confirmationDetails
      .should('contain', `Amount: ${amount} USD`)
      .and('contain', `Card Number: ${cardNumber}`)
      .and('contain', `Name: ${name}`)
    return this
  }

  dismissConfirmation(): this {
    this.confirmOkButton.click()
    return this
  }
}

export default new CartPage()
