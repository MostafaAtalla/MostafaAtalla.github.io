# The Art of Science — personal academic website

Static site for GitHub Pages: plain HTML, CSS and JavaScript, no build step, no dependencies.
All content lives in **one file: `assets/js/data.js`**.

## Pages

| Page | File | What it holds |
|---|---|---|
| Home | `index.html` | Defense quote over the video with playable strings, PhD defense, research statement with a live friction lab, teaching philosophy, vision & mission, highlights (dials, latest papers/awards/perspectives/news, affiliations) |
| Research | `research.html` | Statement, Glide/Grip/Propel themes, full friction lab |
| Mentoring & Teaching | `teaching.html` | Philosophy, courses and course videos, supervised students ("the orchestra") |
| Vision & Mission | `mission.html` | Vision and mission, what I do for junior researchers, workshops organised, grants that opened doors |
| Journey | `journey.html` | Animated map of the two big moves (Cairo → Massachusetts → Delft), chapters with logos and a rotating photo reel, talks, service |
| Publications | `publications.html` | Each entry with a figure or video, a one-line highlight, related presentations and awards |
| Perspectives | `perspectives.html`, `post.html` | Opinion pieces (open the LinkedIn post in place) and Markdown essays |
| Studio | `studio.html` | Science talks, Courses, Gallery (academic trips, science heroes) |
| Awards | `awards.html` | Filter by type and year; awards with photos open their story |
| News | `news.html` | Papers, awards, talks, workshops, press; filter by kind |
| Contact | `contact.html` | Email, LinkedIn, YouTube, CV (also reachable from the Contact button in the header and the footer) |

`writing.html` and `gallery.html` redirect to their new homes, so old links keep working.

Photos from LinkedIn are stored in `assets/photos/li/`, preprint figures in `assets/img/pubs/`, journey photos in `assets/journey/`, institution logos in `assets/img/logos/`.

**Science heroes:** put photos in `assets/photos/heroes/` and add `{ src, name, note }` entries to `heroes` in `data.js`.

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
