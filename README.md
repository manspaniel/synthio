# g7

`g7` is a procedural art tool, focused on providing you with UI to support development and experimentation. The UI is configurable, depending on the needs of your piece, and your work can be deployed with or without the additional UI. It was created as a tool for helping me control the flow of time, debug generation steps, export working versions, and publishing.

`g7` doesn't care which libraries you use for your art, nor the format — Any Canvas2D, WebGL, SVG or regular DOM libraries are all supported. It provides no mathematical or rendering functionality. If you need that, you'll need to install appropriate libraries.

## Dependencies

React is currently required for setting up your workspace, however the requirement may be removed in the future. There are several hooks available for managing the state of the UI, as well as for hooking into the generating and rendering pipeline.

TypeScript isn't required, but is supported. All exports are fully typed!

Vite is used for development, and for constructing a published version.

## Features

- **Configurable UI** — only enable what you need, with options for development and publishing.
- **Canvas** — pan and zoom around your work.
- **Deployable** — deploy straight to Vercel, or any other platform which Vite supports. Or build a static version.
- **Exhibit** — Enable or disable UI when deploying
- **Quick Export** — Hit `command + s` in your browser during development to save the currently rendered frame to a folder alongside your code (SVG and Canvas)
- **Record** — Produce videos and GIFs, with variable FPS and duration.
- **Time Control** — Play and Pause, with rewind and fastforward for deterministic works.
- **Separated Generation and Rendering** — add an optional "generate" step, to generate any data or resources before rendering can occur.
- **Debug** — Debugger windows for seeing hidden elements of your work, such as generated textures, structures and values.
- **Parameterize** — Add tweakable properties to parameterize your algorithms.
- **Seed** — Deterministically randomize your works.

*Planned features:*

- **Multi-canvas support** — The ability to show multiple versions of your work, with different seeds.
- **Seeded batch export** — The ability to generate multiple images in sequence, using different seeds.