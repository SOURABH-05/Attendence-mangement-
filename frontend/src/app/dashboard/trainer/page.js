"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Copy, Plus, Users, BookOpen } from "lucide-react";

export default function TrainerDashboard() {
  const [batches, setBatches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [batchesRes, sessionsRes] = await Promise.all([
        api.get("/batches"),
        api.get("/sessions")
      ]);
      setBatches(batchesRes.data.data);
      setSessions(sessionsRes.data.data);
    } catch (err) {
      toast.error("Failed to fetch trainer data");
    } finally {
      setLoading(false);
    }
  };

  const generateInvite = async (batchId) => {
    try {
      const res = await api.post(`/batches/${batchId}/invite`);
      const newCode = res.data.data.inviteCode;
      
      // Update local state
      setBatches(batches.map(b => b._id === batchId ? { ...b, inviteCode: newCode } : b));
      toast.success("New invite link generated!");
    } catch (err) {
      toast.error("Failed to generate invite");
    }
  };

  const copyInvite = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Invite code copied to clipboard!");
  };

  if (loading) return <div className="text-gray-500">Loading trainer dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-sm font-medium mb-1">My Batches</div>
            <div className="text-3xl font-bold text-gray-900">{batches.length}</div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <BookOpen className="w-8 h-8" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-sm font-medium mb-1">Sessions Conducted</div>
            <div className="text-3xl font-bold text-gray-900">{sessions.length}</div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 text-lg">My Batches</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">Batch Name</th>
                <th className="px-6 py-3 font-medium">Students</th>
                <th className="px-6 py-3 font-medium">Invite Code</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {batches.map((batch) => (
                <tr key={batch._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">{batch.name}</td>
                  <td className="px-6 py-4 text-gray-600">{batch.students?.length || 0} enrolled</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono tracking-widest uppercase">
                        {batch.inviteCode || "None"}
                      </span>
                      {batch.inviteCode && (
                        <button onClick={() => copyInvite(batch.inviteCode)} className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => generateInvite(batch._id)}
                      className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
                    >
                      Regenerate Link
                    </button>
                  </td>
                </tr>
              ))}
              {batches.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No batches assigned to you yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
