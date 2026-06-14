import { useState } from "react";
import axios from "axios";

export default function LeaveForm() {
  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const submit = async () => {
    const token =
      localStorage.getItem("token");

    await axios.post(
      "https://leave-management-backend-rmgs.onrender.com/api/leaves",
      form,
      {
        headers: {
          Authorization: token
        }
      }
    );

    window.location.reload();
  };

  return (
    <div>
      <input
        placeholder="Leave Type"
        onChange={(e) =>
          setForm({
            ...form,
            leaveType: e.target.value
          })
        }
      />

      <input
        type="date"
        onChange={(e) =>
          setForm({
            ...form,
            startDate: e.target.value
          })
        }
      />

      <input
        type="date"
        onChange={(e) =>
          setForm({
            ...form,
            endDate: e.target.value
          })
        }
      />

      <input
        placeholder="Reason"
        onChange={(e) =>
          setForm({
            ...form,
            reason: e.target.value
          })
        }
      />

      <button onClick={submit}>
        Submit
      </button>
    </div>
  );
}