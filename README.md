### About this template

This project uses ESLint with the [Standard with Typescript](https://www.npmjs.com/package/eslint-config-standard-with-typescript). 
We recommend installing the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for Visual Studio Code to ensure consistent code formatting and to catch any potential issues during development. Additionally,
it's recommended to use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to handle your commits and to keep a clean commit history.

**How does this project work?**

This project follows a specific development pattern, and several dependencies have been installed to enforce this pattern. The first dependency is [git-commit-msg-linter](https://www.npmjs.com/package/git-commit-msg-linter), which ensures that commit messages are written in accordance with the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). The second dependency is [husky](https://typicode.github.io/husky/#/), which creates hooks on Git. Three hooks have been created: commit-msg, pre-commit, and pre-push.

**commit-msg:** This hook ensures that git-commit-msg-linter works together with husky to enforce the Conventional Commits standard.

**pre-commit:** This hook checks all Eslint issues on the staged code before committing and fixes them. It uses [lint-staged](https://www.npmjs.com/package/lint-staged) and a configuration file named .**lintstagedrc.json**. It runs two commands, a lint fix, and a test in the stage.

**pre-push:** This hook tests all the code, runs all unit tests before pushing, checks if nothing in the code is broken, and generates a coverage web interface that provides visibility into code coverage.

## INSTALL BUN VERSION 1.0.3 OR UP
```shell
https://bun.sh
```

## Use the command below to install packages.
```shell
bun install
```
## Use the command below to run the project.
Run the command to development environment
```shell
bun start
```

## Use the command to run all the unit tests.

Run the test once
```shell
bun run test
```

Run the test verbosely
```shell
bun run test:verbose
```

Run the test watch
```shell
bun run test:unit
```

Run the test with coverage interface
```shell
bun run test:ci
```

### Folder structure DDD(Domain-Driven Design)

This folder structure follows the Domain-Driven Design (DDD) architecture pattern, which aims to create a domain model that represents the business logic and functionality of the application. The domain layer is separated from the infrastructure and application layers, and it contains the domain entities, services, and repositories.

```
src/
├── domain/
│   ├── customers/
│   │   ├── Customer.js
│   │   ├── CustomerRepository.js
│   │   ├── CustomerService.js
│   │   └── index.js
│   ├── orders/
│   │   ├── Order.js
│   │   ├── OrderRepository.js
│   │   ├── OrderService.js
│   │   └── index.js
│   └── products/
│       ├── Product.js
│       ├── ProductRepository.js
│       ├── ProductService.js
│       └── index.js
├── infra/
│   ├── database/
│   │   ├── Database.js
│   │   └── migrations/
│   ├── http/
│   │   ├── clients/
│   │   └── routes/
│   └── index.js
├── app/
│   ├── controllers/
│   │   ├── customers/
│   │   │   ├── CustomerController.js
│   │   │   └── index.js
│   │   ├── orders/
│   │   │   ├── OrderController.js
│   │   │   └── index.js
│   │   └── products/
│   │       ├── ProductController.js
│   │       └── index.js
│   ├── middleware/
│   └── routes/
└── index.js
```
**Domain Layer:** Contains the domain models and business logic, which are independent of any specific infrastructure or application details. The domain folder contains three sub-folders (customers, orders, and products), each with domain-specific files such as model, repository, and service. These files are responsible for defining and handling domain entities and business rules.

**Infrastructure Layer:** Provides the necessary tools and mechanisms to support the domain layer's implementation. The infra folder contains two sub-folders (database and http), each with its specific purpose. The database folder has a **Database.js** file that defines the connection and access to the database. The http folder contains two sub-folders (clients and routes), where the routes folder contains Express routes definitions for the application's endpoints.

**Application Layer:** Implements the application's business logic by leveraging the domain models and infrastructure services. The app folder contains three sub-folders (controllers, middleware, and routes), each with its specific responsibility. The controllers folder handles the input and output of the application layer, and the routes folder defines the routes for the API. Finally, the middleware folder contains the functions that handle pre-processing of incoming requests, authentication, and other similar tasks.

If you have any questions about Domain-Driven Design, feel free to consult with [ChatGPT](https://openai.com/blog/chatgpt/), an AI-powered language model trained to answer various questions related to software engineering and other topics.

## How to write good code?

To improve the readability of your code, it is better to use `function` instead of `arrow functions`. Additionally, it is recommended to use classes as they make your code more maintainable. Adopting dependency injection is also a good practice as it reduces your code's dependency on specific frameworks.

Consider the database example below, where you can easily change your code to work with different databases. This demonstrates the importance of writing code that is adaptable and can accommodate future changes.

```javascript
// Dependency Injection Example in JavaScript

// Creating a class for the Mongo database
class MongoDatabase {
  saveData(data) {
    // implementation of saving data using the Mongo database
  }
}

// Creating a class for the MySQL database
class MySqlDatabase {
  saveData(data) {
    // implementation of saving data using the MySQL database
  }
}

// Creating a class for the Firestore database
class FirestoreDatabase {
  saveData(data) {
    // implementation of saving data using the Firestore database
  }
}

// Creating a class for the application
class App {
  constructor(database) {
    // Injecting the database dependency
    this.database = database;
  }

  // A method that uses the database to save data
  saveData(data) {
    this.database.saveData(data);
  }
}

// Creating instances of the application with different databases injected
const mongoApp = new App(new MongoDatabase());
const mysqlApp = new App(new MySqlDatabase());
const firestoreApp = new App(new FirestoreDatabase());

```

We also utilize path aliases to conveniently import items within this project. Here's an example that demonstrates the use of path aliases in this project:

* The `@/` alias always refers to the `src` folder.
* The `@/tests` alias refers to the `tests` folder.

```javascript
  // before
  import {Database} from "../../infra/database";

  // after
  import {Database} from "@/infra/database";
```