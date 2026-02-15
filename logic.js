// --- CONFIGURATION ---
const ALARMS = {
    OHKO: ['Sheer Cold', 'Horn Drill', 'Fissure', 'Guillotine'],
    SETUP: ['Swords Dance', 'Dragon Dance', 'Double Team'],
    COUNTER: ['Counter', 'Mirror Coat', 'Psych Up']
};

const ALL_ALARMS = [...ALARMS.OHKO, ...ALARMS.SETUP, ...ALARMS.COUNTER];

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
        const formatInput = (str) => str ? str.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : "";

        const fAbility = formatInput(ability);
        const fNature = formatInput(nature);
        let fItem = formatInput(item);

        // Specific fix from original Python script
        if (fItem === "King's Rock" || fItem === "Kings Rock") {
            fItem = "King's Rock";
        }

        return this.data.filter(p => {
            // Strict matching logic from Python script
            // (Ability1 OR Ability2) AND Nature AND Item
            const matchAbility = (p.abilities[0] === fAbility || p.abilities[1] === fAbility);
            const matchNature = p.nature === fNature;
            const matchItem = p.item === fItem;

            return matchAbility && matchNature && matchItem;
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
}

// Export for use in the frontend
window.BattleCastleEngine = BattleCastleEngine;
