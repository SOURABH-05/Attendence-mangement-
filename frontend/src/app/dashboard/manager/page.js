"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Users, Server, BookOpen, BarChart } from "lucide-react";

export default function ProgrammeManagerDashboard() {
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
      toast.error("Failed to fetch programme summary");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-gray-500">Loading manager dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="text-gray-500 text-sm font-medium">Institutions</div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{summary?.totalInstitutions || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="text-gray-500 text-sm font-medium">Batches (Global)</div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{summary?.totalBatches || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="text-gray-500 text-sm font-medium">Enrolled Students</div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{summary?.totalStudents || 0}</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="text-gray-500 text-sm font-medium">Avg Attendance</div>
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
              <BarChart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{summary?.averageAttendance || '0%'}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-4">Active Programme Overview</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
             <p className="text-gray-400 text-sm">Interactive Charts will be visualized here.</p>
        </div>
      </div>
    </div>
  );
}
