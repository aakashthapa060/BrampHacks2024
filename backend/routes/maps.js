const {Router} = require("express");
const router = Router();

const {
    calculate_footprint
} = require("../controllers/maps");


router.route("/calculate").post(calculate_footprint);

module.exports = router;