class NavBar {
  get welcomeText() { return cy.get('#nameofuser') }
  get loginLink()   { return cy.get('#login2') }
  get cartLink()    { return cy.get('#cartur') }

  assertLoggedIn(username: string): this {
    this.welcomeText
      .should('be.visible')
      .and('contain', `Welcome ${username}`)
    return this
  }

  assertLoggedOut(): this {
    this.welcomeText.should('not.be.visible')
    this.loginLink.should('be.visible')
    return this
  }

  goToCart(): this {
    this.cartLink.click()
    return this
  }
}

export default new NavBar()
