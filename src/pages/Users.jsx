import { useState, useEffect } from "react";
import { Users as UsersIcon, Shield, UserCheck, ShieldAlert, Check, UserPlus, X, Trash2, AlertTriangle } from "lucide-react";

function UsersPage() {
  // Mock team members list saved in Local Storage
  const [teamMembers, setTeamMembers] = useState(() => {
    const saved = localStorage.getItem("team_members_list");
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: "Ali Khan", email: "ali@example.com", role: "Admin" },
      { id: 2, name: "Ahmed Raza", email: "ahmed@example.com", role: "Accountant" },
      { id: 3, name: "Ayesha Malik", email: "ayesha@example.com", role: "Viewer" },
    ];
  });

  const currentUserRole = localStorage.getItem("user_role") || "Admin";
  const [notification, setNotification] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Modal State for Adding New Member
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Viewer");

  // State for Delete Confirmation Modal
  const [memberToDelete, setMemberToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem("team_members_list", JSON.stringify(teamMembers));
  }, [teamMembers]);

  // Handle Role Change
  const handleRoleChange = (id, updatedRole) => {
    if (currentUserRole !== "Admin") {
      setErrorMsg("Access Denied: Only users with 'Admin' role can modify team permissions.");
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }

    setTeamMembers(prev =>
      prev.map(member => (member.id === id ? { ...member, role: updatedRole } : member))
    );
    setNotification("Role updated successfully!");
    setTimeout(() => setNotification(""), 3000);
  };

  // Confirm and Execute Delete
  const confirmDeleteMember = () => {
    if (currentUserRole !== "Admin") {
      setErrorMsg("Access Denied: Only Admins can delete team members.");
      setTimeout(() => setErrorMsg(""), 4000);
      setMemberToDelete(null);
      return;
    }

    if (teamMembers.length <= 1) {
      setErrorMsg("Cannot delete the last remaining team member.");
      setTimeout(() => setErrorMsg(""), 3000);
      setMemberToDelete(null);
      return;
    }

    setTeamMembers(prev => prev.filter(member => member.id !== memberToDelete.id));
    setNotification(`Team member "${memberToDelete.name}" deleted successfully!`);
    setTimeout(() => setNotification(""), 3000);
    setMemberToDelete(null);
  };

  // Handle Add New Member Form Submit
  const handleAddMember = (e) => {
    e.preventDefault();
    if (currentUserRole !== "Admin") {
      setErrorMsg("Access Denied: Only Admins can add new members.");
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }

    if (!newName.trim() || !newEmail.trim()) {
      setErrorMsg("Please fill in all fields.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    const newMemberObj = {
      id: Date.now(),
      name: newName,
      email: newEmail,
      role: newRole,
    };

    setTeamMembers([newMemberObj, ...teamMembers]);
    setNewName("");
    setNewEmail("");
    setNewRole("Viewer");
    setIsModalOpen(false);
    setNotification("New team member added successfully!");
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 p-4 md:p-8">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Roles & Permissions</h1>
          <p className="text-xs text-gray-500 mt-1">Manage team members and enforce role-based access control (RBAC).</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm">
            <UsersIcon size={16} /> Total Members: {teamMembers.length}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition-all"
          >
            <UserPlus size={16} /> Add Member
          </button>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2 font-medium">
          <Check size={16} /> {notification}
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
          <ShieldAlert size={16} /> {errorMsg}
        </div>
      )}

      {/* Add Member Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <UserPlus size={20} className="text-blue-600" /> Add New Team Member
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Bilal Ahmed"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. bilal@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-blue-500 font-bold text-slate-700 cursor-pointer"
                >
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Accountant">Accountant (Operations)</option>
                  <option value="Viewer">Viewer (Read-Only)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Popup */}
      {memberToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-5 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">Delete Team Member?</h3>
              <p className="text-xs text-gray-500">
                Are you sure you want to remove <strong className="text-slate-700">{memberToDelete.name}</strong> from the team? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteMember}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Permission Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
            <Shield size={18} /> Admin
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Permissions:</strong> Full system access. Can add/delete members, modify roles, and configure system settings.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <UserCheck size={18} /> Accountant
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Permissions:</strong> Operational access. Can record income, track expenses, and manage budgets.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
            <ShieldAlert size={18} /> Viewer
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Permissions:</strong> Read-only access. Restricted to viewing analytics and transaction summaries.
          </p>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Team Members List</h3>
          <span className="text-[11px] text-gray-400 font-semibold">Active Session Role: <strong className="text-blue-600">{currentUserRole}</strong></span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Assigned Role</th>
                <th className="py-3 px-6 text-right">Actions (Role / Delete)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-800">{member.name}</td>
                  <td className="py-4 px-6 text-gray-500 text-xs">{member.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-block ${
                      member.role === "Admin" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                      member.role === "Accountant" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : 
                      "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer text-slate-700 hover:border-gray-300 transition-all"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Accountant">Accountant</option>
                        <option value="Viewer">Viewer</option>
                      </select>

                      <button
                        onClick={() => setMemberToDelete(member)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                        title="Delete Member"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default UsersPage;