import LoginPage from '../pages/LoginPage'
import NavBar from '../pages/NavBar'
import { buildUniqueUser } from '../support/testData'
import type { User } from '../support/types'

describe('Login Flow', () => {
  let user: User

  // Logging in changes no state, so both tests can share one account
  before(() => {
    user = buildUniqueUser()
    cy.registerUser(user)
  })

  beforeEach(() => {
    cy.visit('/')
  })

  it('TC1: should login with valid credentials and show the username in the navbar', () => {
    LoginPage.login(user.username, user.password)
    NavBar.assertLoggedIn(user.username)
  })

  it('TC2: should show an error alert when an invalid password is used', () => {
    LoginPage.captureAlert()
    LoginPage.login(user.username, 'wrongpassword_xyz')
    LoginPage.assertAlert('Wrong password')
    NavBar.assertLoggedOut()
  })
})
