# Battle Castle Assistant

A web-based tool for identifying possible Pokemon in Pokemon Platinum and HeartGold/SoulSilver's Battle Castle facility based on observed characteristics.

## Features

- **Game Version Support**: Toggle between HGSS and Platinum input orders
- **Multi-Search System**: Search up to 3 Pokemon simultaneously using different criteria
- **IV Modes**: Toggle between 31 IV and 21 IV calculations for accurate speed stat predictions
- **Smart Autocomplete**: Type-ahead suggestions for Items, Natures, Abilities, and Pokemon names
- **Visual Pokemon Display**: Sprite images for easy identification
- **Detailed Movesets**: View complete movesets, abilities, items, HP, and speed stats for each match
- **Alarm Badges**: Highlights dangerous moves (OHKO, setup, counter) on any result card
- **Reverse Trainer Lookup** *(IV 31 only)*: After confirming Pokemon 1 and 2, identify which trainer groups could have sent them and narrow down candidates for slot 3
- **Candidate Filtering**: Filter slot 3 candidates live by name and exact HP value
- **Dark Theme**: Easy on the eyes during long Battle Castle sessions

## How to Use

### Game Version Selection
- **HGSS Mode** (Default): Input order is Ability → Nature → Item
- **Pt Mode**: Input order is Item → Nature → Ability

The interface automatically rearranges based on your selection to match the game you're playing.

### IV 31 Mode (Default)

#### Standard Search (Searches 1–3)
Search using any combination of:
- **Ability** (e.g., Intimidate, Pressure)
- **Nature** (e.g., Adamant, Modest)
- **Item** (e.g., Choice Band, Leftovers)

#### Reverse Trainer Lookup
After running Searches 1 and 2, select the confirmed instance from each result (e.g. "Tauros 1", "Quagsire 2") using the **Select** button on each card. Once both are selected:

1. Click **Find Trainers** — shows all trainer groups whose rosters contain both confirmed Pokemon
2. Trainers with identical rosters are collapsed into a single group (e.g. "GLEN / LYLE | Hiker")
3. Expand a trainer group to see slot 3 candidates, automatically filtered to exclude Pokemon holding either of the already-seen items
4. Use the **name** and **HP** filter inputs to narrow candidates live as you scout
5. Click **Select** on the confirmed slot 3 candidate — displays it as **Search 3 Results** at the bottom
6. Use **Undo Trainer Search** to discard the lookup and fall back to the normal Search 3 item/nature/ability inputs, while keeping your Search 1 and 2 selections

### IV 21 Mode
- **Search 1**: Same as IV 31 mode (Ability/Nature/Item)
- **Search 2 & 3**: Enter Pokemon name only — returns Instance 4 of that Pokemon
- Reverse Trainer Lookup is not available in this mode

### Search Tips
- You don't need to fill all fields — partial searches work fine
- Use autocomplete suggestions for accurate spelling
- Results show all matching Pokemon with complete movesets
- Speed and HP stats are shown on every card
- Watch for the ⚠ alarm badge — flags OHKO moves (Sheer Cold, Horn Drill, Fissure, Guillotine), setup moves (Swords Dance, Dragon Dance, Double Team), and counter moves (Counter, Mirror Coat, Psych Up)
- Input field order changes based on game version for easier matching

## Quick Start

1. Select your game version (HGSS or Pt)
2. Choose your IV setting (31 or 21)
3. Enter what you observed in battle (Item, Nature, Ability)
4. Click **Search All** to see possible Pokemon matches

## Usage Examples

### Example 1: HGSS IV 31 — Full Reverse Trainer Lookup
1. Set game to "HGSS", IV to "31"
2. Search 1: Levitate / Modest / Lum Berry → results appear → click **Select** on the confirmed match
3. Search 2: Guts / Adamant / Quick Claw → results appear → click **Select** on the confirmed match
4. Click **Find Trainers** → trainer groups appear with slot 3 candidate counts
5. Expand a group → type the species name and/or HP in the filter inputs → click **Select** on the confirmed slot 3 Pokemon
6. Search 3 Results appear at the bottom with full moveset info

### Example 2: HGSS IV 31 — Trainer Lookup with Fallback
1. Follow steps 1–4 above
2. If there are too many trainer groups or candidates, click **Undo Trainer Search**
3. Search 3 inputs restore to normal — search by Item/Nature/Ability as usual

### Example 3: Platinum with 21 IVs
1. Set game to "Pt"
2. Search 1: Lum Berry / Adamant / Levitate → Flygon 4. Check Speed ≠ 152, = 147 → IV = 21
3. Set IV to "21"
4. Use Check option (1 CP). Search 2: Garchomp → gets Instance 4
5. Use Check option (1 CP). Search 3: Salamence → gets Instance 4

## Data Source

This tool uses Pokemon data from Pokemon Platinum and HGSS Battle Castle facilities, including:
- **940+ unique Pokemon sets** across all Battle Castle encounters
- **Complete movesets** for each variant (all 4 moves)
- **Accurate speed and HP calculations** for both 31 IV and 21 IV scenarios
- **All possible combinations** of abilities, natures, and items
- **Instance tracking** (1–4) for each Pokemon species
- **158 HGSS trainer rosters** with full Pokemon pools for reverse lookup

## Technology Stack

- **Pure JavaScript** — No frameworks, fast and lightweight
- **HTML5 & CSS3** — Modern web standards
- **Custom Autocomplete** — Built from scratch with dark theme
- **PokeAPI Sprites** — Pokemon images via CDN
- **GitHub Pages** — Free hosting and deployment

### Project Structure
```
battle-castle-finder/
├── index.html          # Main HTML page with dual input modes
├── app.js              # UI logic, autocomplete, trainer lookup, candidate filtering
├── styles.css          # Dark theme styling and responsive design
├── logic.js            # Search filtering, trainer matching engine
├── pokemon_data.js     # Complete Pokemon dataset with stats
├── data-hgss.js        # HGSS trainer rosters and Pokemon pool
├── pokemon-sprites.js  # Sprite URL mapping to PokeAPI
└── README.md           # This file
```

## Contributing

Found a bug or have a suggestion? Feel free to DM me @ em_baby (Discord) or potatobagel (Smogon)

## Known Limitations

- Only contains Pokemon and trainers for Battle 50 onwards for Battle Castle
- HP Stat on Pokemon Cards for IV=21 is inaccurate, but is irrelevant for that search

## Frequently Asked Questions

**Q: Why does the input order change?**  
A: HGSS and Platinum use different display orders for Pokemon info. The tool matches what you see in-game.

**Q: What's the difference between IV 31 and IV 21?**  
A: IV 31 is max IVs and standard for higher rounds. Any battle past Battle 49 is associated with Round 8. However, the Battle Castle also occasionally selects a trainer from the previous round. In this case, Round 7 Trainers are associated with IV 21 and will sometimes appear.

**Q: What does the Reverse Trainer Lookup do exactly?**  
A: After confirming which Pokemon your opponent sent out in slots 1 and 2, the lookup cross-references all 158 HGSS trainer rosters to find which trainers could have both of those specific instances. It then shows what remaining Pokemon from those rosters are eligible for slot 3, excluding any that hold the same items as the Pokemon already seen.

**Q: Why are some trainers shown together (e.g. "GLEN / LYLE")?**  
A: Some trainers share identical Pokemon rosters. Since they're indistinguishable by Pokemon alone, they're collapsed into a single group — their slot 3 candidates are the same either way.

## Acknowledgments

- Pokemon sprite images from [PokeAPI](https://pokeapi.co/)
- Special thanks to the Battle Facilities Discord and Smogon

## License

This project is for educational and personal use. Pokemon and all related properties are owned by Nintendo, Game Freak, and The Pokemon Company.
