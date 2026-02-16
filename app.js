// Pokemon data will be loaded from pokemon_data.js
let engine;
let selectedIV = 31; // Default to IV 31
let selectedGame = 'hgss'; // Default to HGSS

// Initialize engine once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof POKEMON_DATA !== 'undefined') {
        engine = new BattleCastleEngine(POKEMON_DATA);
        console.log('Pokemon data loaded:', POKEMON_DATA.length, 'sets');
        setupAutocomplete();
        reorderInputFields(); // Set initial order (HGSS)
    } else {
        alert('Failed to load Pokemon data. Please ensure pokemon_data.js is included.');
    }
});

// Event listeners for game version buttons
document.getElementById('hgssBtn').addEventListener('click', () => {
    selectedGame = 'hgss';
    document.getElementById('hgssBtn').classList.add('active');
    document.getElementById('ptBtn').classList.remove('active');
    reorderInputFields();
    // Re-run search if there are results displayed
    const resultsDiv = document.getElementById('results');
    if (resultsDiv.innerHTML && !resultsDiv.innerHTML.includes('no-results')) {
        performSearch();
    }
});

document.getElementById('ptBtn').addEventListener('click', () => {
    selectedGame = 'pt';
    document.getElementById('ptBtn').classList.add('active');
    document.getElementById('hgssBtn').classList.remove('active');
    reorderInputFields();
    // Re-run search if there are results displayed
    const resultsDiv = document.getElementById('results');
    if (resultsDiv.innerHTML && !resultsDiv.innerHTML.includes('no-results')) {
        performSearch();
    }
});

// Reorder input fields based on game version
function reorderInputFields() {
    const searches = [1, 2, 3];
    
    searches.forEach(num => {
        const container = document.querySelector(`.search${num > 1 ? num : ''}-inputs, .input-row:has(#ability${num})`);
        if (!container) return;
        
        const abilityGroup = container.querySelector('[data-field="ability"]');
        const natureGroup = container.querySelector('[data-field="nature"]');
        const itemGroup = container.querySelector('[data-field="item"]');
        
        if (!abilityGroup || !natureGroup || !itemGroup) return;
        
        // Remove all
        abilityGroup.remove();
        natureGroup.remove();
        itemGroup.remove();
        
        // Re-append in correct order
        if (selectedGame === 'hgss') {
            // HGSS: Ability - Nature - Item
            container.appendChild(abilityGroup);
            container.appendChild(natureGroup);
            container.appendChild(itemGroup);
        } else {
            // Pt: Item - Nature - Ability
            container.appendChild(itemGroup);
            container.appendChild(natureGroup);
            container.appendChild(abilityGroup);
        }
    });
}

// Setup custom autocomplete
let autocompleteData = {
    items: [],
    natures: [],
    abilities: [],
    pokemon: []
};

function setupAutocomplete() {
    const itemsSet = new Set();
    const naturesSet = new Set();
    const abilitiesSet = new Set();
    const pokemonSet = new Set();

    engine.data.forEach(p => {
        if (p.item) itemsSet.add(p.item);
        if (p.nature) naturesSet.add(p.nature);
        p.abilities.forEach(a => {
            if (a && a !== '0') abilitiesSet.add(a);
        });
        if (p.species) {
            // Fix Mr. Mime in autocomplete
            const species = p.species === 'Mrmime' ? 'Mr. Mime' : p.species;
            pokemonSet.add(species);
        }
    });

    autocompleteData.items = [...itemsSet].sort();
    autocompleteData.natures = [...naturesSet].sort();
    autocompleteData.abilities = [...abilitiesSet].sort();
    autocompleteData.pokemon = [...pokemonSet].sort();

    // Attach autocomplete to all relevant inputs
    attachAutocomplete('item1', 'items');
    attachAutocomplete('item2', 'items');
    attachAutocomplete('item3', 'items');
    attachAutocomplete('nature1', 'natures');
    attachAutocomplete('nature2', 'natures');
    attachAutocomplete('nature3', 'natures');
    attachAutocomplete('ability1', 'abilities');
    attachAutocomplete('ability2', 'abilities');
    attachAutocomplete('ability3', 'abilities');
    attachAutocomplete('pokemon2', 'pokemon');
    attachAutocomplete('pokemon3', 'pokemon');
}

function attachAutocomplete(inputId, dataType) {
    const input = document.getElementById(inputId);
    const parent = input.parentElement;
    
    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    dropdown.style.display = 'none';
    parent.appendChild(dropdown);

    input.addEventListener('input', () => {
        const value = input.value.toLowerCase();
        if (!value) {
            dropdown.style.display = 'none';
            return;
        }

        const matches = autocompleteData[dataType].filter(item => 
            item.toLowerCase().includes(value)
        ).slice(0, 10); // Limit to 10 results

        if (matches.length === 0) {
            dropdown.style.display = 'none';
            return;
        }

        dropdown.innerHTML = matches.map(item => 
            `<div class="autocomplete-item">${item}</div>`
        ).join('');

        dropdown.style.display = 'block';

        // Add click handlers to items
        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                input.value = item.textContent;
                dropdown.style.display = 'none';
            });
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!parent.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });

    // Handle keyboard navigation
    input.addEventListener('keydown', (e) => {
        const items = dropdown.querySelectorAll('.autocomplete-item');
        if (items.length === 0) return;

        const activeItem = dropdown.querySelector('.autocomplete-item.active');
        let currentIndex = activeItem ? Array.from(items).indexOf(activeItem) : -1;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = Math.min(currentIndex + 1, items.length - 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = Math.max(currentIndex - 1, 0);
        } else if (e.key === 'Enter' && currentIndex >= 0) {
            e.preventDefault();
            input.value = items[currentIndex].textContent;
            dropdown.style.display = 'none';
            return;
        } else if (e.key === 'Escape') {
            dropdown.style.display = 'none';
            return;
        }

        items.forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });

        if (items[currentIndex]) {
            items[currentIndex].scrollIntoView({ block: 'nearest' });
        }
    });
}

// Event listeners for IV buttons
document.getElementById('iv31Btn').addEventListener('click', () => {
    selectedIV = 31;
    document.getElementById('iv31Btn').classList.add('active');
    document.getElementById('iv21Btn').classList.remove('active');
    toggleSearchInputs();
    // Re-run search if there are results displayed
    const resultsDiv = document.getElementById('results');
    if (resultsDiv.innerHTML && !resultsDiv.innerHTML.includes('no-results')) {
        performSearch();
    }
});

document.getElementById('iv21Btn').addEventListener('click', () => {
    selectedIV = 21;
    document.getElementById('iv21Btn').classList.add('active');
    document.getElementById('iv31Btn').classList.remove('active');
    toggleSearchInputs();
    // Re-run search if there are results displayed
    const resultsDiv = document.getElementById('results');
    if (resultsDiv.innerHTML && !resultsDiv.innerHTML.includes('no-results')) {
        performSearch();
    }
});

// Toggle between normal inputs and pokemon-only inputs for Search 2 & 3
function toggleSearchInputs() {
    if (selectedIV === 21) {
        // Hide ability/nature/item, show pokemon input
        document.querySelector('.search2-inputs').style.display = 'none';
        document.querySelector('.search2-pokemon').style.display = 'flex';
        document.querySelector('.search3-inputs').style.display = 'none';
        document.querySelector('.search3-pokemon').style.display = 'flex';
    } else {
        // Show ability/nature/item, hide pokemon input
        document.querySelector('.search2-inputs').style.display = 'flex';
        document.querySelector('.search2-pokemon').style.display = 'none';
        document.querySelector('.search3-inputs').style.display = 'flex';
        document.querySelector('.search3-pokemon').style.display = 'none';
    }
}

// Event listeners
document.getElementById('searchBtn').addEventListener('click', performSearch);
document.getElementById('clearBtn').addEventListener('click', clearSearch);

// Allow Enter key to trigger search
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
});

function performSearch() {
    if (!engine) {
        alert('Pokemon data not loaded yet. Please wait a moment and try again.');
        return;
    }

    const searches = [];
    
    if (selectedIV === 31) {
        // Normal mode: all 3 searches use ability/nature/item
        for (let i = 1; i <= 3; i++) {
            const ability = document.getElementById(`ability${i}`).value.trim();
            const nature = document.getElementById(`nature${i}`).value.trim();
            const item = document.getElementById(`item${i}`).value.trim();
            
            if (ability || nature || item) {
                searches.push({
                    number: i,
                    type: 'normal',
                    ability,
                    nature,
                    item
                });
            }
        }
    } else {
        // IV 21 mode: Search 1 uses ability/nature/item, Search 2 & 3 use pokemon name
        // Search 1
        const ability1 = document.getElementById('ability1').value.trim();
        const nature1 = document.getElementById('nature1').value.trim();
        const item1 = document.getElementById('item1').value.trim();
        
        if (ability1 || nature1 || item1) {
            searches.push({
                number: 1,
                type: 'normal',
                ability: ability1,
                nature: nature1,
                item: item1
            });
        }
        
        // Search 2
        const pokemon2 = document.getElementById('pokemon2').value.trim();
        if (pokemon2) {
            searches.push({
                number: 2,
                type: 'pokemon',
                pokemon: pokemon2
            });
        }
        
        // Search 3
        const pokemon3 = document.getElementById('pokemon3').value.trim();
        if (pokemon3) {
            searches.push({
                number: 3,
                type: 'pokemon',
                pokemon: pokemon3
            });
        }
    }

    if (searches.length === 0) {
        alert('Please enter at least one search criteria.');
        return;
    }

    // Perform all searches
    const allResults = searches.map(search => {
        let matches, speciesSummary;
        
        if (search.type === 'pokemon') {
            // Pokemon-only search: find instance 4
            matches = engine.data.filter(p => {
                const matchSpecies = p.species.toLowerCase() === search.pokemon.toLowerCase();
                const matchInstance = p.instance === 4;
                return matchSpecies && matchInstance;
            });
            speciesSummary = engine.getSpeciesSummary(matches);
        } else {
            // Normal search
            matches = engine.findMatches(search.ability, search.nature, search.item);
            speciesSummary = engine.getSpeciesSummary(matches);
        }
        
        return {
            searchNumber: search.number,
            criteria: search,
            matches,
            speciesSummary
        };
    });

    displayResults(allResults);
}

function clearSearch() {
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`ability${i}`).value = '';
        document.getElementById(`nature${i}`).value = '';
        document.getElementById(`item${i}`).value = '';
    }
    document.getElementById('pokemon2').value = '';
    document.getElementById('pokemon3').value = '';
    document.getElementById('results').innerHTML = '';
}

function displayResults(allResults) {
    const resultsDiv = document.getElementById('results');
    
    // Check if any search had results
    const hasResults = allResults.some(r => r.matches.length > 0);
    
    if (!hasResults) {
        resultsDiv.innerHTML = '<p class="no-results">No matching Pokemon found in any search.</p>';
        return;
    }

    let html = '';

    // Display results for each search separately
    allResults.forEach((result, index) => {
        if (result.matches.length === 0) {
            return; // Skip searches with no results
        }

        // Search header
        html += `<div class="search-results-section">`;
        html += `<h2>Search ${result.searchNumber} Results:</h2>`;
        html += `<div class="search-criteria">`;
        if (result.criteria.type === 'pokemon') {
            html += `<span>Pokemon: ${result.criteria.pokemon}</span>`;
        } else {
            if (result.criteria.ability) html += `<span>Ability: ${result.criteria.ability}</span>`;
            if (result.criteria.nature) html += `<span>Nature: ${result.criteria.nature}</span>`;
            if (result.criteria.item) html += `<span>Item: ${result.criteria.item}</span>`;
        }
        html += `</div>`;
        html += '<div class="pokemon-list">';

        // Display ALL matches (not just species summary)
        result.matches.forEach(pokemon => {
            // Fix Mr. Mime spelling
            const displaySpecies = pokemon.species === 'Mrmime' ? 'Mr. Mime' : pokemon.species;
            const spriteUrl = getPokemonSpriteUrl(pokemon.species);
            // Get the appropriate speed stat based on IV selection
            const speedStat = selectedIV === 31 ? pokemon.stats.speed : pokemon.stats.speed_21;
            
            html += `
                <div class="pokemon-row">
                    <div class="pokemon-image">
                        ${spriteUrl 
                            ? `<img src="${spriteUrl}" alt="${displaySpecies}" class="pokemon-sprite">` 
                            : `<div class="image-placeholder">?</div>`
                        }
                    </div>
                    <div class="pokemon-info">
                        <div class="pokemon-header">
                            <span class="pokemon-name">${displaySpecies}</span>
                            <span class="pokemon-count">${pokemon.instance}</span>
                        </div>
                        <div class="pokemon-details">
                            <div class="detail-item">
                                <span class="detail-label">Ability:</span>
                                <span class="detail-value">${pokemon.abilities.filter(a => a && a !== '0').join(' / ')}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Nature:</span>
                                <span class="detail-value">${pokemon.nature}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Item:</span>
                                <span class="detail-value">${pokemon.item}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Speed:</span>
                                <span class="detail-value">${speedStat}</span>
                            </div>
                            <div class="detail-item moves">
                                <span class="detail-label">Moves:</span>
                                <div class="moves-list">
                                    ${pokemon.moves.map(move => `<span class="move">${move}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div></div>'; // Close pokemon-list and search-results-section
    });

    resultsDiv.innerHTML = html;
}
