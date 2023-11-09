# mfe

This repository contains the implementation of a Micro-FrontEnd(MFE)
orchestrator that can be deployed into different cloud providers.

The source code is organized as a Monorepo which contains the orchestrator as
the main source, but inside the `demo` directory there is a monorepo for the
usage of the micro-frontend teams.

## Orchestrator

Orchestrator uses [Deno](https://deno.com/runtime) as the JavaScript/TypeScript
runtime for the main code, that provides a secure environment for running our
code.

In order to prepare get started please download Deno with the following command
(OSX):

```sh
curl -fsSL https://deno.land/x/install/install.sh | sh
```

For different types of installation, please refer to Deno's
[Get Started page](https://deno.com/manual@v1.34.1/getting_started/installation).

Deno provides out of the box a way to compile the CLI code to be used, for
building the CLI and distribution please execute the following command:

```sh
deno compile -A --unstable cli.ts
```

There is also the possibility to run the cli without building it, by simply
using deno task command.

```sh
deno task dev
```

This command would start the CLI using a cached `.app-config.json` file
(available in the source code), you can also provide your own file or simply
update the one available.

For customizing the CLI options in the `dev` command, you can also pass the
flags for this command such as:

```sh
deno task dev -s -c ./.app-config.json -p 3000
```

This options would use the specified `.app-config.json` file and start server on
port `3000` instead of the default (`8000`).

## Deploy into Providers

### Cloudflare Workers

Cloudflare Workers have their own CLI which is called `wrangler` but it is meant
most to be used with Node.js. In order to make it work with Deno, you will need
to install [Denoflare](https://denoflare.dev/).

```sh
deno install --unstable --allow-read --allow-net --allow-env --allow-run --name denoflare --force https://raw.githubusercontent.com/thebergamo/denoflare/master/cli/cli.ts
```

> At the moment of writting this `README.md`, there is a need to fix some API to
> work locally with Cloudflare Workers KV, so my fork have this change. There is
> a pending [MR](https://github.com/skymethod/denoflare/pull/54) that I would
> address at some point.

With Denoflare installed, there is a need to add couple of configurations into
the `.denoflare` file example that would make it possible to consume Cloudflare
services.

```json
{
  "scripts": {
    "scripts": {
      "mfe": {
        "path": "file:///<PATH TO PROJECT>/workers.ts",
        "localIsolation": "none",
        "bindings": {
          "CONFIGS": {
            "kvNamespace": "<KV NAMESPACE ID>"
          },
          "ARTIFACTS": {
            "bucketName": "<BUCKET NAME>"
          }
        },
        "localPort": 3000
      }
    },

    "profiles": {
      "default": {
        "accountId": "<ACCOUNT ID>",
        "apiToken": "<API TOKEN>",
        "default": true
      }
    }
  }
}
```

In the example above it is just a snnipet of the real file in the root of this
project, you need to update these values accordinly in order to make it work.

Once configuration is done, to run it in a similar environment as Cloudflare
Workers locally you can run the following task:

```sh
deno task cf
```

The Cloudflare Workers file used for this environment is `workers.ts`.

### Deno Deploy

For Deno Deploy, somehow the same variables are needed, but you can simply
create a `.env` in root of the project copying the `.env.sample` and filling the
same values.

Then simply run:

```sh
deno task server
```

For Deno Deploy is simple as that. The file used for this environemnt is
`server.ts`.

## Demo project

Demo directory contains an example + the `mfe-ui` package that shares some
templates and other UI reusable components.

This project uses PNPM project to manage the workspace and dependencies across
the MFE example and the `mfe-ui` package.

This directory is organized as `apps` where the MFEs are created and `packages`
where any reusable packages can be created such as `mfe-ui`.

Inside `demo` directory you can simply run: `pnpm install` and all dependencies
across the projects would be installed.

Then in order to build both projects, simply run `pnpm run build` and it would
build both `mfe-ui` and any `apps` created as matter of effect, at this moment
only `mfe-1` is there.
