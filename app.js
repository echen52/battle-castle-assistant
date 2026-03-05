// Pokemon data will be loaded from pokemon_data.js
let engine;
let selectedIV = 31;
let selectedGame = 'hgss';

// Trainer lookup state (IV=31 only)
let selectedPokemon = { 1: null, 2: null };
let trainerLookupActive = false;

// Initialize engine once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof POKEMON_DATA !== 'undefined') {
        engine = new BattleCastleEngine(POKEMON_DATA);
        console.log('Pokemon data loaded:', POKEMON_DATA.length, 'sets');
        setupAutocomplete();
        reorderInputFields();
    } else {
        alert('Failed to load Pokemon data. Please ensure pokemon_data.js is included.');
    }

    document.getElementById('find-trainers-btn').addEventListener('click', performTrainerLookup);
});

// Event listeners for game version buttons
document.getElementById('hgssBtn').addEventListener('click', () => {
    selectedGame = 'hgss';
    document.getElementById('hgssBtn').classList.add('active');
    document.getElementById('ptBtn').classList.remove('active');
    reorderInputFields();
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
    const resultsDiv = document.getElementById('results');
    if (resultsDiv.innerHTML && !resultsDiv.innerHTML.includes('no-results')) {
        performSearch();
    }
});

function reorderInputFields() {
    const searches = [1, 2, 3];
    searches.forEach(num => {
        const container = document.querySelector('.search' + (num > 1 ? num : '') + '-inputs, .input-row:has(#ability' + num + ')');
        if (!container) return;
        const abilityGroup = container.querySelector('[data-field="ability"]');
        const natureGroup = container.querySelector('[data-field="nature"]');
        const itemGroup = container.querySelector('[data-field="item"]');
        if (!abilityGroup || !natureGroup || !itemGroup) return;
        abilityGroup.remove();
        natureGroup.remove();
        itemGroup.remove();
        if (selectedGame === 'hgss') {
            container.appendChild(abilityGroup);
            container.appendChild(natureGroup);
            container.appendChild(itemGroup);
        } else {
            container.appendChild(itemGroup);
            container.appendChild(natureGroup);
            container.appendChild(abilityGroup);
        }
    });
}

let autocompleteData = { items: [], natures: [], abilities: [], pokemon: [] };

function setupAutocomplete() {
    const itemsSet = new Set();
    const naturesSet = new Set();
    const abilitiesSet = new Set();
    const pokemonSet = new Set();

    engine.data.forEach(p => {
        if (p.item) itemsSet.add(p.item);
        if (p.nature) naturesSet.add(p.nature);
        p.abilities.forEach(a => { if (a && a !== '0') abilitiesSet.add(a); });
        if (p.species) {
            const species = p.species === 'Mrmime' ? 'Mr. Mime' : p.species;
            pokemonSet.add(species);
        }
    });

    autocompleteData.items = [...itemsSet].sort();
    autocompleteData.natures = [...naturesSet].sort();
    autocompleteData.abilities = [...abilitiesSet].sort();
    autocompleteData.pokemon = [...pokemonSet].sort();

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
    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    dropdown.style.display = 'none';
    parent.appendChild(dropdown);

    input.addEventListener('input', () => {
        const value = input.value.toLowerCase();
        if (!value) { dropdown.style.display = 'none'; return; }
        const matches = autocompleteData[dataType].filter(item => item.toLowerCase().includes(value)).slice(0, 10);
        if (matches.length === 0) { dropdown.style.display = 'none'; return; }
        dropdown.innerHTML = matches.map(item => '<div class="autocomplete-item">' + item + '</div>').join('');
        dropdown.style.display = 'block';
        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                input.value = item.textContent;
                dropdown.style.display = 'none';
            });
        });
    });

    document.addEventListener('click', (e) => {
        if (!parent.contains(e.target)) dropdown.style.display = 'none';
    });

    input.addEventListener('keydown', (e) => {
        const items = dropdown.querySelectorAll('.autocomplete-item');
        if (items.length === 0) return;
        const activeItem = dropdown.querySelector('.autocomplete-item.active');
        let currentIndex = activeItem ? Array.from(items).indexOf(activeItem) : -1;
        if (e.key === 'ArrowDown') { e.preventDefault(); currentIndex = Math.min(currentIndex + 1, items.length - 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); currentIndex = Math.max(currentIndex - 1, 0); }
        else if (e.key === 'Enter' && currentIndex >= 0) { e.preventDefault(); input.value = items[currentIndex].textContent; dropdown.style.display = 'none'; return; }
        else if (e.key === 'Escape') { dropdown.style.display = 'none'; return; }
        items.forEach((item, index) => item.classList.toggle('active', index === currentIndex));
        if (items[currentIndex]) items[currentIndex].scrollIntoView({ block: 'nearest' });
    });
}

document.getElementById('iv31Btn').addEventListener('click', () => {
    selectedIV = 31;
    document.getElementById('iv31Btn').classList.add('active');
    document.getElementById('iv21Btn').classList.remove('active');
    toggleSearchInputs();
    const resultsDiv = document.getElementById('results');
    if (resultsDiv.innerHTML && !resultsDiv.innerHTML.includes('no-results')) performSearch();
});

document.getElementById('iv21Btn').addEventListener('click', () => {
    selectedIV = 21;
    document.getElementById('iv21Btn').classList.add('active');
    document.getElementById('iv31Btn').classList.remove('active');
    toggleSearchInputs();
    const resultsDiv = document.getElementById('results');
    if (resultsDiv.innerHTML && !resultsDiv.innerHTML.includes('no-results')) performSearch();
});

function toggleSearchInputs() {
    if (selectedIV === 21) {
        document.querySelector('.search2-inputs').style.display = 'none';
        document.querySelector('.search2-pokemon').style.display = 'flex';
        document.querySelector('.search3-inputs').style.display = 'none';
        document.querySelector('.search3-pokemon').style.display = 'flex';
    } else {
        document.querySelector('.search2-inputs').style.display = 'flex';
        document.querySelector('.search2-pokemon').style.display = 'none';
        document.querySelector('.search3-inputs').style.display = 'flex';
        document.querySelector('.search3-pokemon').style.display = 'none';
    }
}

document.getElementById('searchBtn').addEventListener('click', performSearch);
document.getElementById('clearBtn').addEventListener('click', clearSearch);

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
});

function performSearch() {
    if (!engine) { alert('Pokemon data not loaded yet. Please wait a moment and try again.'); return; }

    const searches = [];

    if (selectedIV === 31) {
        for (let i = 1; i <= 3; i++) {
            const ability = document.getElementById('ability' + i).value.trim();
            const nature = document.getElementById('nature' + i).value.trim();
            const item = document.getElementById('item' + i).value.trim();
            if (ability || nature || item) {
                searches.push({ number: i, type: 'normal', ability, nature, item });
            }
        }
    } else {
        const ability1 = document.getElementById('ability1').value.trim();
        const nature1 = document.getElementById('nature1').value.trim();
        const item1 = document.getElementById('item1').value.trim();
        if (ability1 || nature1 || item1) {
            searches.push({ number: 1, type: 'normal', ability: ability1, nature: nature1, item: item1 });
        }
        const pokemon2 = document.getElementById('pokemon2').value.trim();
        if (pokemon2) searches.push({ number: 2, type: 'pokemon', pokemon: pokemon2 });
        const pokemon3 = document.getElementById('pokemon3').value.trim();
        if (pokemon3) searches.push({ number: 3, type: 'pokemon', pokemon: pokemon3 });
    }

    if (searches.length === 0) { alert('Please enter at least one search criteria.'); return; }

    const allResults = searches.map(search => {
        let matches;
        if (search.type === 'pokemon') {
            matches = engine.data.filter(p => p.species.toLowerCase() === search.pokemon.toLowerCase() && p.instance === 4);
        } else {
            matches = engine.findMatches(search.ability, search.nature, search.item);
        }
        return { searchNumber: search.number, criteria: search, matches, speciesSummary: engine.getSpeciesSummary(matches) };
    });

    displayResults(allResults);
}

function clearSearch() {
    for (let i = 1; i <= 3; i++) {
        document.getElementById('ability' + i).value = '';
        document.getElementById('nature' + i).value = '';
        document.getElementById('item' + i).value = '';
    }
    document.getElementById('pokemon2').value = '';
    document.getElementById('pokemon3').value = '';
    document.getElementById('results').innerHTML = '';
    var s3 = document.getElementById('search3-result-section');
    if (s3) s3.remove();
    selectedPokemon = { 1: null, 2: null };
    trainerLookupActive = false;
    const trainerSection = document.getElementById('trainer-lookup-section');
    if (trainerSection) trainerSection.style.display = 'none';
    document.querySelector('.search3-inputs').style.display = selectedIV === 21 ? 'none' : 'flex';
    document.querySelector('.search3-pokemon').style.display = selectedIV === 21 ? 'flex' : 'none';
    updateFindTrainersButton();
}

// ---- Trainer Lookup ----

function selectPokemon(searchNumber, pokemonName) {
    selectedPokemon[searchNumber] = pokemonName;
    document.querySelectorAll('.select-btn[data-search="' + searchNumber + '"]').forEach(btn => {
        var isSelected = btn.dataset.pokemon === pokemonName;
        btn.textContent = isSelected ? '✓ Selected' : 'Select';
        btn.classList.toggle('selected', isSelected);
    });
    updateFindTrainersButton();
    if (searchNumber === 3) {
        displaySearch3Result(pokemonName);
    }
}

function displaySearch3Result(pokemonName) {
    var pokemon = null;
    for (var i = 0; i < POKEMON_DATA.length; i++) {
        if (POKEMON_DATA[i].name === pokemonName) { pokemon = POKEMON_DATA[i]; break; }
    }
    if (!pokemon) return;

    var existing = document.getElementById('search3-result-section');
    if (existing) existing.remove();

    var section = document.createElement('div');
    section.id = 'search3-result-section';
    section.className = 'search-results-section';
    section.innerHTML =
        '<h2>Search 3 Results:</h2>' +
        '<div class="search-criteria"><span>Pokemon: ' + (pokemon.species === 'Mrmime' ? 'Mr. Mime' : pokemon.species) + ' ' + pokemon.instance + '</span></div>' +
        '<div class="pokemon-list">' + renderPokemonCard(pokemon, 3, false) + '</div>';

    document.getElementById('results').appendChild(section);
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateFindTrainersButton() {
    var btn = document.getElementById('find-trainers-btn');
    if (!btn) return;
    var bothSelected = selectedPokemon[1] && selectedPokemon[2];
    btn.style.display = (selectedIV === 31 && bothSelected) ? 'inline-block' : 'none';
}

function getTrainerData() {
    return selectedGame === 'hgss' ? window.TRAINERS_HGSS : (window.TRAINERS_PT || window.TRAINERS_HGSS);
}

function performTrainerLookup() {
    var p1 = selectedPokemon[1];
    var p2 = selectedPokemon[2];
    if (!p1 || !p2) return;

    var trainerData = getTrainerData();
    var pokemonByName = {};
    POKEMON_DATA.forEach(function(p) { pokemonByName[p.name] = p; });

    var groups = engine.findTrainers(p1, p2, trainerData);

    trainerLookupActive = true;
    document.querySelector('.search3-inputs').style.display = 'none';
    document.querySelector('.search3-pokemon').style.display = 'none';

    var section = document.getElementById('trainer-lookup-section');
    section.style.display = 'block';

    var seenItems = [p1, p2].map(function(n) { return pokemonByName[n] ? pokemonByName[n].item : null; }).filter(Boolean);

    var html = '<div class="trainer-lookup">';
    html += '<div class="trainer-lookup-header">';
    html += '<h2>Trainer Lookup</h2>';
    html += '<button id="undo-trainer-btn">Undo Trainer Search</button>';
    html += '</div>';

    if (groups.length === 0) {
        html += '<p class="no-results">No trainers found with both ' + formatPokemonName(p1) + ' and ' + formatPokemonName(p2) + '.</p>';
    } else {
        html += '<p class="lookup-subtitle">Found <strong>' + groups.length + '</strong> trainer group' + (groups.length > 1 ? 's' : '') + ' with ' + formatPokemonName(p1) + ' + ' + formatPokemonName(p2) + '</p>';
        var autoExpand = groups.length === 1;
        groups.forEach(function(group, i) {
            html += renderTrainerGroup(group, p1, p2, seenItems, pokemonByName, autoExpand, i);
        });
    }

    html += '</div>';
    section.innerHTML = html;

    section.querySelectorAll('.trainer-group-header:not(.auto-expanded)').forEach(function(header) {
        header.addEventListener('click', function() {
            var candidates = header.nextElementSibling;
            var isOpen = candidates.style.display !== 'none';
            candidates.style.display = isOpen ? 'none' : 'block';
            header.querySelector('.toggle-arrow').textContent = isOpen ? '▶' : '▼';
        });
    });

    attachCandidateFilters(section);

    section.querySelectorAll('.select-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            selectPokemon(parseInt(btn.dataset.search), btn.dataset.pokemon);
        });
    });

    document.getElementById('undo-trainer-btn').addEventListener('click', undoTrainerSearch);
}

function undoTrainerSearch() {
    trainerLookupActive = false;
    var section = document.getElementById('trainer-lookup-section');
    section.style.display = 'none';
    section.innerHTML = '';
    var s3result = document.getElementById('search3-result-section');
    if (s3result) s3result.remove();
    selectedPokemon[3] = null;
    document.querySelector('.search3-inputs').style.display = selectedIV === 21 ? 'none' : 'flex';
    document.querySelector('.search3-pokemon').style.display = selectedIV === 21 ? 'flex' : 'none';
}

function renderTrainerGroup(group, p1, p2, seenItems, pokemonByName, autoExpand, index) {
    var displayNames = group.names.join(' / ');
    var candidates = engine.getCandidates(group.pokemon, [p1, p2], seenItems, pokemonByName);
    var candidateCount = candidates.length;
    var groupId = 'group-' + index;

    var html = '<div class="trainer-group" id="' + groupId + '">';

    if (!autoExpand) {
        html += '<div class="trainer-group-header">';
        html += '<span class="toggle-arrow">&#9658;</span>';
        html += '<span class="trainer-names">' + displayNames + '</span>';
        html += '<span class="trainer-class">' + group.trainerClass + '</span>';
        html += '<span class="candidate-count">' + candidateCount + ' candidates</span>';
        html += '</div>';
        html += '<div class="trainer-candidates" style="display:none">';
    } else {
        html += '<div class="trainer-group-header auto-expanded">';
        html += '<span class="trainer-names">' + displayNames + '</span>';
        html += '<span class="trainer-class">' + group.trainerClass + '</span>';
        html += '</div>';
        html += '<div class="trainer-candidates">';
    }

    if (candidates.length === 0) {
        html += '<p class="no-results">No candidates remain after item filtering.</p>';
    } else {
        html += '<div class="candidate-filter-row">';
        html += '<input type="text" class="candidate-filter" data-group="' + groupId + '" placeholder="Filter by name..." autocomplete="off">';
        html += '<input type="number" class="candidate-filter-hp" data-group="' + groupId + '" placeholder="HP..." min="1">';
        html += '<span class="candidate-filter-count">' + candidateCount + ' candidates</span>';
        html += '</div>';
        html += '<div class="pokemon-list" id="' + groupId + '-list">';
        candidates.forEach(function(pokemon) {
            var species = pokemon.species === 'Mrmime' ? 'Mr. Mime' : pokemon.species;
            html += '<div class="candidate-card" data-species="' + species.toLowerCase() + '" data-hp="' + pokemon.stats.hp + '">';
            html += renderPokemonCard(pokemon, 3, true);
            html += '</div>';
        });
        html += '</div>';
    }

    html += '</div></div>';
    return html;
}

function attachCandidateFilters(section) {
    section.querySelectorAll('.candidate-filter, .candidate-filter-hp').forEach(function(input) {
        input.addEventListener('input', function() {
            var groupId = input.dataset.group;
            var list = document.getElementById(groupId + '-list');
            var countEl = list.previousElementSibling.querySelector('.candidate-filter-count');
            var nameQuery = list.previousElementSibling.querySelector('.candidate-filter').value.toLowerCase().trim();
            var hpQuery = list.previousElementSibling.querySelector('.candidate-filter-hp').value.trim();
            var cards = list.querySelectorAll('.candidate-card');
            var visible = 0;
            cards.forEach(function(card) {
                var nameMatch = !nameQuery || card.dataset.species.includes(nameQuery);
                var hpMatch = !hpQuery || card.dataset.hp === hpQuery;
                var show = nameMatch && hpMatch;
                card.style.display = show ? '' : 'none';
                if (show) visible++;
            });
            countEl.textContent = visible + ' candidate' + (visible !== 1 ? 's' : '');
        });
    });
}

function formatPokemonName(nameStr) {
    return nameStr.split(' ').map(function(w, i) {
        if (i === 0) return w === 'MRMIME' ? 'Mr. Mime' : w.charAt(0) + w.slice(1).toLowerCase();
        return w;
    }).join(' ');
}

function renderPokemonCard(pokemon, searchNumber, showSelectBtn) {
    var displaySpecies = pokemon.species === 'Mrmime' ? 'Mr. Mime' : pokemon.species;
    var spriteUrl = getPokemonSpriteUrl(pokemon.species);
    var speedStat = selectedIV === 31 ? pokemon.stats.speed : pokemon.stats.speed_21;
    var pokemonKey = pokemon.name;
    var alarmMoves = pokemon.moves ? pokemon.moves.filter(function(m) { return ALL_ALARMS.includes(m); }) : [];
    var alarmHtml = alarmMoves.length > 0 ? '<div class="alarm-badge">&#9888; ' + alarmMoves.join(', ') + '</div>' : '';
    var abilitiesDisplay = pokemon.abilities ? pokemon.abilities.filter(function(a) { return a && a !== '0'; }).join(' / ') : '';
    var selectHtml = showSelectBtn ? '<button class="select-btn" data-search="' + searchNumber + '" data-pokemon="' + pokemonKey + '">Select</button>' : '';
    var abilityHtml = abilitiesDisplay ? '<div class="detail-item"><span class="detail-label">Ability:</span><span class="detail-value">' + abilitiesDisplay + '</span></div>' : '';
    var imageHtml = spriteUrl ? '<img src="' + spriteUrl + '" alt="' + displaySpecies + '" class="pokemon-sprite">' : '<div class="image-placeholder">?</div>';
    var movesHtml = pokemon.moves ? pokemon.moves.map(function(move) { return '<span class="move">' + move + '</span>'; }).join('') : '';

    return '<div class="pokemon-row">' +
        '<div class="pokemon-image">' + imageHtml + '</div>' +
        '<div class="pokemon-info">' +
            '<div class="pokemon-header">' +
                '<span class="pokemon-name">' + displaySpecies + '</span>' +
                '<span class="pokemon-count">' + pokemon.instance + '</span>' +
                selectHtml +
            '</div>' +
            alarmHtml +
            '<div class="pokemon-details">' +
                abilityHtml +
                '<div class="detail-item"><span class="detail-label">Nature:</span><span class="detail-value">' + pokemon.nature + '</span></div>' +
                '<div class="detail-item"><span class="detail-label">Item:</span><span class="detail-value">' + pokemon.item + '</span></div>' +
                '<div class="detail-item"><span class="detail-label">HP:</span><span class="detail-value">' + pokemon.stats.hp + '</span></div>' +
                '<div class="detail-item"><span class="detail-label">Speed:</span><span class="detail-value">' + speedStat + '</span></div>' +
                '<div class="detail-item moves"><span class="detail-label">Moves:</span><div class="moves-list">' + movesHtml + '</div></div>' +
            '</div>' +
        '</div>' +
    '</div>';
}

function displayResults(allResults) {
    var resultsDiv = document.getElementById('results');
    var hasResults = allResults.some(function(r) { return r.matches.length > 0; });

    if (!hasResults) {
        resultsDiv.innerHTML = '<p class="no-results">No matching Pokemon found in any search.</p>';
        return;
    }

    var html = '';

    allResults.forEach(function(result) {
        if (result.matches.length === 0) return;

        var showSelect = selectedIV === 31 && (result.searchNumber === 1 || result.searchNumber === 2);

        html += '<div class="search-results-section">';
        html += '<h2>Search ' + result.searchNumber + ' Results:</h2>';
        html += '<div class="search-criteria">';
        if (result.criteria.type === 'pokemon') {
            html += '<span>Pokemon: ' + result.criteria.pokemon + '</span>';
        } else {
            if (result.criteria.ability) html += '<span>Ability: ' + result.criteria.ability + '</span>';
            if (result.criteria.nature) html += '<span>Nature: ' + result.criteria.nature + '</span>';
            if (result.criteria.item) html += '<span>Item: ' + result.criteria.item + '</span>';
        }
        html += '</div>';
        html += '<div class="pokemon-list">';

        result.matches.forEach(function(pokemon) {
            html += renderPokemonCard(pokemon, result.searchNumber, showSelect);
        });

        html += '</div></div>';
    });

    resultsDiv.innerHTML = html;

    resultsDiv.querySelectorAll('.select-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            selectPokemon(parseInt(btn.dataset.search), btn.dataset.pokemon);
        });
    });

    updateFindTrainersButton();
}
