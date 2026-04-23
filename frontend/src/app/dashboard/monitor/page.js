"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Eye, ShieldAlert, BarChart } from "lucide-react";

export default function MonitoringOfficerDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/summary/programme");
      setSummary(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch monitoring summary");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-gray-500">Loading monitor dashboard...</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-red-800">Read Only Access</h3>
          <p className="text-sm text-red-700 mt-1">Monitoring Officers possess global read-only visibility into system health, attendance statistics, and institution performance. You cannot modify records from this role.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h4 className="flex items-center text-gray-500 font-medium text-sm mb-4"><BarChart className="w-4 h-4 mr-2" /> Key Performance Indicators</h4>
           <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-600">Total Institutions Monitored</span>
                <span className="font-bold text-gray-900">{summary?.totalInstitutions || 0}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-600">Active Students</span>
                <span className="font-bold text-gray-900">{summary?.totalStudents || 0}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-600">Registered Trainers</span>
                <span className="font-bold text-gray-900">{summary?.totalTrainers || 0}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="text-gray-600">Total Educational Batches</span>
                <span className="font-bold text-gray-900">{summary?.totalBatches || 0}</span>
              </div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h4 className="flex items-center text-gray-500 font-medium text-sm mb-4"><Eye className="w-4 h-4 mr-2" /> Global Attendance Metric</h4>
             <div className="flex items-center justify-center h-40 flex-col">
               <div className="text-5xl font-black text-blue-600 mb-2">
                  {summary?.averageAttendance || '0%'}
               </div>
               <p className="text-gray-500 text-sm">Aggregate attendance across all time periods</p>
             </div>
        </div>
      </div>
    </div>
  );
}
