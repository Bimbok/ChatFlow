const express = require("express");
const protectRoute = require("../middleware/auth.middleware");
const { getMessages, getUsersForSidebar, sendMessage, markMessagesAsRead } = require("../controllers/message.controller");

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.put("/mark-read/:id", protectRoute, markMessagesAsRead);

module.exports = router;
