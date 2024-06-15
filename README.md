## Beuti Admin Dashboard

### Getting Started

To get started with this project you need to make sure that you have node with this version [use nvm or asdf to control your version]

- Node `v12.16.1`
- React `v16.12.0`

```bash
yarn install
yarn start
```

This app works on port 3612 `http://localhost:3612/login`

### Staging

- Staging branch `dev`
- Staging URL https://beuti-admin-fe.ibtikar.sa/login

### Linting

- linting rules are hard in this project; You should take care and don't turn them off.
  - `eslint-config-airbnb`
  - `eslint-config-prettier`
  - `eslint-config-react-app`
  - `eslint-plugin-prettier`
  - `prettier`
  - Please Install Prettier extension to your IDE and format before commit

### Style

- `react-semantic-ui` is the main styling framework
- `react-semantic-ui-datepickers` is Used for date range selection.

### Unit testing

`jest` is the tool used to test just run the command `jest` to run all available tests

### Dependencies

- `react-router-dom`
- `react-intl`
- `prop-types`
- `react-geocode`
- `react-google-autocomplete`
- `react-google-maps`
- `react-file-base64`

#### Testing Accounts

```
  Super Admin in backend dev servers =>
  "email": "beutiapp@gmail.com"
  "password": "$up3e@dm!n2020"
```

```
  Service Provider in backend dev servers =>
  "email": "michael.kamal@ibtikar.net.sa"
  "password": "Passw0rd"
```

```
  Service Provider in backend Test servers =>
  "phone": "0577889956"
  "password": "12345678a"
```

### TODO:

- Fix Style falls.
- Reorganize translations.
- Write unit tests & integration tests for future changes.

-Test
