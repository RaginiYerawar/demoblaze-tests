import HomePage from './HomePage'
import NavBar from './NavBar'

class LoginPage {
  get loginModal()    { return cy.get('#logInModal') }
  get usernameInput()  { return cy.get('#loginusername') }
  get passwordInput()  { return cy.get('#loginpassword') }
  get submitButton()   { return cy.get('button[onclick="logIn()"]') }

  openLoginModal(): this {
    // The home page keeps loading products/video after 'load'; typing during that can lose focus
    HomePage.productCards.should('have.length.greaterThan', 0)
    NavBar.loginLink.click()
    // 'show' is added once the fade-in finishes; typing earlier can drop keystrokes
    this.loginModal.should('be.visible').and('have.class', 'show')
    return this
  }

  fillLoginForm(username: string, password: string): this {
    this.usernameInput.typeReliably(username)
    this.passwordInput.typeReliably(password)
    return this
  }

  submitLoginForm(): this {
    this.submitButton.click()
    return this
  }

  login(username: string, password: string): this {
    return this.openLoginModal().fillLoginForm(username, password).submitLoginForm()
  }

  //Must be called before the action that triggers the alert.
  captureAlert(): this {
    const loginAlert = cy.stub().as('loginAlert')
    cy.on('window:alert', loginAlert)
    return this
  }

  assertAlert(message: string): this {
    cy.get('@loginAlert').should('have.been.calledWithMatch', message)
    return this
  }
}

export default new LoginPage()
