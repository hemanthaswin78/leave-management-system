import axios from "axios";
import { useEffect, useState } from "react";

export default function LeaveTable() {
  const [leaves, setLeaves] =
    useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    const token =
      localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/leaves",
      {
        headers: {
          Authorization: token
        }
      }
    );

    setLeaves(res.data);
  };

  const deleteLeave = async (id) => {
    const token =
      localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/leaves/${id}`,
      {
        headers: {
          Authorization: token
        }
      }
    );

    fetchLeaves();
  };

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Type</th>
          <th>Start</th>
          <th>End</th>
          <th>Reason</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {leaves.map((leave) => (
          <tr key={leave._id}>
            <td>{leave.leaveType}</td>
            <td>{leave.startDate}</td>
            <td>{leave.endDate}</td>
            <td>{leave.reason}</td>
            <td>{leave.status}</td>

            <td>
              <button
                onClick={() =>
                  deleteLeave(leave._id)
                }
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}