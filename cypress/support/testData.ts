import type { User } from './types'

/** A user that cannot collide with earlier runs: demoblaze never lets you delete accounts. */
export function buildUniqueUser(): User {
  return {
    username: `qa_${Date.now()}_${Cypress._.random(999)}`,
    password: 'Passw0rd!',
  }
}
