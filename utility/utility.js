function generateUniqueID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uniqueID = '';

    // Add a timestamp to ensure some uniqueness
    const timestamp = Date.now().toString(36);
    uniqueID += timestamp;

    while (uniqueID.length < 8) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueID += characters.charAt(randomIndex);
    }

    return uniqueID.substring(0, 8); 
}

module.exports = generateUniqueID
