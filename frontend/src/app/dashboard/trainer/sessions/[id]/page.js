"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function SessionAttendanceView() {
  const params = useParams();
  const sessionId = params.id;
  const router = useRouter();

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessionAttendance();
  }, [sessionId]);

  const fetchSessionAttendance = async () => {
    try {
      const res = await api.get(`/attendance/session/${sessionId}`);
      setAttendance(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch session attendance");
      router.push("/dashboard/trainer/sessions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-gray-500">Loading attendance data...</div>;

  const presentCount = attendance.filter(a => a.status === 'present').length;
  const lateCount = attendance.filter(a => a.status === 'late').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link 
          href="/dashboard/trainer/sessions" 
          className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Session Attendance</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
             <User className="w-6 h-6" />
           </div>
           <div>
             <div className="text-sm text-gray-500 font-medium">Total Marked</div>
             <div className="text-2xl font-bold text-gray-900">{attendance.length}</div>
           </div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="p-3 bg-green-50 text-green-600 rounded-lg">
             <CheckCircle className="w-6 h-6" />
           </div>
           <div>
             <div className="text-sm text-gray-500 font-medium">Present</div>
             <div className="text-2xl font-bold text-gray-900">{presentCount}</div>
           </div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
             <Clock className="w-6 h-6" />
           </div>
           <div>
             <div className="text-sm text-gray-500 font-medium">Late</div>
             <div className="text-2xl font-bold text-gray-900">{lateCount}</div>
           </div>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 text-lg">Student Attendance Roster</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">Student Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Time Marked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendance.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">{record.student_id?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-gray-500">{record.student_id?.email || 'N/A'}</td>
                  <td className="px-6 py-4">
                    {record.status === 'present' ? (
                      <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium border border-green-200">
                        Present
                      </span>
                    ) : record.status === 'late' ? (
                       <span className="bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-medium border border-yellow-200">
                        Late
                      </span>
                    ) : (
                       <span className="bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium border border-red-200">
                        Absent
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500">
                    {new Date(record.marked_at).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
              {attendance.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No students have marked attendance for this session yet.
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
