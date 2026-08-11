document.addEventListener('DOMContentLoaded', () => {
    renderAdminLists();
});

// فائل کو ڈیٹا یو آر ایل (Base64) میں تبدیل کرنے کا فنکشن
function fileToBase64(file) {
    return new Promise((resolve) => {
        if (!file) { resolve(''); return; }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

function renderAdminLists() {
    const data = getStoredData();
    
    // Matches List
    const matchesBox = document.getElementById('adminMatchesList');
    if (matchesBox) {
        if(data.matches.length === 0) {
            matchesBox.innerHTML = "<p style='color:var(--text-muted);'>No matches found.</p>";
        } else {
            matchesBox.innerHTML = data.matches.map(m => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid rgba(255,255,255,0.1);">
                    <div>
                        <b>${m.teamA} VS ${m.teamB}</b> (${m.description})
                    </div>
                    <button onclick="deleteMatch(${m.id})" style="background:#ff3366; color:white; border:none; padding:5px 12px; border-radius:5px; cursor:pointer;">Delete</button>
                </div>
            `).join('');
        }
    }

    // Players List
    const playersBox = document.getElementById('adminPlayersList');
    if (playersBox) {
        if(data.players.length === 0) {
            playersBox.innerHTML = "<p style='color:var(--text-muted);'>No players found.</p>";
        } else {
            playersBox.innerHTML = data.players.map(p => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid rgba(255,255,255,0.1);">
                    <div>
                        <b>${p.name}</b> (${p.team} - ${p.role})
                    </div>
                    <button onclick="deletePlayer('${p.id}')" style="background:#ff3366; color:white; border:none; padding:5px 12px; border-radius:5px; cursor:pointer;">Delete</button>
                </div>
            `).join('');
        }
    }
}

// Add Match
async function addMatch(e) {
    e.preventDefault();
    const data = getStoredData();

    const mAFile = document.getElementById('mAImgFile').files[0];
    const mBFile = document.getElementById('mBImgFile').files[0];
    const bannerFile = document.getElementById('mBannerFile').files[0];

    const teamAImg = await fileToBase64(mAFile);
    const teamBImg = await fileToBase64(mBFile);
    const bannerImg = await fileToBase64(bannerFile);

    data.matches.push({
        id: Date.now(),
        teamA: document.getElementById('mA').value,
        teamB: document.getElementById('mB').value,
        teamAImgSrc: teamAImg,
        teamBImgSrc: teamBImg,
        matchBannerSrc: bannerImg,
        date: document.getElementById('mDate').value,
        venue: document.getElementById('mVenue').value,
        description: document.getElementById('mDesc').value
    });

    saveStoredData(data);
    alert("Match Added Successfully!");
    location.reload();
}

// Add Player
async function addPlayer(e) {
    e.preventDefault();
    const data = getStoredData();

    const pFile = document.getElementById('pImgFile').files[0];
    const playerImg = await fileToBase64(pFile);

    data.players.push({
        id: "p_" + Date.now(),
        name: document.getElementById('pName').value,
        team: document.getElementById('pTeam').value,
        imgSrc: playerImg,
        role: document.getElementById('pRole').value,
        runs: parseInt(document.getElementById('pRuns').value),
        ballsFaced: parseInt(document.getElementById('pBalls').value),
        wickets: parseInt(document.getElementById('pWickets').value),
        oversBowled: parseFloat(document.getElementById('pOvers').value),
        runsConceded: parseInt(document.getElementById('pRunsCon').value)
    });

    saveStoredData(data);
    alert("Player Saved Successfully!");
    location.reload();
}

function deleteMatch(id) {
    if(confirm("Delete this match?")) {
        const data = getStoredData();
        data.matches = data.matches.filter(m => m.id !== id);
        saveStoredData(data);
        renderAdminLists();
    }
}

function deletePlayer(id) {
    if(confirm("Delete this player?")) {
        const data = getStoredData();
        data.players = data.players.filter(p => p.id !== id);
        saveStoredData(data);
        renderAdminLists();
    }
}