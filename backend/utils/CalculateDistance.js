

const apiKey = process.env.API_KEY;


const calculateDistance = async (start, destination) => {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(start)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
    console.log("Distance Matrix API URL:", url);

    try {
        const response = await fetch(url, { method: 'GET' });
        const data = await response.json();
        console.log("Distance Matrix API Response:", data);

        if (data.rows && data.rows[0] && data.rows[0].elements && data.rows[0].elements[0].distance) {
            const distanceInKm = data.rows[0].elements[0].distance.value / 1000;
            console.log("Calculated Distance in Km:", distanceInKm);
            return distanceInKm;
        } else {
            console.error("Distance data not found in API response.");
            return null; // Return null if distance data is unavailable
        }
    } catch (e) {
        console.error("Error fetching distance:", e);
        return null; // Return null on error
    }
};



module.exports = calculateDistance