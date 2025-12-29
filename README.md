# Pokémon Living Dex Organizer

A Vue 3 web application for organizing and visualizing your Pokémon living dex with Pokémon Home-style box layouts.

## Features

- **Box Layout**: 6×5 grid (30 Pokémon per box) matching Pokémon Home
- **Two Presets**: Normal and Shiny living dex configurations
- **Flexible Organization**: Multiple configuration options
  - Toggle shiny/non-shiny sprites
  - Divide by generation (start new box per generation)
  - Include/exclude gender differences
  - Include/exclude regional forms (Alolan, Galarian, Hisuian, Paldean)
- **Regional Form Placement**: Three ordering modes
  - **After Base Form**: Regional forms appear right after their base form (e.g., Pikachu → Pikachu-Alola)
  - **After Generation**: All base forms in Gen 1, then regionals from Gen 1, etc.
  - **After All**: All base forms #1-1025, then all regional forms grouped by region
- **Shiny Lock Detection**: Unavailable shinies are automatically grayed out
- **Local Storage**: Settings persist across browser sessions

## Tech Stack

- **Framework**: Vue 3.5 with Composition API
- **Build Tool**: Vite 6
- **Language**: TypeScript 5
- **State Management**: Pinia 2
- **Sprites**: PokéSprite project (Git submodule)
- **Styling**: Native CSS with CSS Modules

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at http://localhost:5173/

## Project Structure

```
src/
├── components/
│   ├── box/              # Box display components
│   ├── layout/           # Layout components (ConfigPanel)
│   └── ui/               # UI components (BoxList)
├── composables/          # Vue composables
├── data/                 # Pokemon registry and data
├── stores/               # Pinia stores
├── types/                # TypeScript type definitions
└── utils/                # Utility functions (algorithms, sprite resolver)
```

## Configuration

The app includes two preset configurations that you can customize:

### Normal Living Dex
- Regular sprites
- Includes gender differences and regional forms
- Regional forms appear after their base form

### Shiny Living Dex
- Shiny sprites
- Includes gender differences and regional forms
- Shiny-locked Pokémon are grayed out
- Regional forms appear after their base form

All settings are saved to your browser's localStorage automatically.

## Current Status - MVP

This MVP includes:
- ✅ Gen 1 Pokémon (with examples of regional forms and gender differences)
- ✅ All core algorithms and configuration options
- ✅ Functional UI with Pokémon Home-style aesthetics
- ✅ localStorage persistence

## Next Steps

To expand this to a full application:

1. **Expand Pokemon Registry**: Add all generations (Gen 2-9)
   - Process the full `external/pokesprite/data/pokemon.json` file
   - Add all regional forms, gender differences, and form variations

2. **Virtual Scrolling**: Implement VueUse's `useVirtualList` for performance with 100+ boxes

3. **Collection Tracking**: Add ability to mark which Pokémon you own
   - Click to toggle owned/not owned
   - Progress tracking
   - Export/import collection data

4. **Enhanced Features**:
   - Search and filter functionality
   - Custom box naming
   - Dark/light theme
   - Mobile optimization
   - PWA support for offline use

## Contributing

Contributions are welcome! Areas that need work:
- Expanding the Pokemon registry to include all generations
- Adding more shiny-locked Pokémon to the list
- Implementing virtual scrolling for better performance
- Adding collection tracking features

## License

This project uses sprites from the [PokéSprite project](https://github.com/msikma/pokesprite), which has its own license. Please refer to the PokéSprite repository for sprite licensing information.

## Acknowledgments

- Sprites from [PokéSprite](https://github.com/msikma/pokesprite) by msikma
- Inspired by Pokémon Home's box organization system
