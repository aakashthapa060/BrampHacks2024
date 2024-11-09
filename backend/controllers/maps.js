const calculateDistance = require("../utils/CalculateDistance");
const emissions = {
    bus: 0.05,
    car: 0.2,
    walk: 0,
    bike: 0
  };
  
const calculate_distance = async(req,res) => {
    const {start,destination,mode} = req.body;
    let suggestion = "For short trips, consider walking or biking to reduce your carbon footprint.";

    const distance = await calculateDistance(start,destination,mode);
    const footprint = distance * emissions[mode];

    if(distance < 3){
        res.json({suggestion, footprint})
    }

    res.json(footprint)
}

module.exports = {
    calculate_distance
}