# Monggo IO

> Monggo.io tackles language barriers when traveling to different hotels around the world.

## Features

This starter project includes official Nuxt.js modules for best PWA project:

- [Http](https://github.com/nuxt/http)
- [Google-analytics](https://github.com/nuxt-community/analytics-module)
- [PWA](https://github.com/nuxt-community/pwa-module)
- [Sentry](https://github.com/nuxt-community/sentry-module)
- [Sitemap](https://github.com/nuxt-community/sitemap-module)

It is also enriched with the best Vue's UI framework:

- [Vuetify](https://vuetifyjs.com)
- [VeeValidate](https://baianat.github.io/vee-validate/)

## Pre-request

In order to run this project properly, make sure you have:
- [Node.js](https://nodejs.org/en/download/package-manager/) v10.16.3 or above
- [Yarn](https://yarnpkg.com/lang/en/docs/install/) v1.17.3 or above
- [Firebase CLI](https://firebase.google.com/docs/cli) v7.3.2 or above

## Setup

```bash
# install dependencies
$ yarn
```

## Local Development

To run this project locally, execute this command below

```bash
# serve with hot reload at localhost:3000
$ yarn dev
```

## Getting Started

For detailed explanation on how things work, check out the [Nuxt.js](https://github.com/nuxt/nuxt.js) and [Vuetify.js](https://vuetifyjs.com/) documentation.

## Deployment

Run this one-lined command below to deploy to [Firebase Hosting](https://firebase.google.com/docs/hosting):

```bash
$ yarn generate && firebase deploy --only hosting
```

## Running Test

To run the test, set [Firestore Rule](https://console.firebase.google.com/u/0/project/monggo-io/database/firestore/rules) from this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}
```

to this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write;
    }
  }
}
```

And the [Storage Rule](https://console.firebase.google.com/u/0/project/monggo-io/storage/monggo-io.appspot.com/rules) from this:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

to this:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write;
    }
  }
}

```

Both of them allow client side to run the test without any of permissions.

After that, open `store/user.js` file and read the direction start from line 10. Then open `layouts/admin.vue` and read the direction start from line 233.

To run the test, execute this command below:

```bash
$ yarn test:e2e
```

Make sure to run this project on local development first.

## License

[MIT License](./license.md)

Copyright (c) Jefry Dewangga (@jefrydco)
