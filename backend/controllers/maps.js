const calculateDistance = require("../utils/CalculateDistance");

const emissionFactors = {
    bus: 0.05,  // Emissions per km in kg CO2
    car: 0.2,   // Emissions per km in kg CO2
    walk: 0,    // Walking emits no CO2
    bike: 0.02  // Cycling emits 0.02 kg CO2 per km
};

// Backend Route to calculate footprint
const calculate_footprint = async (req, res) => {
    const { start, destination, method } = req.body;
  
    // Log input data
    console.log("Start:", start, "Destination:", destination, "Method:", method);
  
    // Ensure the coordinates and method are valid and not empty
    if (!start || !destination || !method) {
      return res.status(400).json({ message: "Missing required data" });
    }
  
    try {
      const distance = await calculateDistance(start, destination);
      
      // Log calculated distance
      console.log("Calculated Distance:", distance);
      
      if (distance === null) {
        return res.status(500).json({ message: "Error calculating distance" });
      }
  
      const emissionFactor = emissionFactors[method];
      if (!emissionFactor) {
        return res.status(400).json({ message: "Invalid transportation method" });
      }
  
      const footprint = (distance * emissionFactor).toFixed(2);
  
      // Suggestion logic based on the distance and method chosen
      let suggestion = '';
      if (method === 'car') {
        if (distance < 5) {
          suggestion = 'Consider taking a bus, bike, or walking for short trips to reduce your carbon footprint!';
        } else if (distance >= 5 && distance < 15) {
          suggestion = 'Consider taking the bus or cycling to reduce your carbon footprint!';
        } else if (distance >= 15 && distance < 50) {
          suggestion = 'For medium distances, carpooling or taking public transportation can be more eco-friendly.';
        } else {
          suggestion = 'For long distances, consider public transportation or more fuel-efficient vehicle options.';
        }
      } else if (method === 'bus') {
        if (distance < 5) {
          suggestion = 'Consider walking or cycling for short trips to reduce your carbon footprint!';
        } else if (distance >= 5 && distance < 50) {
          suggestion = 'Taking the bus is a great choice for medium distances, reducing your carbon footprint compared to driving alone.';
        } else {
          suggestion = 'For long distances, using public transportation remains an eco-friendly option.';
        }
      } else if (method === 'cycling') {
        if (distance < 5) {
          suggestion = 'Cycling is an excellent choice for short trips with a very low carbon footprint!';
        } else if (distance >= 5 && distance < 50) {
          suggestion = 'For medium distances, cycling remains a healthy and eco-friendly option, if feasible.';
        } else {
          suggestion = 'For very long distances, consider combining cycling with public transportation.';
        }
      } else if (method === 'walking') {
        suggestion = 'Walking is the most eco-friendly choice for short distances!';
      }
  
      res.status(200).json({
        distance: distance.toFixed(2),
        footprint: footprint,
        suggestion: suggestion
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    calculate_footprint
};
