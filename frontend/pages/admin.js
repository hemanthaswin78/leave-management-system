// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import axios from "axios";

// const MAX_LEAVES = 4;
// const EMPLOYEES = ["tom", "eren", "goku", "salaar", "jerry"];

// export default function Admin() {
//   const router = useRouter();
//   const [leaves, setLeaves] = useState([]);
//   const [filter, setFilter] = useState("All");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");
//     if (!token || role !== "admin") { router.push("/"); return; }
//     fetchLeaves(token);
//   }, []);

//   const getHeaders = () => ({ Authorization: localStorage.getItem("token") });

//   const fetchLeaves = async () => {
//     try {
//       const res = await axios.get("https://leave-management-backend-nmqs.onrender.com/api/leaves", { headers: getHeaders() });
//       setLeaves(res.data);
//     } catch { router.push("/"); }
//   };

//   const handleStatus = async (id, status) => {
//     setLoading(true);
//     await axios.put(`https://leave-management-backend-nmqs.onrender.com/api/leaves/${id}`, { status }, { headers: getHeaders() });
//     fetchLeaves();
//     setLoading(false);
//   };

//   const handleDelete = async (id) => {
//   if (!confirm("Delete this leave request permanently?")) return;
//   await axios.delete(`https://leave-management-backend-nmqs.onrender.com/api/leaves/${id}`, { headers: getHeaders() });
//   fetchLeaves();
// };

// const handleClearAll = async () => {
//   if (!confirm("Delete ALL leave data? This cannot be undone.")) return;
//   await axios.delete("https://leave-management-backend-nmqs.onrender.com/api/leaves/clear-all", { headers: getHeaders() });
//   fetchLeaves();
// };

//   const getEmployeeStats = (username) => {
//     const empLeaves = leaves.filter(l => l.username === username);
//     const approved = empLeaves.filter(l => l.status === "Approved").reduce((s, l) => s + (l.days || 1), 0);
//     return { total: empLeaves.length, approved, remaining: MAX_LEAVES - approved };
//   };

//   const filteredLeaves = filter === "All" ? leaves : leaves.filter(l =>
//     filter === "Pending" || filter === "Approved" || filter === "Rejected"
//       ? l.status === filter
//       : l.username === filter
//   );

//   const statusBadge = (status) => {
//     if (status === "Approved") return "bg-green-100 text-green-700 border border-green-200";
//     if (status === "Rejected") return "bg-red-100 text-red-700 border border-red-200";
//     return "bg-yellow-100 text-yellow-700 border border-yellow-200";
//   };

//   const handleLogout = () => { localStorage.clear(); router.push("/"); };

//   const pending = leaves.filter(l => l.status === "Pending").length;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <nav className="bg-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
//         <div className="flex items-center gap-3">
//           <span className="text-2xl">🛡️</span>
//           <div>
//             <h1 className="text-lg font-bold leading-tight">Leave Management System</h1>
//             <p className="text-indigo-200 text-xs">Admin Portal</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-4">
//           {pending > 0 && (
//             <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{pending} pending</span>
//           )}
//           <button onClick={handleLogout} className="bg-white text-indigo-700 font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-50 transition">
//             Logout
//           </button>
//         </div>
//       </nav>

//       <div className="max-w-6xl mx-auto p-6 space-y-6">

//         {/* Employee Summary Cards */}
//         <div>
//           <h2 className="text-lg font-semibold text-gray-800 mb-3">👥 Employee Leave Summary</h2>
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//             {EMPLOYEES.map(emp => {
//               const stats = getEmployeeStats(emp);
//               return (
//                 <div key={emp} className="bg-white rounded-xl shadow p-4 text-center cursor-pointer hover:ring-2 hover:ring-indigo-400 transition"
//                   onClick={() => setFilter(emp)}>
//                   <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg flex items-center justify-center mx-auto mb-2">
//                     {emp[0].toUpperCase()}
//                   </div>
//                   <p className="font-semibold text-gray-800 capitalize text-sm">{emp}</p>
//                   <p className="text-xs text-gray-500 mt-1">{stats.approved}/{MAX_LEAVES} used</p>
//                   <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
//                     <div className={`h-1.5 rounded-full ${stats.approved >= MAX_LEAVES ? "bg-red-400" : "bg-indigo-400"}`}
//                       style={{ width: `${(stats.approved / MAX_LEAVES) * 100}%` }} />
//                   </div>
//                   <p className={`text-xs font-semibold mt-1 ${stats.remaining <= 0 ? "text-red-500" : "text-green-600"}`}>
//                     {stats.remaining} days left
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Filter Bar */}
//         <div className="flex gap-2 flex-wrap">
//           {["All", "Pending", "Approved", "Rejected"].map(f => (
//             <button key={f} onClick={() => setFilter(f)}
//               className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${filter === f ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"}`}>
//               {f}
//             </button>
//           ))}
//         </div>

//         {/* Leaves Table */}
//         <div className="bg-white rounded-2xl shadow p-6">
//   <div className="flex justify-between items-center mb-4">
//     <h2 className="text-lg font-semibold text-gray-800">
//       📋 Leave Requests {filter !== "All" && <span className="text-indigo-500 capitalize">— {filter}</span>}
//     </h2>
//     <button onClick={handleClearAll}
//       className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-medium transition">
//       🗑️ Clear All Data
//     </button>
//   </div>
//           {filteredLeaves.length === 0 ? (
//             <p className="text-gray-400 text-center py-8">No leave requests found.</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="bg-gray-50 text-gray-500 uppercase text-xs">
//                     <th className="px-4 py-3 text-left">Employee</th>
//                     <th className="px-4 py-3 text-left">Type</th>
//                     <th className="px-4 py-3 text-left">Start</th>
//                     <th className="px-4 py-3 text-left">End</th>
//                     <th className="px-4 py-3 text-left">Days</th>
//                     <th className="px-4 py-3 text-left">Reason</th>
//                     <th className="px-4 py-3 text-left">Status</th>
//                     <th className="px-4 py-3 text-left">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {filteredLeaves.map((leave) => (
//                     <tr key={leave._id} className="hover:bg-gray-50 transition">
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2">
//                           <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center">
//                             {leave.username?.[0]?.toUpperCase()}
//                           </div>
//                           <span className="font-medium text-gray-800 capitalize">{leave.username}</span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 text-gray-600">{leave.leaveType}</td>
//                       <td className="px-4 py-3 text-gray-600">{leave.startDate?.slice(0, 10)}</td>
//                       <td className="px-4 py-3 text-gray-600">{leave.endDate?.slice(0, 10)}</td>
//                       <td className="px-4 py-3 text-gray-600">{leave.days || 1}d</td>
//                       <td className="px-4 py-3 text-gray-600">{leave.reason}</td>
//                       <td className="px-4 py-3">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(leave.status)}`}>
//                           {leave.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//   <div className="flex gap-2 flex-wrap">
//     {leave.status === "Pending" && (
//       <>
//         <button onClick={() => handleStatus(leave._id, "Approved")} disabled={loading}
//           className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-medium transition disabled:opacity-50">
//           ✓ Approve
//         </button>
//         <button onClick={() => handleStatus(leave._id, "Rejected")} disabled={loading}
//           className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-medium transition disabled:opacity-50">
//           ✗ Reject
//         </button>
//       </>
//     )}
//     <button onClick={() => handleDelete(leave._id)}
//       className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium transition">
//       🗑️ Delete
//     </button>
//   </div>
// </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Toast from "../components/Toast";

const MAX_LEAVES = 4;
const EMPLOYEES = ["tom", "eren", "goku", "salaar", "jerry"];

export default function Admin() {
  const router = useRouter();
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
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
    if (!token || role !== "admin") { router.push("/"); return; }
    fetchLeaves();
  }, []);

  const getHeaders = () => ({ Authorization: localStorage.getItem("token") });

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("https://leave-management-backend-nmqs.onrender.com/api/leaves", { headers: getHeaders() });
      setLeaves(res.data);
    } catch { router.push("/"); }
  };

  const handleStatus = async (id, status) => {
    setLoading(true);
    try {
      await axios.put(`https://leave-management-backend-nmqs.onrender.com/api/leaves/${id}`, { status }, { headers: getHeaders() });
      await fetchLeaves();
      if (status === "Approved") {
        addToast("success", "Leave Approved", "Employee has been notified.");
      } else {
        addToast("error", "Leave Rejected", "The leave request has been rejected.");
      }
    } catch {
      addToast("error", "Action Failed", "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this leave request permanently?")) return;
    try {
      await axios.delete(`https://leave-management-backend-nmqs.onrender.com/api/leaves/${id}`, { headers: getHeaders() });
      await fetchLeaves();
      addToast("info", "Request Deleted", "Leave request has been removed.");
    } catch {
      addToast("error", "Delete Failed", "Could not delete the request.");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Delete ALL leave data? This cannot be undone.")) return;
    try {
      await axios.delete("https://leave-management-backend-nmqs.onrender.com/api/leaves/clear-all", { headers: getHeaders() });
      await fetchLeaves();
      addToast("warning", "All Data Cleared", "All leave records have been deleted.");
    } catch {
      addToast("error", "Clear Failed", "Could not clear data.");
    }
  };

  const getEmployeeStats = (username) => {
    const empLeaves = leaves.filter(l => l.username === username);
    const approved = empLeaves.filter(l => l.status === "Approved").reduce((s, l) => s + (l.days || 1), 0);
    return { total: empLeaves.length, approved, remaining: MAX_LEAVES - approved };
  };

  const filteredLeaves = filter === "All" ? leaves : leaves.filter(l =>
    ["Pending", "Approved", "Rejected"].includes(filter)
      ? l.status === filter
      : l.username === filter
  );

  const statusBadge = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-700 border border-green-200";
    if (status === "Rejected") return "bg-red-100 text-red-700 border border-red-200";
    return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  };

  const handleLogout = () => { localStorage.clear(); router.push("/"); };
  const pending = leaves.filter(l => l.status === "Pending").length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Toast Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Navbar */}
      <nav className="bg-indigo-700 text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">🛡️</span>
          <div>
            <h1 className="text-sm sm:text-lg font-bold leading-tight">Leave Management System</h1>
            <p className="text-indigo-200 text-xs">Admin Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {pending > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              {pending} pending
            </span>
          )}
          <button onClick={handleLogout}
            className="bg-white text-indigo-700 font-semibold px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm hover:bg-indigo-50 transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">

        {/* Employee Summary Cards */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">👥 Employee Leave Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
            {EMPLOYEES.map(emp => {
              const stats = getEmployeeStats(emp);
              const isSelected = filter === emp;
              return (
                <div key={emp}
                  onClick={() => setFilter(isSelected ? "All" : emp)}
                  className={`bg-white rounded-xl shadow p-3 sm:p-4 text-center cursor-pointer transition
                    ${isSelected ? "ring-2 ring-indigo-500 shadow-md" : "hover:ring-2 hover:ring-indigo-300"}`}>
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-bold text-base sm:text-lg flex items-center justify-center mx-auto mb-2
                    ${stats.remaining <= 0 ? "bg-red-100 text-red-600" : "bg-indigo-100 text-indigo-600"}`}>
                    {emp[0].toUpperCase()}
                  </div>
                  <p className="font-semibold text-gray-800 capitalize text-xs sm:text-sm">{emp}</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.approved}/{MAX_LEAVES} used</p>
                  <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all ${stats.approved >= MAX_LEAVES ? "bg-red-400" : "bg-indigo-400"}`}
                      style={{ width: `${Math.min((stats.approved / MAX_LEAVES) * 100, 100)}%` }} />
                  </div>
                  <p className={`text-xs font-semibold mt-1 ${stats.remaining <= 0 ? "text-red-500" : "text-green-600"}`}>
                    {stats.remaining <= 0 ? "No days left" : `${stats.remaining} days left`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "Approved", "Rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition border
                ${filter === f
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"}`}>
              {f}
              {f === "Pending" && pending > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pending}</span>
              )}
            </button>
          ))}
        </div>

        {/* Leave Table */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              📋 Leave Requests
              {filter !== "All" && (
                <span className="text-indigo-500 capitalize ml-1 text-sm">— {filter}</span>
              )}
            </h2>
            <button onClick={handleClearAll}
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap">
              🗑️ Clear All
            </button>
          </div>

          {filteredLeaves.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-400 font-medium">No leave requests found.</p>
            </div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="sm:hidden space-y-3">
                {filteredLeaves.map((leave) => (
                  <div key={leave._id} className="border border-gray-100 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm flex items-center justify-center">
                          {leave.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 capitalize text-sm">{leave.username}</p>
                          <p className="text-xs text-gray-500">{leave.leaveType}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(leave.status)}`}>
                        {leave.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>📅 {leave.startDate?.slice(0, 10)} → {leave.endDate?.slice(0, 10)} ({leave.days || 1}d)</p>
                      <p>📝 {leave.reason}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {leave.status === "Pending" && (
                        <>
                          <button onClick={() => handleStatus(leave._id, "Approved")} disabled={loading}
                            className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50">
                            ✓ Approve
                          </button>
                          <button onClick={() => handleStatus(leave._id, "Rejected")} disabled={loading}
                            className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50">
                            ✗ Reject
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(leave._id)}
                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 py-1.5 rounded-lg text-xs font-medium transition">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase text-xs">
                      <th className="px-4 py-3 text-left">Employee</th>
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
                    {filteredLeaves.map((leave) => (
                      <tr key={leave._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center">
                              {leave.username?.[0]?.toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-800 capitalize">{leave.username}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{leave.leaveType}</td>
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
                          <div className="flex gap-2 flex-wrap">
                            {leave.status === "Pending" && (
                              <>
                                <button onClick={() => handleStatus(leave._id, "Approved")} disabled={loading}
                                  className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-medium transition disabled:opacity-50">
                                  ✓ Approve
                                </button>
                                <button onClick={() => handleStatus(leave._id, "Rejected")} disabled={loading}
                                  className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-medium transition disabled:opacity-50">
                                  ✗ Reject
                                </button>
                              </>
                            )}
                            <button onClick={() => handleDelete(leave._id)}
                              className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium transition">
                              🗑️ Delete
                            </button>
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
