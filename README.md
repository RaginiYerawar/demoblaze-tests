# DemoBlaze Cypress Test Suite

End-to-end test automation for [DemoBlaze](https://www.demoblaze.com), covering the login and laptop purchase flows requested in the challenge.

The project uses **Cypress with TypeScript** and focuses on a small set of business-critical scenarios.

---

## Prerequisites

Before running the tests, make sure you have the following installed on your machine:

- **Node.js** (https://nodejs.org/)
- **npm** (comes bundled with Node.js)

Verify the installation:

```bash
node --version
npm --version
```

You should see version numbers printed for both.

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/RaginiYerawar/demoblaze-tests.git
cd demoblaze-tests
```

### 2. Install dependencies

```bash
npm ci
```

This installs the exact dependency versions defined in `package-lock.json`.

---

## Running the Tests

### Option A — Interactive Mode (recommended for first run)

Opens the Cypress Test Runner UI where you can watch the browser execute each test in real time:

```bash
npm run cy:open
```

Steps once the UI opens:
1. Click **E2E Testing**
2. Choose the browser
3. Start E2E Testing
4. Click on `login.cy.ts` or `purchase.cy.ts` to run that spec

### Option B — Headless Mode (for CI or quick runs)

Runs all tests in the terminal without opening a browser window:

```bash
npm run cy:run
```

### Option C — Headed Headless (browser visible, no interactive UI)

```bash
npm run cy:run:headed
```

### Type checking

```bash
npm run typecheck
```

---

## Test Results

- **Pass/fail** summary is printed in the terminal after a headless run
- **Screenshots** of any failed tests are saved to `cypress/screenshots/`
- Screenshots are excluded from git (see `.gitignore`)

---

## Project Structure

```
cypress-demoblaze/
├── cypress/
│   ├── e2e/
│   │   ├── login.cy.ts        ← TC1 and TC2: Login flow tests
│   │   └── purchase.cy.ts     ← TC3: Full laptop purchase flow
│   ├── pages/
│   │   ├── LoginPage.ts       ← Page Object: login modal
│   │   ├── NavBar.ts          ← Page Object: navbar assertions and navigation
│   │   ├── HomePage.ts        ← Page Object: categories and product selection
│   │   ├── ProductPage.ts     ← Page Object: product details and add to cart
│   │   └── CartPage.ts        ← Page Object: cart and checkout
│   ├── tsconfig.json          ← TypeScript settings
│   └── support/
│       ├── commands.ts        ← Custom commands (typeReliably, registerUser)
│       ├── types.ts           ← Shared TypeScript types (User, Product, OrderDetails)
│       ├── testData.ts        ← Builds unique users for the tests
│       └── e2e.ts             ← Auto-loaded before every spec
├── cypress.config.ts          ← Cypress configuration (base URL, timeouts)
├── package.json
└── README.md
```

---

## Test Approach

### What was tested and why

The brief asked for **login** and **laptop purchase flow** tests, with a tight deadline requiring a focus on **essential flows only**. The test suite contains exactly 3 tests across 2 spec files.

---

#### TC1 — Valid Login (`login.cy.ts`)

**What it does:** Opens the login modal, enters valid credentials, submits, and asserts that the username appears in the navbar.

**Why:** This is the most fundamental test. A broken login blocks every other user action on the platform. The navbar assertion (`Welcome username`) is included here — not as a separate test — because it is the natural proof that login succeeded, not an independent feature.

---

#### TC2 — Invalid Login (`login.cy.ts`)

**What it does:** Attempts to log in with a wrong password and asserts that an error alert is shown.

**Why:** One negative case demonstrates that the authentication system rejects bad credentials. Testing every invalid combination (empty fields, wrong username, SQL injection) is out of scope under deadline; one well-chosen negative case shows the testing mindset without padding the suite with low-value tests.

---

#### TC3 — Full Laptop Purchase Flow (`purchase.cy.ts`)

**What it does:** Registers a fresh user through the API and logs in, opens the Laptops category, selects the first laptop returned by the category API, verifies its name and price on the product page, adds it to the cart, verifies the same name and price in the cart row, fills in the order form, submits, and asserts the purchase confirmation message.

**Why:** This is the primary business flow the brief explicitly asked for. It is intentionally written as a single end-to-end scenario rather than split across multiple smaller tests — because breaking it up would mean each fragment is meaningless in isolation (e.g., "navigate to Laptops" proves nothing by itself). A single coherent journey covers all the steps and tells a complete story about whether the feature works.

---

### Key design decisions

**Page Object Model (POM)**  
All selectors and interactions are encapsulated in `pages/` classes (`LoginPage`, `NavBar`, `HomePage`, `ProductPage`, `CartPage`). Spec files contain only the test flow and no selectors. If the site changes a selector, it is fixed in one place.

**API-Based Test Setup**
Account creation is a prerequisite and is not the functionality under test.
Users are created through the DemoBlaze sign-up API using `cy.registerUser()`, while login itself is tested through the UI.
Unique usernames are generated to avoid collisions with accounts created by previous runs.

DemoBlaze has no way to delete accounts, so each full run leaves two throwaway users behind. Avoid running the suite in a tight loop.

**Product chosen from the category API**  
The test intercepts the category request and picks the first laptop from its response, then asserts that product's name and price on the product page and in its cart row. This avoids acting on stale cards from the previous category while the list refreshes, and it stays valid if the catalogue changes.

**Reliable typing**  
DemoBlaze sometimes loses input focus while text is being typed, leaving a half-filled field. The `typeReliably` custom command types, verifies the value, and retries.

**Retries**  
`cypress.config.ts` sets `retries: { runMode: 2, openMode: 0 }`: a failing test is retried up to twice in `cypress run`, never in `cypress open`. This absorbs the occasional slow response from the live site. Retries are a safety net, not a fix for flaky selectors or waits. Cypress marks a test that passed on a retry as flaky in its output.

**TypeScript**
The tests are written in TypeScript for type safety and maintainability.

**No hardcoded waits**  
`cy.wait(ms)` is intentionally avoided throughout. Cypress's built-in retry-ability (via `.should()` assertions) handles asynchronous rendering naturally and produces more stable tests.

**No test interdependency**  
The login tests and purchase test are completely independent. Either spec can be run in isolation without the other.

---

## AI Tool Disclosure

As stated in the assignment guidelines, AI assistance (Claude) was used during this project for:
- Brainstorming and refining the test scenarios
- Reviewing test design
- Discussing Cypress implementation approaches and possible improvements
- Reviewing documentation for clarity

The final test scope, implementation decisions, selectors, assertions, code changes, and validation were reviewed and executed by the author.
