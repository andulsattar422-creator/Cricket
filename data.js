// کیشے کلیئرنگ فار ورژنگ
if (!localStorage.getItem('jcl_v3_cleaned')) {
    localStorage.removeItem('cricketPortalData');
    localStorage.setItem('jcl_v3_cleaned', 'true');
}

const defaultData = {
    matches: [],
    history: [], // پرانے میچز کی ہسٹری
    players: []
};

function getStoredData() {
    const data = localStorage.getItem('cricketPortalData');
    return data ? JSON.parse(data) : defaultData;
}

function saveStoredData(data) {
    localStorage.setItem('cricketPortalData', JSON.stringify(data));
}