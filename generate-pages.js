const fs = require('fs');
const path = require('path');

// Function to create URL-safe slug from event title and ID
function createSlug(title, id) {
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
    return `${id}-${slug}`;
}

// Read events.json
const eventsData = JSON.parse(fs.readFileSync('./data/events.json', 'utf8'));

// Create pages directory if it doesn't exist
const pagesDir = './pages';
if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir);
}

// Generate HTML template for each event
function generateEventPage(event, eventId) {
    const slug = createSlug(event.title, eventId);
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${event.title} - BAVE Berlin AV Events</title>
    <meta name="description" content="${event.short_description}">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#6366f1',
                        secondary: '#8b5cf6',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen">
    <!-- Navigation -->
    <nav class="border-b border-gray-800">
        <div class="container mx-auto px-4 py-4">
            <a href="../index.html" class="text-primary hover:text-primary/80 transition-colors">
                ← Back to Events
            </a>
        </div>
    </nav>

    <!-- BAVE Logo -->
    <div class="text-center py-6">
        <a href="../index.html">
            <h1 class="text-4xl md:text-5xl font-bold text-white tracking-wider hover:text-primary transition-colors">
                BAVE
            </h1>
            <p class="text-sm text-gray-400 font-light mt-2">
                Berlin Audio-Visual Events
            </p>
        </a>
    </div>

    <!-- Event Content -->
    <div class="container mx-auto px-4 py-8 max-w-4xl">
        <article class="bg-gray-800 rounded-2xl p-8 border border-white/20">
            <!-- Event Header -->
            <header class="mb-8">
                <div class="flex flex-wrap gap-2 mb-4">
                    <span class="text-xs font-medium px-3 py-1 bg-primary/20 text-primary rounded-full">
                        ${event.event_type}
                    </span>
                    ${event.tags && Array.isArray(event.tags) ? event.tags.map(tag =>
                        `<span class="text-xs px-3 py-1 bg-gray-700 text-gray-300 rounded-full">${tag}</span>`
                    ).join('') : ''}
                </div>

                <h1 class="text-3xl md:text-4xl font-bold text-white mb-6">
                    ${event.title}
                </h1>

                <div class="grid md:grid-cols-2 gap-4 text-gray-300">
                    <div class="flex items-start">
                        <span class="w-6 h-6 mr-3 flex-shrink-0">📅</span>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="flex items-start">
                        <span class="w-6 h-6 mr-3 flex-shrink-0">🕐</span>
                        <span>${event.time}</span>
                    </div>
                    <div class="flex items-start">
                        <span class="w-6 h-6 mr-3 flex-shrink-0">📍</span>
                        <div>
                            <div class="font-medium cursor-pointer hover:text-primary transition-colors"
                                 onclick="window.open('https://maps.google.com/?q=${encodeURIComponent(event.venue + ', ' + event.location)}', '_blank')">
                                ${event.venue}
                            </div>
                            <div class="text-sm text-gray-400">${event.location}</div>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <span class="w-6 h-6 mr-3 flex-shrink-0">🎭</span>
                        <span>${event.organizer}</span>
                    </div>
                    <div class="flex items-start">
                        <span class="w-6 h-6 mr-3 flex-shrink-0">💳</span>
                        <span>${event.ticket_price || 'Unknown'}</span>
                    </div>
                </div>
            </header>

            <!-- Event Description -->
            <section class="mb-8">
                <h2 class="text-2xl font-semibold text-white mb-4">About This Event</h2>
                <p class="text-gray-300 leading-relaxed text-lg mb-4">
                    ${event.short_description}
                </p>
                <p class="text-gray-300 leading-relaxed">
                    ${event.description}
                </p>
            </section>

            <!-- Event Link -->
            ${event.ticket_url ? `
            <div class="text-center pt-6 border-t border-gray-700">
                <a href="${event.ticket_url}" target="_blank"
                   class="inline-block bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                    Get Tickets / More Info →
                </a>
            </div>
            ` : ''}
        </article>

        <!-- Share Section -->
        <div class="mt-8 text-center">
            <p class="text-sm text-gray-400 mb-4">Share this event</p>
            <div class="flex justify-center gap-4">
                <button onclick="shareOnTwitter()"
                        class="text-gray-400 hover:text-primary transition-colors">
                    Twitter
                </button>
                <button onclick="shareOnFacebook()"
                        class="text-gray-400 hover:text-primary transition-colors">
                    Facebook
                </button>
                <button onclick="copyLink()"
                        class="text-gray-400 hover:text-primary transition-colors">
                    Copy Link
                </button>
            </div>
        </div>
    </div>

    <footer class="mt-16 mb-8 text-center text-gray-500 text-sm">
        <p>Part of BAVE - Berlin Audio-Visual Events</p>
        <p class="mt-2">
            <a href="../index.html" class="hover:text-primary transition-colors">View Current Events</a>
            <span class="mx-2">•</span>
            <a href="../archive.html" class="hover:text-primary transition-colors text-xs">Archive</a>
        </p>
    </footer>

    <script>
        const eventData = ${JSON.stringify(event, null, 2)};
        const pageUrl = window.location.href;

        function shareOnTwitter() {
            const text = encodeURIComponent(\`\${eventData.title} - \${eventData.short_description}\`);
            const url = encodeURIComponent(pageUrl);
            window.open(\`https://twitter.com/intent/tweet?text=\${text}&url=\${url}\`, '_blank');
        }

        function shareOnFacebook() {
            const url = encodeURIComponent(pageUrl);
            window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${url}\`, '_blank');
        }

        function copyLink() {
            navigator.clipboard.writeText(pageUrl).then(() => {
                alert('Link copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        }
    </script>
</body>
</html>`;

    return { slug, html };
}

// Load existing manifest to preserve archive
let existingManifest = { events: [] };
const manifestPath = path.join(pagesDir, 'manifest.json');
if (fs.existsSync(manifestPath)) {
    try {
        existingManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        console.log(`Loaded existing manifest with ${existingManifest.events.length} events`);
    } catch (error) {
        console.log('Could not load existing manifest, starting fresh');
    }
}

// Find the highest ID ever used in the manifest
let maxId = 0;
existingManifest.events.forEach(event => {
    if (event.id > maxId) {
        maxId = event.id;
    }
});
console.log(`Highest existing ID: ${maxId}`);

// Create a map of existing events by title+date to detect duplicates
const existingEventsByKey = new Map();
existingManifest.events.forEach(event => {
    const key = `${event.title}|${event.date}`;
    existingEventsByKey.set(key, event);
});

// Also keep track by slug for final manifest
const allEventsBySlug = new Map();
existingManifest.events.forEach(event => {
    allEventsBySlug.set(event.slug, event);
});

// Generate pages for all events
let newEventsCount = 0;
let nextId = maxId + 1;

eventsData.events.forEach((event) => {
    // Check if this event already exists (by title + date)
    const eventKey = `${event.title}|${event.date}`;
    const existingEvent = existingEventsByKey.get(eventKey);

    let eventId;
    let isNew = false;

    if (existingEvent) {
        // Event exists, reuse its ID
        eventId = existingEvent.id;
        console.log(`Found existing event: ${event.title} (ID: ${eventId})`);
    } else {
        // New event, assign next available ID
        eventId = nextId;
        nextId++;
        newEventsCount++;
        isNew = true;
    }

    const { slug, html } = generateEventPage(event, eventId);
    const filename = `${slug}.html`;
    const filepath = path.join(pagesDir, filename);

    fs.writeFileSync(filepath, html);

    if (isNew) {
        console.log(`Generated (NEW): ${filename} (ID: ${eventId})`);
    } else {
        console.log(`Updated: ${filename} (ID: ${eventId})`);
    }

    // Update or add to map
    allEventsBySlug.set(slug, {
        id: eventId,
        slug: slug,
        title: event.title,
        date: event.date,
        filename: filename,
        lastUpdated: new Date().toISOString()
    });
});

// Convert map back to array (this preserves ALL events ever created)
const allEvents = Array.from(allEventsBySlug.values());

// Save complete manifest
fs.writeFileSync(
    manifestPath,
    JSON.stringify({
        events: allEvents,
        generated: new Date().toISOString(),
        totalEvents: allEvents.length
    }, null, 2)
);

console.log(`\nTotal pages in archive: ${allEvents.length}`);
console.log(`New events added: ${newEventsCount}`);
console.log(`Updated events: ${eventsData.events.length - newEventsCount}`);
console.log('Manifest saved to pages/manifest.json');