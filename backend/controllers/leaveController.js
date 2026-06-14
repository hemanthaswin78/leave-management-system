// const Leave = require("../models/Leave");

// const createLeave = async (req, res) => {
//   try {
//     const leave = await Leave.create(req.body);

//     res.status(201).json(leave);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// const getLeaves = async (req, res) => {
//   try {
//     const leaves = await Leave.find();

//     res.json(leaves);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// const updateLeave = async (req, res) => {
//   try {
//     const leave = await Leave.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     res.json(leave);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// const deleteLeave = async (req, res) => {
//   try {
//     await Leave.findByIdAndDelete(req.params.id);

//     res.json({
//       message: "Deleted Successfully"
//     });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// module.exports = {
//   createLeave,
//   getLeaves,
//   updateLeave,
//   deleteLeave
// };




const Leave = require("../models/Leave");

const daysBetween = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : 1;
};

const getLeaves = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { username: req.user.username };
    const leaves = await Leave.find(filter).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const username = req.user.username;
    const days = daysBetween(startDate, endDate);

    // Check remaining leaves
    const approved = await Leave.find({ username, status: "Approved" });
    const usedDays = approved.reduce((sum, l) => sum + (l.days || 1), 0);
    if (usedDays + days > 4) {
      return res.status(400).json({ message: `Only ${4 - usedDays} leave days remaining` });
    }

    const leave = await Leave.create({ username, leaveType, startDate, endDate, reason, days });
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteLeave = async (req, res) => {
  try {
    await Leave.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const clearAllLeaves = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    await Leave.deleteMany({});
    res.json({ message: "All leaves cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLeaves, createLeave, updateLeave, deleteLeave, clearAllLeaves };