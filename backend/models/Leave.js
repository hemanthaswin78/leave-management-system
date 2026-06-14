// const mongoose = require("mongoose");

// const leaveSchema = new mongoose.Schema(
//   {
//     leaveType: {
//       type: String,
//       required: true
//     },
//     startDate: {
//       type: Date,
//       required: true
//     },
//     endDate: {
//       type: Date,
//       required: true
//     },
//     reason: {
//       type: String,
//       required: true
//     },
//     status: {
//       type: String,
//       default: "Pending"
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// module.exports = mongoose.model("Leave", leaveSchema);



const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    leaveType: String,
    startDate: Date,
    endDate: Date,
    reason: String,
    status: { type: String, default: "Pending" },
    days: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);