# The Art of Science — personal academic website

Static site for GitHub Pages: plain HTML, CSS and JavaScript, no build step, no dependencies.
All content lives in **one file: `assets/js/data.js`**.

## Pages

| Page | File | Interactive features |
|---|---|---|
| Overture (home) | `index.html` | Staff lines you "conduct" with the cursor; click to pluck, optional sound. Defense clip, bio, at-a-glance figures |
| Research | `research.html` | Glide / Grip / Propel themes, **friction lab** (stick-slip vs ultrasonic glide, live force trace) |
| Publications | `publications.html` | Filter by type, search, one-click citation copy, deep links (`publications.html#J6`) |
| Journey | `journey.html` | Clickable city route that highlights the timeline; awards, talks, teaching, service, CV download |
| Mission | `mission.html` | Initiatives, **orchestra** of supervised students, **opportunity compass** for fellowships |
| Writing | `writing.html`, `post.html` | Essays (Markdown), LinkedIn pieces, press; tabs |
| Studio | `studio.html` | YouTube series with click-to-load embeds (privacy-friendly, fast) |
| Gallery | `gallery.html` | Academic trips and science heroes albums, lightbox with keyboard and swipe |

Site-wide: light/dark theme, search palette (`Ctrl K` or `/`), and typing **maestro** anywhere.

## Publish on GitHub Pages

1. Create a repository named **`<your-username>.github.io`** (gives you `https://<your-username>.github.io`).
   Any other name works too and is served at `https://<your-username>.github.io/<repo>/`.
2. Upload the contents of this folder to the repository root (drag and drop on github.com, or `git push`).
3. In the repository: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)`**.
4. Replace `USERNAME` in `robots.txt` and `sitemap.xml` with your username.

Custom domain (e.g. `mostafaatalla.com`): add it under Settings → Pages, add a `CNAME` file containing the domain, and point the DNS at GitHub as their docs describe.

## Preview locally

Essays are loaded with `fetch`, which browsers block for files opened directly from disk. Run a local server instead:

```
cd site
python3 -m http.server 8000
```

then open http://localhost:8000.

## The home page video

The quote plays muted and looping behind the hero text. Visitors press **Hear the quote** to restart it with sound.

1. Cut the 10–20 s where you say the quote and compress it. With [ffmpeg](https://ffmpeg.org), replacing the times with yours:

   ```
   ffmpeg -ss 00:41:05 -to 00:41:20 -i defense.mp4 -vf "scale=1920:-2" -c:v libx264 -preset veryfast -crf 26 -c:a aac -b:a 96k -movflags +faststart hero-loop.mp4
   ```

   Aim for under 10 MB so the page loads quickly. HandBrake or any video editor works too: export H.264 MP4 at 1080p.
2. Upload it to `assets/video/` on GitHub as `hero-loop.mp4`.
3. Optional: export one frame as `assets/video/hero-poster.jpg` and set `defense.heroPoster` in `data.js`, so a still shows while the video loads.

The left side of the frame sits under the text and is darkened. If you can choose the framing, keep yourself on the right half.

Alternatively, use a YouTube video: clear `heroVideo`, then set `heroYoutubeId`, `heroStart` and `heroEnd` in `data.js`.

## Updating content

Everything is in `assets/js/data.js`. Items with `placeholder: true` show a dashed **Sample** badge until you replace them and delete the flag.

- **Links**: fill `person.links` (LinkedIn, Scholar, ORCID, YouTube…). Empty links stay hidden.
- **Defense clip**: set `defense.youtubeId`, or add `assets/video/defense-clip.mp4` (keep it under ~50 MB).
- **New paper**: add an object to `publications`; the counts on the home page update automatically.
- **New essay**: add `posts/<slug>.md` and an entry `{ slug, type: "essay", date, title, summary }` in `posts`.
- **LinkedIn piece / press**: add `{ type: "linkedin" | "press", date, title, summary, url }`.
- **Videos**: put the YouTube video ID (the part after `watch?v=`) in `id`.
- **Photos**: put images in `assets/photos/<album-id>/` and list them as `{ src, caption }` in the album. Resize to ~1600 px first; GitHub repositories should stay under 1 GB.
- **Initiatives**: edit `mission.initiatives`; the last entry is a template for your junior-researcher initiatives.

## Structure

```
index.html … gallery.html, post.html, 404.html
assets/css/style.css     design tokens and all styles
assets/js/data.js        all content
assets/js/site.js        header, footer, theme, search palette
assets/js/pages.js       page renderers
assets/js/hero.js        home page staff animation
assets/js/lab.js         friction lab simulation
assets/docs/Atalla_CV.pdf
posts/*.md               essays
.nojekyll                tells GitHub Pages to serve files as-is
```
