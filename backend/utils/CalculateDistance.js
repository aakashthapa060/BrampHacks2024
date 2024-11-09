

const apiKey = process.env.API_KEY;

const calulateDistance = async(start,destination) => {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(start)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
    console.log(url);

    try{
        const response = await fetch(url, {
            method: 'GET'
        })
        const data = await response.json();
        console.log(data)
        // const distanceInKm = response.data.rows[0].elements[0].distance.value / 1000;
        const distanceInKm = data.rows[0].elements[0].distance.value / 1000;

        return distanceInKm;
    } catch(e) {
        console.log(e);
    }
}

module.exports = calulateDistance