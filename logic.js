// --- CONFIGURATION ---
const ALARMS = {
    OHKO: ['Sheer Cold', 'Horn Drill', 'Fissure', 'Guillotine'],
    SETUP: ['Swords Dance', 'Dragon Dance', 'Double Team'],
    COUNTER: ['Counter', 'Mirror Coat', 'Psych Up']
};

const ALL_ALARMS = [...ALARMS.OHKO, ...ALARMS.SETUP, ...ALARMS.COUNTER];
window.ALL_ALARMS = ALL_ALARMS;

/**
 * Main Logic Class
 * Handles filtering and analysis of Pokemon sets.
 */
class BattleCastleEngine {
    constructor(pokemonData) {
        this.data = pokemonData;
    }

    /**
     * Checks if a moveset contains any "Alarm" moves.
     * @param {string[]} moves - Array of 4 moves
     * @returns {boolean}
     */
    checkAlarm(moves) {
        return moves.some(move => ALL_ALARMS.includes(move));
    }

    /**
     * Core filtering logic.
     * Matches user input against the database.
     * @param {string} ability - User input ability (e.g., "Pressure")
     * @param {string} nature - User input nature (e.g., "Jolly")
     * @param {string} item - User input item (e.g., "Brightpowder")
     * @returns {Array} - Array of matching Pokemon objects
     */
    findMatches(ability, nature, item) {
        // Normalize inputs to Title Case to match DB (e.g., "jolly" -> "Jolly")
        // But don't capitalize after apostrophes (e.g., "king's rock" -> "King's Rock" not "King'S Rock")
        const formatInput = (str) => {
            if (!str) return "";
            return str.trim().split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ');
        };

        const fAbility = formatInput(ability);
        const fNature = formatInput(nature);
        let fItem = formatInput(item);

        // Specific fix from original Python script
        if (fItem === "King's Rock" || fItem === "Kings Rock") {
            fItem = "King's Rock";
        }

        return this.data.filter(p => {
            // Filter out "0" placeholder abilities
            const validAbilities = p.abilities.filter(a => a && a !== '0');
            
            // Strict matching logic from Python script
            // (Ability1 OR Ability2) AND Nature AND Item
            const matchAbility = fAbility ? validAbilities.some(a => a === fAbility) : true;
            const matchNature = fNature ? p.nature === fNature : true;
            const matchItem = fItem ? p.item === fItem : true;

            // Return true only if we have at least one criterion and all provided criteria match
            return (fAbility || fNature || fItem) && matchAbility && matchNature && matchItem;
        });
    }

    /**
     * Aggregates matches by Species to show likelihood.
     * Equivalent to Python's "SpeciesListing".
     * @param {Array} matches - The result from findMatches
     * @returns {Array} - Sorted array of [Species, Count]
     */
    getSpeciesSummary(matches) {
        const speciesMap = {};

        matches.forEach(p => {
            if (!speciesMap[p.species]) {
                speciesMap[p.species] = 0;
            }
            // In Python script, LocalOdds is always 1, so we just increment
            speciesMap[p.species] += 1;
        });

        // Convert to array and sort by count (descending)
        return Object.entries(speciesMap)
            .sort((a, b) => b[1] - a[1]);
    }

    /**
     * Collapses trainers with identical rosters into groups.
     * @param {Array} trainers - Array of trainer objects
     * @returns {Array} - Array of group objects: { names, trainerClass, pokemon }
     */
    collapseTrainerGroups(trainers) {
        const groups = {};
        trainers.forEach(t => {
            const key = t.pokemon.slice().sort().join('|');
            if (!groups[key]) {
                groups[key] = { names: [], trainerClass: t.trainerClass, pokemon: t.pokemon };
            }
            groups[key].names.push(t.name);
        });
        return Object.values(groups);
    }

    /**
     * Finds trainer groups whose rosters contain both specified Pokemon.
     * @param {string} p1 - e.g. "LATIOS 3"
     * @param {string} p2 - e.g. "SALAMENCE 3"
     * @param {Array} trainerData - TRAINERS_HGSS or TRAINERS_PT array
     * @returns {Array} - Array of collapsed trainer groups
     */
    findTrainers(p1, p2, trainerData) {
        const matches = trainerData.filter(t =>
            t.pokemon.includes(p1) && t.pokemon.includes(p2)
        );
        return this.collapseTrainerGroups(matches);
    }

    /**
     * Gets candidate Pokemon for slot 3 from a trainer group,
     * excluding already-seen Pokemon and Pokemon holding already-seen items.
     * Uses POKEMON_DATA (castle dataset) for full card info via a pre-built lookup map.
     * @param {Array} rosterNames - trainer's pokemon array (e.g. ["LATIOS 3", ...])
     * @param {string[]} seen - already confirmed Pokemon names (e.g. ["LATIOS 3", "SALAMENCE 3"])
     * @param {string[]} seenItems - items held by confirmed Pokemon (from POKEMON_DATA)
     * @param {Object} pokemonByName - map of name -> Pokemon object built from POKEMON_DATA
     * @returns {Array} - Array of matching Pokemon objects from POKEMON_DATA
     */
    getCandidates(rosterNames, seen, seenItems, pokemonByName) {
        return rosterNames
            .filter(name => !seen.includes(name))
            .filter(name => {
                const p = pokemonByName[name];
                return p && !seenItems.includes(p.item);
            })
            .map(name => pokemonByName[name])
            .filter(Boolean);
    }
}

// Export for use in the frontend
window.BattleCastleEngine = BattleCastleEngine;
