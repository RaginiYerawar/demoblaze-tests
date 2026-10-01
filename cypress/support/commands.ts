import type { User } from './types'

declare global {
  namespace Cypress {
    interface Chainable {
      typeReliably(text: string, maxAttempts?: number): Chainable<JQuery<HTMLElement>>
      registerUser(user: User): Chainable<void>
    }
  }
}

/**
 * Types like a real user, then verifies the value landed and retries (clear -> type -> verify).
 *
 * demoblaze.com sometimes loses input focus mid-typing because background requests
 * re-render the page, leaving only the first few characters in the field. A plain
 * .type() does not retry, so this wraps it in a verify loop.
 */
Cypress.Commands.add(
    'typeReliably',
    { prevSubject: 'element' },
    (input: JQuery<HTMLElement>, text: string, maxAttempts = 3) => {
        const expectedValue = String(text)

        const attempt = (attemptsLeft: number): Cypress.Chainable<JQuery<HTMLElement>> => {
            return cy
                .wrap(input, { log: false })
                .should('be.visible')
                .clear()
                .type(expectedValue)
                .then(($input) => {
                    const actualValue = $input.val()

                    if (actualValue === expectedValue) {
                        return cy.wrap($input, { log: false })
                    }

                    if (attemptsLeft > 1) {
                        return attempt(attemptsLeft - 1)
                    }

                    expect(actualValue, 'typed value').to.equal(expectedValue)

                    return cy.wrap($input, { log: false })
                })
        }

        return attempt(maxAttempts)
    }
)

Cypress.Commands.add('registerUser', (user: User) => {
  // The API expects the password base64-encoded
  cy.request('POST', `${Cypress.env('apiUrl')}/signup`, {
    username: user.username,
    password: btoa(user.password),
  }).then(({ body }) => {
    // It answers 200 even when it fails (e.g. duplicate user) and reports the error in the body
    const signupError = (body as { errorMessage?: string } | undefined)?.errorMessage
    expect(signupError, 'signup error').to.be.undefined
  })
})

export {}
