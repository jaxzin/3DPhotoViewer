# Contributing

Thank you for considering a contribution to 3D Photo Viewer. The following
section explains how the Continuous Integration (CI) pipeline works and what
configuration is required for deployment to the Chrome Web Store.

## Local development

Install [Yarn](https://yarnpkg.com/) and then fetch the project dependencies and
external libraries:

```bash
yarn install
grunt install
```

Run the unit tests with:

```bash
npm test
```

## CI pipeline

The repository includes a GitHub Actions workflow that automatically runs on
pull requests and pushes to the `main` or `master` branches. The pipeline:

1. Checks out the repository and installs Node.js 20 with cached Yarn modules.
2. Installs project dependencies using `yarn install --immutable`.
3. Executes `npm test` to run the Jest test suite.
4. Builds a zip archive of the Chrome extension using Grunt.
5. Uploads the archive as a workflow artifact.

When running on the `main` or `master` branch the workflow will also attempt to
publish the packaged extension to the Chrome Web Store. Publishing requires the
following secrets to be defined in the repository or organization settings:

- `CHROME_EXTENSION_ID`
- `CHROME_CLIENT_ID`
- `CHROME_CLIENT_SECRET`
- `CHROME_REFRESH_TOKEN`

If these secrets are not present the publish step is skipped.

