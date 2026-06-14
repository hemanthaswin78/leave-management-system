// const router = require("express").Router();

// const auth = require("../middleware/authMiddleware");

// const {
//   createLeave,
//   getLeaves,
//   updateLeave,
//   deleteLeave
// } = require("../controllers/leaveController");

// router.post("/", auth, createLeave);
// router.get("/", auth, getLeaves);
// router.put("/:id", auth, updateLeave);
// router.delete("/:id", auth, deleteLeave);

// module.exports = router;



const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createLeave,
  getLeaves,
  updateLeave,
  deleteLeave,
  clearAllLeaves
} = require("../controllers/leaveController");

router.post("/", auth, createLeave);
router.get("/", auth, getLeaves);
router.put("/:id", auth, updateLeave);
router.delete("/clear-all", auth, clearAllLeaves);
router.delete("/:id", auth, deleteLeave);

module.exports = router;