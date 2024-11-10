const {Router} = require("express");
const authenticate = require("../middleware/authMiddleware");
const {
    get_user,
    create_user,
    authenticate_user,
    logout_user
} = require("../controllers/users");
const router = Router();

router.route("/get-user").get(get_user);
router.route("/create-user").post(create_user);
router.route("/authenticate_user").post(authenticate_user);
router.route("/logout_user").post(logout_user);

router.route("/auth-status").get(authenticate, (req, res) => {
    res.status(200).json({ message: "Authenticated" });
});
module.exports = router;
