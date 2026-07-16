---
name: Project Caligo
description: A precise, mysterious visual system for selling Mirage as one continuous Minecraft world.
colors:
  midnight-infrastructure: "#06080f"
  deep-surface: "#0a0d17"
  raised-surface: "#101524"
  mirage-periwinkle: "#8d9bff"
  refracted-light: "#b9c4ff"
  frosted-white: "#edf1ff"
  distant-silver: "#9da8c2"
  action-surface: "#d7dcff"
  action-surface-hover: "#eff1ff"
  action-ink: "#101322"
  error-soft: "#ffb6bf"
  error-strong: "#ff8f9d"
  quiet-line: "#bfd2ff29"
  assertive-line: "#bfd2ff4d"
typography:
  display:
    fontFamily: "Avenir Next, Avenir, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3.7rem, 6.8vw, 6rem)"
    fontWeight: 650
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Avenir Next, Avenir, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.6rem, 5vw, 4.6rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Avenir Next, Avenir, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.4rem, 2.3vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Avenir Next, Avenir, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Avenir Next, Avenir, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "0"
rounded:
  square: "0px"
  precise: "2px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "80px"
  section: "144px"
components:
  button-primary:
    backgroundColor: "{colors.action-surface}"
    textColor: "{colors.action-ink}"
    rounded: "{rounded.precise}"
    padding: "13px 18px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.action-surface-hover}"
    textColor: "{colors.action-ink}"
    rounded: "{rounded.precise}"
  nav-cta:
    backgroundColor: "{colors.midnight-infrastructure}"
    textColor: "{colors.frosted-white}"
    rounded: "{rounded.square}"
    padding: "10px 14px"
  program-panel:
    backgroundColor: "{colors.deep-surface}"
    textColor: "{colors.frosted-white}"
    rounded: "{rounded.square}"
    padding: "24px 40px"
---

# Design System: Project Caligo

## Overview

**Creative North Star: "The Invisible Seam"**

Project Caligo should feel like a continuous world assembled from precise, separate pieces. Dark infrastructure recedes while crystalline periwinkle surfaces reveal only enough structure to build trust. The system is mysterious in atmosphere, direct in hierarchy, and commercially legible to experienced Minecraft network operators.

The experience sells outcomes rather than internals. Large composed imagery and decisive statements carry the story; restrained diagrams may explain continuity at a conceptual level, but the page never becomes technical documentation. PaperMC is a reference for navigational clarity and useful grouping, not a visual template.

**Key Characteristics:**

- Midnight surfaces with one controlled periwinkle light source.
- Faceted imagery that turns separation into perceived continuity.
- Direct, weight-driven sans-serif headlines paired with a serif Caligo wordmark.
- Sharp geometry, one-pixel boundaries, and almost no conventional elevation.
- Spacious single-purpose sections with a clear route to contact.
- Motion that reveals hierarchy without becoming spectacle.

## Colors

The palette behaves like light moving through smoked glass: near-black structure, pale silver information, and rare periwinkle refraction.

### Primary

- **Mirage Periwinkle** (`mirage-periwinkle`): The active brand signal for continuity lines, emphasis, focus, and rare moments of transition. Its scarcity gives it authority.
- **Refracted Light** (`refracted-light`): The softer brand light for labels, subtle highlights, and supporting emphasis on midnight surfaces.

### Neutral

- **Midnight Infrastructure** (`midnight-infrastructure`): The page canvas and dominant background. It keeps the underlying system visually present but quiet.
- **Deep Surface** (`deep-surface`): The first tonal step for program panels and grouped content.
- **Raised Surface** (`raised-surface`): A restrained second tonal step where hierarchy needs more separation than a border alone.
- **Frosted White** (`frosted-white`): Primary text and high-value headings.
- **Distant Silver** (`distant-silver`): Supporting body copy and secondary information. Never use it below accessible contrast.
- **Quiet Line** (`quiet-line`): Low-emphasis structural separators.
- **Assertive Line** (`assertive-line`): Interactive boundaries and server-node outlines.

**The One Refraction Rule.** Periwinkle is the only chromatic accent. Never introduce a competing hue for a new section, state, or CTA.

**The Midnight Continuity Rule.** Every public marketing section stays inside the midnight surface family. Depth comes from tonal steps, not theme switching.

## Typography

**Display and Body Font:** Avenir Next with Avenir, Helvetica Neue, and Arial fallbacks
**Wordmark Font:** Bodoni 72 with Didot and Times New Roman fallbacks
**Label/Mono Font:** SFMono-Regular with Consolas and Liberation Mono fallbacks

**Character:** Weight-driven sans-serif headings make the offer immediate and product-led. The serif is reserved for the Caligo wordmark, preserving the butterfly's elegance without making the whole site feel editorial. Monospace is reserved for short infrastructure labels where it carries real semantic meaning.

### Hierarchy

- **Display** (650, `clamp(3.7rem, 6.8vw, 6rem)`, 0.96): Hero statements only. Keep desktop hero copy to two balanced lines.
- **Headline** (600, `clamp(2.6rem, 5vw, 4.6rem)`, 1): Section-defining statements with no more than one primary idea.
- **Title** (600, `clamp(1.4rem, 2.3vw, 2rem)`, 1.15): Program offers, server-world labels, and grouped content.
- **Body** (400, `1rem`, 1.65-1.75): Outcome-focused explanation with a maximum line length of 65-75 characters.
- **Label** (650, `0.8rem`, normal tracking): Plain-language section identifiers. Monospace uppercase remains limited to the hero product descriptor and infrastructure status.

**The Outcome First Rule.** Headlines describe the value buyers receive. Implementation terminology belongs in documentation, not display type.

**The Serif Reserve Rule.** Bodoni belongs to the Caligo wordmark and rare identity moments, not product headlines, paragraphs, controls, or metadata.

## Elevation

The system is flat and optically layered. It uses near-black tonal shifts, one-pixel borders, image masks, and restrained translucency instead of drop shadows. The fixed header may use background blur after scrolling because it preserves legibility over content; blur is not a general-purpose card material.

**The Flat Infrastructure Rule.** Surfaces have no drop shadow at rest. If a panel needs a wide blurred shadow to separate it, the hierarchy or tonal contrast is wrong.

**The Boundary Rule.** Borders organize real structure. Decorative outlines and glow rings are forbidden.

## Motion

Motion behaves like refraction becoming legible: brief, directional, and tied to continuity or state. The page uses one composed hero entrance, then reserves scroll-triggered choreography for the continuity diagram, the real three-stage journey, and the Caligo wings.

- **Timing:** `100-150ms` for press feedback, `180-240ms` for navigation and status changes, and `420-700ms` for authored entrances.
- **Easing:** Exponential or quartic ease-out only. No bounce, elastic, spring, or looping decorative motion.
- **Hero:** Copy settles by no more than `10px`; the world image resolves from a restrained scale and tonal shift; a single refracted seam crosses the image once.
- **Continuity:** Three panorama panes resolve in order, followed by one light pass across the fixed server seams. The sequence does not loop.
- **Feedback:** The mobile menu moves as one surface, validation receives a short horizontal correction, and submitting uses a bounded progress line.
- **Accessibility:** Content is visible without animation classes. `prefers-reduced-motion: reduce` reduces all animation and transition durations to effectively instant.

**The One Choreography Rule.** Never apply the same fade-and-rise reveal to every section. Motion must explain a relationship, communicate state, or embody the invisible-seam metaphor.

## Components

Components are sharp, restrained, and decisive. Corners are square or almost square; interaction comes from contrast, precise borders, and short movement rather than softness.

### Buttons

- **Shape:** Almost square (`2px`) with a minimum height of `48px`.
- **Primary:** Refracted action surface with dark action ink, `13px 18px` padding, and semibold sans-serif text.
- **Hover / Focus:** The surface brightens toward Frosted White; keyboard focus uses a visible Refracted Light outline with `4px` offset.
- **Active:** Move down by `1px` to acknowledge the press without scaling or bouncing.
- **Text link:** Transparent with a single bottom boundary. It brightens and adopts Mirage Periwinkle on hover or focus.

### Cards / Containers

- **Corner Style:** Square (`0px`) or precise (`2px`) only.
- **Background:** Midnight Infrastructure, Deep Surface, or Raised Surface.
- **Shadow Strategy:** None. Refer to the flat elevation philosophy.
- **Border:** One-pixel Quiet Line for grouping; Assertive Line only for meaningful interactive or architectural emphasis.
- **Internal Padding:** `24px-40px`, reduced to `24px` on mobile.
- **Composition:** Program panels form an asymmetric grid with different spans and visual roles. Never normalize them into identical cards.

### Navigation

- **Desktop:** A single 72px line with the Project Caligo lockup, four direct product anchors, and one bordered contact action.
- **Scrolled:** Midnight Infrastructure at high opacity with a restrained blur and Quiet Line below.
- **Mobile:** A 64px bar and a 44px square toggle. The expanded menu becomes a full-width vertical surface beneath the header.
- **States:** Links brighten from Distant Silver to Frosted White. Focus is always visible.

### Continuity Diagram

- **Purpose:** Explain one continuous player experience across separate backend worlds without exposing Mirage implementation details.
- **Structure:** One continuous world panorama is physically divided into three server panes. A periwinkle route crosses both seams without breaking, while paired captions contrast the player experience with the infrastructure underneath.
- **Mobile:** Preserve the horizontal journey, reduce the panorama height, and compact its metadata so the uninterrupted route remains immediately legible.

### Contact Form

The contact section uses a direct two-column composition: a benefit-led invitation with email and Discord alternatives on the left, and one integrated ruled form on the right. On tablet and mobile it becomes a single continuous column.

- **Fields:** Persistent mono labels, Frosted White input text, accessible Distant Silver helper text, and a precise two-pixel Periwinkle focus rule.
- **Required data:** Email only. Network name and message are explicitly marked optional.
- **Primary action:** "Start a conversation" uses the strongest resting-state contrast in the section. Email and Discord remain subordinate alternatives.
- **States:** Missing and malformed email errors are distinct. Submitting, success, delivery failure, and offline states are announced through a live region.
- **Resilience:** Content remains visible without JavaScript, and the native form path returns a standalone confirmation or recovery page.
- **Security:** The browser never contains or exposes the Discord webhook URL; delivery occurs only through the server endpoint.

## Do's and Don'ts

### Do:

- **Do** lead with continuity, scale, and player experience instead of technical implementation.
- **Do** keep Mirage Periwinkle rare and meaningful across the entire page.
- **Do** use large generated brand imagery where it communicates the invisible-seam metaphor.
- **Do** borrow PaperMC's direct hierarchy and useful navigation while preserving Project Caligo's identity.
- **Do** make the website form the primary conversion path, with `contact@industrium.net` and the Industrium Discord as clear alternatives.
- **Do** meet WCAG 2.2 AA with keyboard access, visible focus, sufficient contrast, semantic markup, and reduced-motion behavior.

### Don't:

- **Don't** use generic gamer-neon or cyberpunk styling.
- **Don't** use blocky Minecraft fan-site aesthetics or novelty pixel-art presentation.
- **Don't** use generic SaaS dashboards, interchangeable startup cards, or enterprise software templates.
- **Don't** turn the marketing page into a technical architecture explanation.
- **Don't** expose the Discord webhook in client-side HTML or JavaScript, and don't invent additional communication channels.
- **Don't** repeat tiny uppercase tracked eyebrows above every section heading.
- **Don't** use rounded cards, decorative glassmorphism, gradient text, or wide ambient card shadows.
- **Don't** introduce a second accent hue or switch the page into a light theme mid-story.
