UI Testing – Using Playwright (Typescript)
API Testing – Using Playwright (Typescript)
Load Testing – Using K6 (Javascript)


Prerequisites

To run this project, ensure the following are installed on your local machine:

Node.js (version 14.x or higher)

Download from: https://nodejs.org/
pnpm (version 6.x or higher)

Install globally by running: npm install -g pnpm
Documentation: https://pnpm.io/installation
K6 – for load testing

Mac: brew install k6
Windows: winget install k6 --source winget
Documentation: https://k6.io/docs/getting-started/installation/


Installation & Setup

Step 1: Clone the Repository
Clone the repository by running:



Step 2: Install Dependencies
Install all the necessary project dependencies using pnpm:

pnpm install

Step 3: Setup env
Pass in values for apikey, username and password (This was shared in assestment submission)


Step 4: Install Playwright Browsers
If this is your first time setting up Playwright, you need to install the Playwright browsers:

pnpm exec playwright install


Running the Tests


Run API Tests
To execute all API test cases, run the following command:


pnpm run test:api

Run UI Tests
To run the full suite of UI tests in headed mode, use:

pnpm run test:e2e-Head


Run All Tests
To execute all tests (API and UI), use this command:

pnpm run test:all

Run Load Tests
To execute load tests using K6, run:

pnpm run test:load




