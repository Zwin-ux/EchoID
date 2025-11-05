Security note — environment variables and secrets

This repository previously contained a `.env` file with a live Neon Postgres connection string. That file has been removed from the repository index and should be rotated immediately.

Actions you should take now:
- Rotate the database credentials in Neon (create a new role/password and revoke the old one).
- Do NOT commit any secrets to the repository. Keep sensitive values in a local `.env` file or a secret manager.
- Add this repository's `.gitignore` includes `.env` and `.env.local` to prevent accidental commits.

How to store env locally (example): create a local file named `.env.local` at the project root with:

DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
NEXT_PUBLIC_POLKADOT_WS=wss://westend.api.onfinality.io/public-ws
NEXT_PUBLIC_POLKADOT_WS_FALLBACK=wss://westend-rpc.polkadot.io
NEXT_PUBLIC_APP_NAME=EchoID
NEXT_PUBLIC_ENVIRONMENT=development

If you want, I can help rotate the credentials and confirm the old secret is invalidated.
