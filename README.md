<p align="center">
    <a href="https://myextraduty.com"><img style="width: 200px; height: 200px;" src="https://github.com/YTG2G3/myextraduty/blob/development/public/myed_logo_light.png?raw=true" /></a>
</p>

# MyExtraDuty

📅 An easy way to manage your extra duties. Powered by Algorix.

## Table of Contents

- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

## Contributing

### Environment Settings

#### Prisma

```
DATABASE_URL: PostgreSQL Connection String
```

#### Google OAuth

```
GOOGLE_CLIENT_ID: Google OAuth ID
GOOGLE_CLIENT_SECRET: Google OAuth Secret
```

#### [Next Auth](https://next-auth.js.org/configuration/options)

```
NEXTAUTH_SECRET: JWT Secret
NEXTAUTH_URL: Redirection URL
```

### Considerations

- **Branches**: `main` is the stable branch, `development` is the development branch.
- This project uses Yarn berry with zero-install.
- Validate a project when using Zero-Installs : `yarn install --immutable --immutable-cache`
- Validate a project when using Zero-Installs (slightly safer if you accept external PRs) : `yarn install --immutable --immutable-cache --check-cache`
- On issue: run `yarn dlx @yarnpkg/sdks`

## Acknowledgements

- [Taeksoo Kwon](https://github.com/YTG2G3), Class of 2024, the head developer
- [Mingeon Kim](https://github.com/issac4892), Employee of Algorix, development assist
- [Yejoon Kim](https://github.com/unsignd), Employee of Algorix, logo design
- [Algorix Corporation](https://github.com/algorix-corp), Provision of hosted database
- [Vercel](https://vercel.com)
