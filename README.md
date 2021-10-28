This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

<br>

# Guidelines

## `Note:` Lib folder is created for managing backend. Please do not use it in frontend code. It can cause unexpected errors

<br>

---

<br>

### Pre Commit Hook

This is to put the branch name (which is usually the JIRA ticket number) into the commit message automatically

```
yarn init-prepare-commit-message
```

## Coding practice

### `Frontend:`

1. All the page/route files will follow smallcase with hypen separated
2. All the components follow smallcase with hypen separated.
3. Remaining typescript file will follow camel case

<br>

---

<br>

### `Backend:` - code is spread across lib, model, api folders

1. All the api routes also follow smallcase with hypen separated.
2. Remaining typescript files in backend will follow smallcase
