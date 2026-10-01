import LoginPage from '../pages/LoginPage'
import NavBar from '../pages/NavBar'
import HomePage from '../pages/HomePage'
import ProductPage from '../pages/ProductPage'
import CartPage from '../pages/CartPage'
import { buildUniqueUser } from '../support/testData'
import type { OrderDetails, User } from '../support/types'

describe('Laptop Purchase Flow', () => {
  let user: User

  beforeEach(() => {
    // A new account per test means an empty cart, so earlier or failed runs cannot affect this one
    user = buildUniqueUser()
    cy.registerUser(user)

    cy.visit('/')
    LoginPage.login(user.username, user.password)
    NavBar.assertLoggedIn(user.username)
  })

  it('TC3: should complete the full purchase flow for a laptop', () => {
    const order: OrderDetails = {
      name:       'Test User',
      country:    'Germany',
      city:       'Berlin',
      cardNumber: '4111111111111111',
      month:      '09',
      year:       '2027',
    }

    HomePage.openFirstProductOf('Laptops').then((laptop) => {
      ProductPage.assertProduct(laptop).addToCart()
      NavBar.goToCart()
      CartPage.assertContainsProduct(laptop)

      CartPage.openPlaceOrder()
      CartPage.fillOrderForm(order)
      CartPage.submitOrder()
      // The account is new, so the cart holds only this laptop and the amount equals its price
      CartPage.assertOrderConfirmed(order, laptop.price)
      CartPage.dismissConfirmation()
    })
  })
})
