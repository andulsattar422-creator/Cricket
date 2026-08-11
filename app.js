document.addEventListener('DOMContentLoaded', () => {
    loadMatches();
    loadPlayers();
    initCompare();
    setupAdminShortcut();
});

// Load Matches Function
function loadMatches() {
    const data = getStoredData();
    const grid = document.getElementById('matchesGrid');
    if(!grid) return;

    grid.innerHTML = ""; // پرانا گریڈ کلیئر کر رہے ہیں تاکہ ڈوپلیکیٹ نہ ہو

    if(!data.matches || data.matches.length === 0) {
        grid.innerHTML = "<p style='color:var(--text-muted); padding:20px;'>No matches added yet. Add matches from Admin Panel.</p>";
        return;
    }

    grid.innerHTML = data.matches.map(m => `
        <div class="heavy-card match-card">
            <div class="match-banner-box">
                <img src="${m.matchBannerSrc || 'POSTER.webp'}" class="match-banner-img">
            </div>
            <span style="color:var(--neon-cyan); font-size:0.85rem;"><i class="fa-solid fa-trophy"></i> ${m.description}</span>
            <div class="team-match-images">
                <div class="team-img-box">
                    <img src="${m.teamAImgSrc || '1.png'}">
                    <h4>${m.teamA}</h4>
                </div>
                <span class="vs-circle">VS</span>
                <div class="team-img-box">
                    <img src="${m.teamBImgSrc || '2.png'}">
                    <h4>${m.teamB}</h4>
                </div>
            </div>
            <p style="color:var(--text-muted); font-size:0.85rem;"><i class="fa-solid fa-location-dot"></i> ${m.venue}</p>
            <p style="color:var(--neon-green); font-size:0.85rem; margin-top:5px;"><i class="fa-regular fa-clock"></i> ${m.date}</p>
        </div>
    `).join('');
}

// Load Players Function (Fix Duplicate Issue)
function loadPlayers(customList = null) {
    const data = getStoredData();
    const players = customList || data.players;
    const grid = document.getElementById('playersGrid');
    if(!grid) return;

    grid.innerHTML = ""; // گریڈ کو خالی کر رہے ہیں تاکہ تین بار شو نہ ہو

    if(!players || players.length === 0) {
        grid.innerHTML = "<p style='color:var(--text-muted); padding:20px;'>No players added yet. Add players from Admin Panel.</p>";
        return;
    }

    // Unique Players Filter (اگر ڈیٹا میں ڈوپلیکیٹ آ جائے تو ہٹانے کے لیے)
    const uniquePlayers = Array.from(new Set(players.map(p => p.id)))
        .map(id => players.find(p => p.id === id));

    grid.innerHTML = uniquePlayers.map(p => {
        const sr = p.ballsFaced > 0 ? ((p.runs / p.ballsFaced) * 100).toFixed(2) : "0.00";
        const eco = p.oversBowled > 0 ? (p.runsConceded / p.oversBowled).toFixed(2) : "0.00";

        return `
            <div class="heavy-card">
                <div class="player-top">
                    <img src="${p.imgSrc || '1.png'}" class="student-avatar">
                    <div>
                        <h3>${p.name}</h3>
                        <p style="color:var(--neon-green); font-size:0.85rem;">${p.team} | ${p.role}</p>
                    </div>
                </div>
                <ul class="stats-table-list">
                    <li>Strike Rate (%): <span class="neon-val">${sr}%</span></li>
                    <li>Total Runs: <span class="neon-val">${p.runs}</span></li>
                    <li>Balls Faced: <span>${p.ballsFaced}</span></li>
                    <li>Wickets Taken: <span class="neon-val">${p.wickets}</span></li>
                    <li>Overs Bowled: <span>${p.oversBowled}</span></li>
                    <li>Economy Rate: <span>${eco}</span></li>
                </ul>
            </div>
        `;
    }).join('');
}

function filterData() {
    const searchInput = document.getElementById('searchInput');
    if(!searchInput) return;
    
    const query = searchInput.value.toLowerCase();
    const data = getStoredData();
    const filtered = data.players.filter(p => 
        p.name.toLowerCase().includes(query) || p.team.toLowerCase().includes(query)
    );
    loadPlayers(filtered);
}

function initCompare() {
    const data = getStoredData();
    const s1 = document.getElementById('player1Select');
    const s2 = document.getElementById('player2Select');
    if(!s1 || !s2 || !data.players || data.players.length === 0) return;

    const options = data.players.map(p => `<option value="${p.id}">${p.name} (${p.team})</option>`).join('');
    s1.innerHTML = options;
    s2.innerHTML = options;
    if(data.players.length > 1) s2.selectedIndex = 1;
    comparePlayers();
}

function comparePlayers() {
    const data = getStoredData();
    const s1 = document.getElementById('player1Select');
    const s2 = document.getElementById('player2Select');
    const display = document.getElementById('comparisonDisplay');
    
    if(!s1 || !s2 || !display) return;

    const id1 = s1.value;
    const id2 = s2.value;
    const p1 = data.players.find(p => p.id === id1);
    const p2 = data.players.find(p => p.id === id2);

    if(!p1 || !p2) return;

    const sr1 = p1.ballsFaced > 0 ? ((p1.runs / p1.ballsFaced) * 100).toFixed(2) : "0.00";
    const sr2 = p2.ballsFaced > 0 ? ((p2.runs / p2.ballsFaced) * 100).toFixed(2) : "0.00";

    display.innerHTML = `
        <div style="display:flex; justify-content:space-around; text-align:center; margin-top:15px; flex-wrap:wrap; gap:15px;">
            <div>
                <img src="${p1.imgSrc || '1.png'}" class="student-avatar">
                <h3>${p1.name}</h3>
                <p>Runs: <b class="neon-val">${p1.runs}</b> | SR: <b class="neon-val">${sr1}%</b></p>
                <p>Wickets: <b>${p1.wickets}</b></p>
            </div>
            <div>
                <img src="${p2.imgSrc || '1.png'}" class="student-avatar">
                <h3>${p2.name}</h3>
                <p>Runs: <b class="neon-val">${p2.runs}</b> | SR: <b class="neon-val">${sr2}%</b></p>
                <p>Wickets: <b>${p2.wickets}</b></p>
            </div>
        </div>
    `;
}

function openAdminSecurity() {
    const password = prompt("Enter Secret Admin Password:");
    if (password === "781781") {
        window.location.href = "admin.html";
    } else if (password !== null) {
        alert("Incorrect Password! Access Denied.");
    }
}

function setupAdminShortcut() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 's') {
            openAdminSecurity();
        }
    });
}
