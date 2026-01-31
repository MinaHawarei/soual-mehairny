# Orthodox Q&A Platform - Redesign Masterplan

**Version**: 1.0  
**Date**: January 31, 2026  
**Objective**: To transition from a generic AI-generated interface to a soulful, respectful, and authoritative platform for Orthodox Christian knowledge.

---

## 1. Visual Identity & Design Language

### Core Concept: *The Living Manuscript*
The design draws inspiration from the structure, breathing room, and intentionality of ancient manuscripts, translated into a modern digital experience. It avoids kitsch (excessive gold, parchment textures) in favor of **spiritual clarity**—using light, space, and typography to create a sanctuary for the mind.

### Color Palette: *Desert & Liturgy*
A palette grounded in earth tones (humility) and deep liturgical colors (mystery), avoiding neon or "tech" blues.

#### Light Mode (The Scriptorium)
- **Primary (Action)**: `Deep Indigo` (#2C3E50 -> #1A237E variant) - Representing depth and focus.
- **Background**: `Warm Alabaster` (#FAFAF9) - softer than pure white, easier on the eyes.
- **Surface/Card**: `Clean Parchment` (#FFFFFF) - Distinct from background by subtle border, not shadow.
- **Text (Body)**: `Charcoal` (#333333) - High contrast but not harsh black.
- **Accent**: `Muted Terracotta` (#8D6E63) - For spiritual highlights or secondary actions.
- **Success/Trust**: `Olive Leaf` (#556B2F) - Natural, grounded verification.

#### Dark Mode (The Vigil)
- **Background**: `Vespers Blue` (#0F172A) - Deep, cool navy/black.
- **Surface**: `Midnight` (#1E293B) - Slightly lighter for hierarchy.
- **Text**: `Starlight` (#E2E8F0) - Clear, readable.
- **Accent**: `Incense Gold` (#D4AF37) - Used *sparingly* for active states or holy references.

### Typography System (Arabic First)
The soul of the platform is text. Typography must honor the content.

- **Headings (Theology & Structure)**: **`Amiri`** (Naskh style).
  - *Why*: It carries the weight of tradition and calligraphy without being illegible.
  - usage: Page titles, Question titles.
- **Body (Reading & UI)**: **`Readex Pro`** or **`Noto Sans Arabic`** (Variable).
  - *Why*: Geometric yet humanist, extremely legible at small sizes, optimized for screens.
  - usage: Answers, UI labels, buttons.
- **Scripture/Quotes**: **`Scheherazade New`**.
  - *Why*: Distinct traditional styling to separate Holy Text from human commentary.

### Iconography
- **Style**: **Stroke/Outline** (1.5px).
- **Metaphor**: "Liturgical Line Art".
- **Characteristics**: Simple, symmetrical, no fill.
- **References**: Use abstraction. E.g., a "verified" checkmark might strictly follow a geometric grid, reminiscent of a Coptic cross proportion, but without being a literal cross.

---

## 2. Typography & Readability Strategy

### "The Lectio Divina" Layout
Reading theology requires focus. We treat every answer like a chapter in a book.

1.  **Line Length**: Capped at 60-75 characters (approx 600-700px max width) for answers.
2.  **Line Height**: Generous (1.8 for body text). The Arabic script needs vertical breathing room for vowels (Tashkil).
3.  **Vertical Rhythm**:
    - **Double margin** between the Question and the Answer.
    - **1.5x margin** between paragraphs.
    - **Quote Blocks**: Indented with a distinct side border (Accent Color), not a grey background box (which looks like code).

### Hierarchy of Voice
- **The Questioner**: Regular weight, subtle color (Grey-700). "Human seeking."
- **The Answer**: Regular weight, High contrast (Grey-900). "Truth speaking."
- **The Reference**: Serif font, slightly smaller, maybe italicized. "Ancient support."

---

## 3. Information Architecture

### Global Navigation
- **Top Bar**: Minimal. Logo (Center/Right). Search (Prominent). Profile/Menu.
- **Categories**: Do not hide them in a hamburger. Use a horizontal scrollable "Rail" on mobile or a Sidebar on desktop, but styled like a "Table of Contents".

### Page Structures

#### A. Home Page: " The Narthex (Entry)"
*Goal: Calm orientation, not information overload.*
1.  **Welcome Area**: Simple greeting ("Peace be with you"). A clean, large search bar ("What is on your heart?").
2.  **Daily Reading/Quote**: A single trusted spiritual nugget.
3.  **Curated Topics**: "The Nature of God", "Prayer", "Family". (Grid of clean cards).
4.  **Latest Answered**: List view, not grid. Emphasizes title and text snippet.

#### B. Question Listing
*Goal: Browsing.*
- **Layout**: Single column.
- **Card**: Title (Amiri), short preview (Readex), Tags (outline pills), Verified Icon (if applicable).

#### C. Details Page: "The Reading Room"
*Goal: Deep Focus.*
1.  **Header**: Breadcrumbs (Topic hierarchy). Title (H1).
2.  **Meta**: "Asked by [Name] • 2 days ago".
3.  **The Question**: Distinct background or bordered section.
4.  **The Answer**:
    - **Author Card**: Photo/Icon, Name, Title (e.g., "Fr. Daoud").
    - **Verification Badge**: "Reviewed Answer".
    - **Body Content**: The optimized reading experience.
    - **Footnotes/References**: visually distinct at bottom.
5.  **Related Questions**: "Paths for further journeying".

---

## 4. UX Flows & Interactions

### Interactions: "The Monastic Pace"
- **Speed**: Transitions should be slightly slower/smoother (300ms ease-out) to feel "calm" rather than "snappy/techy".
- **Hover States**: No aggressive jumping. Subtle color shifts or underline fade-ins.
- **Loading**: No spinning circles. Use a **"shimmer" effect** on text lines (skeleton screens) to imply "text is being illuminated".

### Search Experience
- **Input**: Large, centered.
- **Results**: Grouped by "Direct Answers" (Verified) vs "Discussions".
- **Empty State**: Suggest "Core Topics" or "Random Spiritual Quote".

---

## 5. Trust & Authority Signals

### The Authority System
We avoid "Gamification" (Badges, points, leaderboards). We use **"Worthy" signals**.

1.  **Seal of Verification**: A visual distinct from a social media "Blue Check".
    - Design: A wax-seal style icon (outline) or a small cross-in-circle.
    - Text: "Answer by Priest" or "Theologically Reviewed".
2.  **Reference Linking**:
    - If a user quotes the Bible, the system should auto-detect and create a tooltip/link to the text.
3.  **Author Roles**:
    - **Clergy**: Distinct color for name (e.g., Deep Indigo).
    - **Servant/Teacher**: Distinct color (e.g., Muted Clay).
    - **Regular User**: Neutral.

---

## 6. Accessibility & Dark Mode

- **Contrast**: Text contrast ratio > 7:1 for body text (AAA standard).
- **Scale**: Allow font-size toggling (A- / A+) directly in the article view.
- **Dark Mode**:
    - Avoid pure black (#000000). Use #0F172A (Slate 900) or similar.
    - Desaturate accent colors in Dark Mode to prevent eye strain.

---

## 8. Future Enhancements

- **Audio Answers**: "Listen on the Go" feature for long theological answers, using a natural-sounding neural voice (not robotic).
- **The Prayer Corner**: A personalized dashboard where users save questions and add private spiritual notes/reflections.
- **Liturgical Calendar Integration**: Contextualize questions based on the current fast or feast (e.g., highlighting Fasting questions during Lent).
- **"Ask a Priest" Direct**: A private channel for sensitive pastoral questions, distinct from the public forum.

---

## 7. Implementation Roadmap (Next Steps)

1.  **Setup Shadcn Theme**: Configure `app.css` with the new color variables (Oklch).
2.  **Typography**: Import `Amiri` and `Readex Pro` from Google Fonts. Configure `tailwind.config`.
3.  **Layout Refactor**: Rebuild the Main Layout to support the "Manuscript" feel (centered max-width content container).
4.  **Component Reskin**: Update Cards and Buttons to remove shadows and roundness, adding borders and structure.
