<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<!-- [travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p> -->
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Description

<!-- [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository. -->
In this project we have three modules yet. **Auth module** where we have the authentication, **Proposal module** where we are dealing with the Proposals which can be added and viewed and the last one is the **User Module** this is where we have our Users which can vote and stake on the Proposals.


# File Structure

## Proposal
The Proposal folder has all the files regarding the Proposals. The **proposal.controller.ts** deals with all the routes regarding the Proposals. The **proposal.model.ts** has the schema/design of our Proposals. The **proposal.module.ts** connects us to our database which is Mongodb. The **proposal.service.ts** is where we have all our functions to access and manipulate the Proposals.


## Functions
1. View all our Proposals.
2. Get a Proposal by Id.
3. Access all Proposals of a specific Status.
4. Get a Proposal By it's Numio Address.
5. Update the status of a Proposal.
6. Vote on a Proposal.
7. Post a new Proposal.
8. Change Milestone of a Proposal.
9. Change Status of a Milestone by Admin.
10. Change Status of a Milestone by User.

## User
The User folder in "/src" has all the files regarding the users. The **user.controller.ts** deals with all the routes of the users. The **user.model.ts** has the schema/design of our users. The **user.module.ts** connects us to our database which is Mongodb. The **user.service.ts** is where we have all our functions to add or access a user.


## Functions
1. View all our users.
2. Add a new user.
3. Get a user by providing his numio_address.
4. Get a user by providing his email.
5. Get all proposals on which the specified user has voted.
6. Get all proposals on which the specified user has staked.

## Updates
1. DATABASE_URL
2. private_key
3. SECRET_KEY
4. Attributes_DOC_ID

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

<!-- ## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework) -->

## License

  Nest is [MIT licensed](LICENSE).
