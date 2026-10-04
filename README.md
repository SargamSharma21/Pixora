# PIXORA

PIXORA is a browser-based pixel-art studio. Create grid-based artwork, paint or erase cells, generate a color palette, save drafts, publish artwork to a local feed, edit a profile, and export artwork as PNG.

## Prerequisites

- A modern browser such as Chrome, Firefox, Safari, or Edge
- Python 3 for the simple local web server (or another static HTTP server)
- An internet connection only for the optional Colormind palette request

The application has no package manager or build step and does not require a backend.

## Run locally

1. Open a terminal in the project directory.
2. Start a local HTTP server:

   ```sh
   python3 -m http.server 8000
   ```

3. Open [http://localhost:8000/login.html](http://localhost:8000/login.html) in your browser.
4. Register a username and password, then log in.
5. Stop the server with `Ctrl+C` when finished.

## Project structure

```text
.
├── artwork.html        # Artwork detail page
├── draft.html          # Saved drafts
├── feed.html           # Public feed
├── index.html          # Pixel-art studio
├── login.html          # Registration and login
├── profile.html        # Profile editor
├── css/                # Shared and page-specific stylesheets
└── js/                 # Page behavior
    └── helpers/
        └── artwork-renderer.js  # Shared artwork rendering helper
```

## Data and security

This is a client-side learning project. User accounts, passwords, drafts, published artwork, and profile data are stored in the current browser's `localStorage`; there is no server-side account system or secure authentication. **Do not use a real or reused password.** This project is not suitable for production accounts or sensitive artwork.

No API keys are needed. The optional palette feature sends a request to the public Colormind API. Web Share depends on browser support.

Keep credentials, API keys, `.env` files, and local configuration out of source control. The repository `.gitignore` excludes common local secrets, editor settings, and OS-generated files; review files before committing as well.
