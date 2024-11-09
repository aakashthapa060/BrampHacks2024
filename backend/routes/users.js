const {Router} = require("express");
const {
    get_user,
    create_user
} = require("../controllers/users");
const router = Router();

router.route("/get-user").get(get_user);
router.route("/create-user").post(create_user);

module.exports = router;
