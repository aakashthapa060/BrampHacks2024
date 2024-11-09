const {Router} = require("express");
const router = Router();

const  {
    calculate_distance
} = require("../controllers/maps");


router.route("/calulate").get(calculate_distance)

module.exports = router;