import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Toast from "../components/Toast";

const MAX_LEAVES = 4;

export default function Dashboard() {
  const router = useRouter();
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ leaveType: "", startDate: "", endDate: "", reason: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message = "") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const uname = localStorage.getItem("username");
    if (!token || role === "admin") { router.push("/"); return; }
    setUsername(uname);
    fetchLeaves(token);
  }, []);

  const getHeaders = () => ({ Authorization: localStorage.getItem("token") });

  const fetchLeaves = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaves", {
        headers: { Authorization: token || localStorage.getItem("token") }
      });
      setLeaves(res.data);
    } catch { router.push("/"); }
  };

  const approvedDays = leaves.filter(l => l.status === "Approved").reduce((s, l) => s + (l.days || 1), 0);
  const remainingDays = MAX_LEAVES - approvedDays;

  const calcDays = (start, end) => {
    if (!start || !end) return 0;
    const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/leaves/${editId}`, form, { headers: getHeaders() });
        addToast("success", "Leave Updated!", "Your request has been updated.");
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/leaves", form, { headers: getHeaders() });
        addToast("success", "Leave Submitted!", "Your request is pending approval.");
      }
      setForm({ leaveType: "", startDate: "", endDate: "", reason: "" });
      fetchLeaves();
    } catch (err) {
      addToast("error", "Failed", err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (leave) => {
    if (leave.status !== "Pending") return;
    setEditId(leave._id);
    setForm({
      leaveType: leave.leaveType,
      startDate: leave.startDate?.slice(0, 10),
      endDate: leave.endDate?.slice(0, 10),
      reason: leave.reason,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Cancel this leave request?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/leaves/${id}`, { headers: getHeaders() });
      addToast("info", "Request Cancelled", "Your leave request was removed.");
      fetchLeaves();
    } catch {
      addToast("error", "Failed", "Could not cancel the request.");
    }
  };

  const handleLogout = () => { localStorage.clear(); router.push("/"); };

  const statusBadge = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-700 border border-green-200";
    if (status === "Rejected") return "bg-red-100 text-red-700 border border-red-200";
    return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  };

  const requestedDays = calcDays(form.startDate, form.endDate);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">🏖️</span>
          <div>
            <h1 className="text-sm sm:text-lg font-bold leading-tight">Leave Management System</h1>
            <p className="text-indigo-200 text-xs">Employee Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-indigo-200 text-xs sm:text-sm hidden sm:block">👤 {username}</span>
          <button onClick={handleLogout}
            className="bg-white text-indigo-600 font-semibold px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm hover:bg-indigo-50 transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">

        {/* Leave Balance Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-white rounded-xl shadow p-3 sm:p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total</p>
            <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{MAX_LEAVES}</p>
            <p className="text-xs text-gray-400 mt-1 hidden sm:block">per year</p>
          </div>
          <div className="bg-white rounded-xl shadow p-3 sm:p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Used</p>
            <p className="text-2xl sm:text-3xl font-bold text-orange-500">{approvedDays}</p>
            <p className="text-xs text-gray-400 mt-1 hidden sm:block">approved days</p>
          </div>
          <div className="bg-white rounded-xl shadow p-3 sm:p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Left</p>
            <p className={`text-2xl sm:text-3xl font-bold ${remainingDays <= 1 ? "text-red-500" : "text-green-500"}`}>
              {remainingDays}
            </p>
            <p className="text-xs text-gray-400 mt-1 hidden sm:block">days left</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            {editId ? "✏️ Edit Leave Request" : "➕ New Leave Request"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select value={form.leaveType}
                onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                <option value="">Select type</option>
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Annual Leave</option>
                <option>Maternity Leave</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <input type="text" placeholder="Brief reason" value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            {requestedDays > 0 && (
              <div className="col-span-1 sm:col-span-2">
                <p className="text-sm text-indigo-600 font-medium">
                  📅 This request is for <strong>{requestedDays} day{requestedDays > 1 ? "s" : ""}</strong> — {remainingDays} day{remainingDays !== 1 ? "s" : ""} remaining after approval.
                </p>
              </div>
            )}
            <div className="col-span-1 sm:col-span-2 flex flex-wrap gap-3">
              <button type="submit" disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 sm:px-6 py-2.5 rounded-lg text-sm transition disabled:opacity-50 w-full sm:w-auto">
                {loading ? "Saving..." : editId ? "Update Leave" : "Submit Leave"}
              </button>
              {editId && (
                <button type="button"
                  onClick={() => { setEditId(null); setForm({ leaveType: "", startDate: "", endDate: "", reason: "" }); }}
                  className="border border-gray-300 text-gray-600 px-5 sm:px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition w-full sm:w-auto">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Leave Requests */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">📋 My Leave Requests</h2>
          {leaves.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-400 font-medium">No leave requests yet.</p>
            </div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="sm:hidden space-y-3">
                {leaves.map((leave) => (
                  <div key={leave._id} className="border border-gray-100 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{leave.leaveType}</p>
                        <p className="text-xs text-gray-500">{leave.startDate?.slice(0, 10)} → {leave.endDate?.slice(0, 10)}</p>
                        <p className="text-xs text-gray-500">Reason: {leave.reason}</p>
                        <p className="text-xs text-gray-500">{leave.days || 1} day(s)</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(leave.status)}`}>
                        {leave.status}
                      </span>
                    </div>
                    {leave.status === "Pending" && (
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => handleEdit(leave)}
                          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-1.5 rounded-lg text-xs font-medium transition">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(leave._id)}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded-lg text-xs font-medium transition">
                          Cancel
                        </button>
                      </div>
                    )}
                    {leave.status !== "Pending" && (
                      <p className="text-gray-400 text-xs italic">No actions available</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase text-xs">
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Start</th>
                      <th className="px-4 py-3 text-left">End</th>
                      <th className="px-4 py-3 text-left">Days</th>
                      <th className="px-4 py-3 text-left">Reason</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leaves.map((leave) => (
                      <tr key={leave._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-medium text-gray-800">{leave.leaveType}</td>
                        <td className="px-4 py-3 text-gray-600">{leave.startDate?.slice(0, 10)}</td>
                        <td className="px-4 py-3 text-gray-600">{leave.endDate?.slice(0, 10)}</td>
                        <td className="px-4 py-3 text-gray-600">{leave.days || 1}d</td>
                        <td className="px-4 py-3 text-gray-600">{leave.reason}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(leave.status)}`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {leave.status === "Pending" && (
                              <>
                                <button onClick={() => handleEdit(leave)}
                                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs font-medium transition">
                                  Edit
                                </button>
                                <button onClick={() => handleDelete(leave._id)}
                                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-medium transition">
                                  Cancel
                                </button>
                              </>
                            )}
                            {leave.status !== "Pending" && (
                              <span className="text-gray-400 text-xs italic">No actions</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}