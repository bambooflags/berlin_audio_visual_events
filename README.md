# BAVE - Berlin Audio-Visual Events

A static website showcasing weekly TouchDesigner events, video projections, and AV performances in Berlin.

## Project Structure

```
.
├── index.html              # Main landing page with event cards
├── data/
│   └── events.json        # Event data source
├── pages/                 # Individual event pages (auto-generated)
│   ├── manifest.json      # Index of all generated pages
│   └── *.html            # Individual event pages
├── generate-pages.js      # Script to generate individual event pages
└── package.json          # NPM scripts
```

## Features

- **Individual Event Pages**: Each event gets its own page with a SEO-friendly URL format: `{id}-{event-title-slug}.html`
- **Archive-Ready**: Pages are preserved in the `pages/` directory for historical reference
- **SEO Optimized**: Each page has proper meta tags, descriptions, and semantic HTML
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Share Functions**: Built-in Twitter, Facebook, and copy-link functionality

## Usage

### Generating Event Pages

When you update `data/events.json`, regenerate the individual event pages:

```bash
npm run generate-pages
```

This will:
1. Read all events from `data/events.json`
2. Generate individual HTML pages in the `pages/` directory
3. Create a `manifest.json` with metadata about all generated pages

### URL Format

Event pages follow this naming convention:
```
{event-id}-{sanitized-event-title}.html
```

Example:
- Event: "3hd Festival – Heavy Rotation Opening"
- URL: `pages/8-3hd-festival-heavy-rotation-opening.html`

### Local Development

Start a local server:

```bash
npm run serve
```

Then open: http://localhost:8000

## Deployment

This is a static site optimized for GitHub Pages. Simply push to the repository and enable GitHub Pages in settings.

## Updating Events

1. Update `data/events.json` with new events
2. Run `npm run generate-pages` to create new event pages
3. Commit and push all changes (including generated pages)

Old event pages remain in the `pages/` directory for archival purposes and SEO benefits.