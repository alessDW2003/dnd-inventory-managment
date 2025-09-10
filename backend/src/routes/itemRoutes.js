const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

router.get("/", itemController.getAll.bind(itemController));
router.get("/:id", itemController.getById.bind(itemController));
router.get("/user/:userId", itemController.getByUserId.bind(itemController));
router.post("/", itemController.create.bind(itemController));
router.put("/:id", itemController.update.bind(itemController));
router.delete("/:id", itemController.delete.bind(itemController));

module.exports = router;
