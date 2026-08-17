# Drovia - Cross-Device File Transfer

React + Vite + Tailwind CSS project for fast, secure file sharing between devices.

## Development Server

A Vite development server runs on `$PORT` (default 8443).

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component and UI layout switcher (Web & Mobile views)
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `src/screens/` - Web app screens (Landing, SendFile, TransferReady, Receive, Connecting, IncomingFile, Progress, Complete, History, Settings, ErrorStates)
- `src/mobile/` - Mobile app mockup screens (MobileHome, MobileSend, MobilePin, MobileReceive, MobileProgress, MobileSuccess, MobileTransfers, MobileSettings)
- `index.html` - Vite HTML shell loading `src/main.tsx`
- `package.json` - Project dependencies and scripts
- `vite.config.ts` - Vite configuration with React and Tailwind CSS v4 plus the `@` alias for `src`

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, `@vitejs/plugin-react`

## Styling

This project uses **Tailwind CSS v4** through `@tailwindcss/vite`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX.
