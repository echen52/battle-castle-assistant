# Battle Castle Pokemon Finder

A web-based tool for identifying possible Pokemon opponents in Pokemon Platinum and HeartGold/SoulSilver's Battle Castle facility based on observed characteristics.

## Features

- **Game Version Support**: Toggle between HGSS and Platinum input orders
- **Multi-Search System**: Search up to 3 Pokemon simultaneously using different criteria
- **IV Modes**: Toggle between 31 IV and 21 IV calculations for accurate speed stat predictions
- **Smart Autocomplete**: Type-ahead suggestions for Items, Natures, Abilities, and Pokemon names
- **Visual Pokemon Display**: Sprite images for easy identification
- **Detailed Movesets**: View complete movesets, abilities, items, and speed stats for each match
- **Dark Theme**: Easy on the eyes during long Battle Castle sessions

## How to Use

### Game Version Selection
- **HGSS Mode** (Default): Input order is Ability → Nature → Item
- **Pt Mode**: Input order is Item → Nature → Ability

The interface automatically rearranges based on your selection to match the game you're playing.

### IV 31 Mode (Default)
Search using any combination of:
- **Ability** (e.g., Intimidate, Pressure)
- **Nature** (e.g., Adamant, Modest)
- **Item** (e.g., Choice Band, Leftovers)

All three search slots work the same way in this mode.

### IV 21 Mode
- **Search 1**: Same as IV 31 mode (Ability/Nature/Item)
- **Search 2 & 3**: Enter Pokemon name only - returns Instance 4 of that Pokemon

### Search Tips
- You don't need to fill all fields - partial searches work fine
- Use autocomplete suggestions for accurate spelling (dark-themed dropdown)
- Results show all matching Pokemon with their complete movesets
- Speed stat updates automatically based on IV selection
- Input field order changes based on game version for easier matching

## Live Demo

Visit the live site: [Your GitHub Pages URL here]

## Quick Start

1. Select your game version (HGSS or Pt)
2. Choose your IV setting (31 or 21)
3. Enter what you observed in battle (Item, Nature, Ability)
4. Click "Search All" to see possible Pokemon matches

## Installation

### Local Setup
1. Download all files from this repository
2. Open `index.html` in your web browser
3. No server required - runs entirely in your browser!

### Files Included
- `index.html` - Main application page
- `app.js` - Core application logic and autocomplete
- `styles.css` - Dark theme styling
- `logic.js` - Battle Castle filtering engine
- `pokemon_data.js` - Complete Pokemon dataset (940+ sets)
- `pokemon-sprites.js` - Pokemon sprite mapping (PokeAPI)
- `README.md` - Documentation

## Data Source

This tool uses Pokemon data from Pokemon Platinum and HGSS Battle Castle facilities, including:
- **940+ unique Pokemon sets** across all Battle Castle encounters
- **Complete movesets** for each variant (all 4 moves)
- **Accurate speed calculations** for both 31 IV and 21 IV scenarios
- **All possible combinations** of abilities, natures, and items
- **Instance tracking** (1-4) for each Pokemon species

## Technology Stack

- **Pure JavaScript** - No frameworks, fast and lightweight
- **HTML5 & CSS3** - Modern web standards
- **Custom Autocomplete** - Built from scratch with dark theme
- **PokeAPI Sprites** - Pokemon images via CDN
- **GitHub Pages** - Free hosting and deployment

## Development

### Project Structure
```
battle-castle-finder/
├── index.html          # Main HTML page with dual input modes
├── app.js              # UI logic, autocomplete, and game mode switching
├── styles.css          # Dark theme styling and responsive design
├── logic.js            # Search filtering and matching engine
├── pokemon_data.js     # Complete Pokemon dataset with stats
├── pokemon-sprites.js  # Sprite URL mapping to PokeAPI
└── README.md           # This file
```

### Key Features Implementation
- **Dynamic Input Reordering**: Fields physically rearrange based on game version
- **Custom Autocomplete**: Fully styled dropdown matching the dark theme
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Efficient Filtering**: Fast search across 940+ Pokemon sets
- **Real-time IV Switching**: Updates speed stats without re-searching
- **Mr. Mime Fix**: Proper display name handling for special cases

## Browser Support

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

**Minimum Requirements**: JavaScript enabled, ES6 support

## Usage Examples

### Example 1: HGSS Battle Castle
1. Set game to "HGSS"
2. Set IV to "31"
3. Search 1: Intimidate / Adamant / Choice Band
4. Results show all Pokemon matching these criteria with accurate speed stats

### Example 2: Platinum with 21 IVs
1. Set game to "Pt"
2. Search 1: Lum Berry / Adamant / Levitate -> Flygon 4. Check Speed !=152, =147 -> IV=21.
3. Set IV to "21"
4. Use 'Check' Option (1CP). Search 2: Garchomp (gets Instance 4)
5. Use 'Check' Option (1CP). Search 3: Salamence (gets Instance 4)

### Example 3: Quick Lookup
1. Type a few letters in any field
2. Select from autocomplete dropdown
3. Instant dark-themed suggestions appear below input

## Contributing

Found a bug or have a suggestion? Feel free to DM me @ em_baby (Discord) or potatobagel (Smogon)

## Known Limitations

- Requires internet connection for Pokemon sprites (cached after first load)
- Browser autocomplete limited to 10 suggestions per query for performance
- Dataset specific to Battle Castle facility (not Battle Tower/Factory/etc.)

## Frequently Asked Questions

**Q: Why does the input order change?**  
A: HGSS and Platinum use different display orders for Pokemon info. The tool matches what you see in-game.

**Q: What's the difference between IV 31 and IV 21?**  
A: IV 31 is standard competitive/max IVs. IV 21 is used in certain Battle Facility scenarios with modified stats.

**Q: Why Instance 4 for Search 2/3 in IV 21 mode?**  
A: This reflects specific Battle Castle mechanics in the games.


## Acknowledgments

- Pokemon sprite images from [PokeAPI](https://pokeapi.co/)
- Pokemon Platinum & HGSS Battle Castle data
- Built for the Pokemon competitive community
- Special thanks to the Battle Facility research community

## License

This project is for educational and personal use. Pokemon and all related properties are owned by Nintendo, Game Freak, and The Pokemon Company.


