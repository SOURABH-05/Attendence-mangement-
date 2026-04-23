"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { CheckCircle, Clock } from "lucide-react";

export default function StudentDashboard() {
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
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (sessionId, status) => {
    try {
      await api.post("/attendance/mark", { session_id: sessionId, status });
      toast.success(`Attendance marked as ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to mark attendance");
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading your dashboard...</div>;
  }

  // Filter sessions that belong to the student's batches
  const myBatchIds = batches.map(b => b._id);
  const mySessions = sessions.filter(s => myBatchIds.includes(s.batch_id?._id || s.batch_id));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">Enrolled Batches</div>
          <div className="text-3xl font-bold text-gray-900">{batches.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium mb-1">Total Sessions</div>
          <div className="text-3xl font-bold text-gray-900">{mySessions.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 text-lg">Recent Sessions</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {mySessions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No sessions available right now.</div>
          ) : (
            mySessions.map((session) => (
              <div key={session._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-gray-50/50">
                <div>
                  <h4 className="font-medium text-gray-900 text-lg">{session.title}</h4>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">{session.batch_id?.name || 'Batch Session'}</span>
                    <span>•</span>
                    <Clock className="w-4 h-4" /> 
                    {format(new Date(session.date), 'MMM dd, yyyy')} ({session.start_time} - {session.end_time})
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => markAttendance(session._id, 'present')}
                    className="flex flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Present
                  </button>
                  <button
                    onClick={() => markAttendance(session._id, 'late')}
                    className="flex flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    Late
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
