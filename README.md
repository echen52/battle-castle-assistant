# Battle Castle Pokemon Finder

A web-based tool for identifying possible Pokemon opponents in Pokemon Platinum's Battle Castle facility based on observed characteristics.

## Features

- **Multi-Search System**: Search up to 3 Pokemon simultaneously using different criteria
- **IV Modes**: Toggle between 31 IV and 21 IV calculations for accurate speed stat predictions
- **Smart Autocomplete**: Type-ahead suggestions for Items, Natures, Abilities, and Pokemon names
- **Visual Pokemon Display**: Sprite images for easy identification
- **Detailed Movesets**: View complete movesets, abilities, items, and speed stats for each match

## How to Use

### IV 31 Mode (Default)
Search using any combination of:
- **Item** (e.g., Choice Band, Leftovers)
- **Nature** (e.g., Adamant, Modest)
- **Ability** (e.g., Intimidate, Pressure)

All three search slots work the same way in this mode.

### IV 21 Mode
- **Search 1**: Same as IV 31 mode (Item/Nature/Ability)
- **Search 2 & 3**: Enter Pokemon name only - returns Instance 4 of that Pokemon

### Search Tips
- You don't need to fill all fields - partial searches work
- Use autocomplete suggestions for accurate spelling
- Results show all matching Pokemon with their complete movesets
- Speed stat updates automatically based on IV selection


## Installation

### Local Setup
1. Download all files from this repository
2. Open `index.html` in your web browser
3. No server required - runs entirely in your browser!

### Files Included
- `index.html` - Main application page
- `app.js` - Core application logic
- `styles.css` - Dark theme styling
- `logic.js` - Battle Castle filtering engine
- `pokemon_data.js` - Complete Pokemon dataset
- `pokemon-sprites.js` - Pokemon sprite mapping

## Data Source

This tool uses Pokemon data from Pokemon Platinum/HeartGold/SoulSilver's Battle Castle facility, including:
- 940+ unique Pokemon sets
- Complete movesets for each variant
- Accurate speed calculations for both 31 IV and 21 IV scenarios
- All possible ability, nature, and item combinations

## Technology Stack

- **Pure JavaScript** - No frameworks required
- **HTML5 & CSS3** - Modern web standards
- **PokeAPI Sprites** - Pokemon images via CDN
- **GitHub Pages** - Free hosting

## Development

### Project Structure
```
battle-castle-finder/
├── index.html          # Main HTML page
├── app.js              # UI logic and autocomplete
├── styles.css          # Dark theme styling
├── logic.js            # Search filtering logic
├── pokemon_data.js     # Pokemon dataset
├── pokemon-sprites.js  # Sprite URL mapping
└── README.md           # This file
```

### Key Features Implementation
- **Custom Autocomplete**: Built from scratch to match dark theme
- **Responsive Design**: Works on desktop and mobile
- **Efficient Filtering**: Fast search across 900+ Pokemon sets
- **Dynamic IV Switching**: Updates results in real-time

## Browser Support

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Contributing

Found a bug or have a suggestion? DM me @ em_baby (Discord) or potatobagel (Smogon)

## Acknowledgments

- Pokemon sprite images from [PokeAPI](https://pokeapi.co/)
- Pokemon Platinum/HeartGold/SoulSilver Battle Castle data
- Built for the Pokemon competitive community

## License

This project is for educational and personal use. Pokemon and all related properties are owned by Nintendo, Game Freak, and The Pokemon Company.


