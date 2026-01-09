# smart_contact_sys ✅

**A simple, lightweight file upload demo (Next.js + App Router)**

This is a small example app built with Next.js (App Router) and React that demonstrates file uploads and optionally forwards uploaded files to a configured webhook.

---

## Key Features 🔧

- Frontend file upload component (using `react-dropzone`)
- Server-side upload handling: `POST /api/upload` accepts a `file` field and can forward it to `WEBHOOK_URL`
- TypeScript + ESLint setup

---

## Quick Start 🚀

### Requirements

- Node.js 18+ (LTS recommended)
- npm / pnpm / yarn

### Install & Run (development)

From the project root, change into the `app` folder and install dependencies:

```powershell
cd app
npm install
npm run dev
```

Dev server: http://localhost:3000

### Build & Run (production)

```powershell
# Build
npm run build
# Start production server
npm run start
```

### Linting

```powershell
npm run lint
```

---

## API: Upload Endpoint 📡

- Route: `POST /api/upload`
- Payload: multipart/form-data with a `file` field
- Behavior:
  - Returns 400 if no `file` is provided
  - If `WEBHOOK_URL` environment variable is set, the server forwards the received file (as `file`) to that URL and surfaces the webhook response status
  - If `WEBHOOK_URL` is not set, the server returns success but logs a warning

Implementation: `src/app/api/upload/route.ts`

---

## Project Structure Overview 🗂️

- `app/` - Next.js application (entry)
  - `src/app/` - app source (pages, components, API routes)
  - `src/app/api/upload/route.ts` - upload handling logic
  - `components/` - frontend components (including file upload)
- `LICENSE` - license file

---

## Debugging & Logs ⚠️

- The server prints basic trace logs to the console (uploaded filename, size, webhook call status, etc.), which can be helpful during development.

---

## Contributing & Issues 🤝

Contributions are welcome—please open an issue or a pull request and follow the project's coding style. Include a short description of the change.

---

## License 🧾

This project is licensed as specified in the `LICENSE` file at the repository root. Please refer to that file for details.

---

If you’d like, I can:
- Add a more complete example (for example, a mock webhook service)
- Add CI, tests, or deployment instructions

**Thanks for using the project!**