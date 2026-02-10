const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const readData = (filename) => {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
};

const writeData = (filename, data) => {
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = { readData, writeData };
