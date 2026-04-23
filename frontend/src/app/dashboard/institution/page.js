"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { BookOpen, Users, Activity } from "lucide-react";

export default function InstitutionDashboard() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/batches");
      setBatches(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch institution data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-gray-500">Loading institution dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-sm font-medium mb-1">Total Batches</div>
            <div className="text-3xl font-bold text-gray-900">{batches.length}</div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <BookOpen className="w-8 h-8" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-sm font-medium mb-1">Total Active Students</div>
            <div className="text-3xl font-bold text-gray-900">
              {batches.reduce((acc, b) => acc + (b.students?.length || 0), 0)}
            </div>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <Users className="w-8 h-8" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-gray-500 text-sm font-medium mb-1">Total Trainers</div>
            <div className="text-3xl font-bold text-gray-900">
                {batches.reduce((acc, b) => acc + (b.trainers?.length || 0), 0)}
            </div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Activity className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 text-lg">Batch Overview</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Create Batch
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">Batch Name</th>
                <th className="px-6 py-3 font-medium">Trainers</th>
                <th className="px-6 py-3 font-medium">Students</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {batches.map((batch) => (
                <tr key={batch._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">{batch.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {batch.trainers?.map(t => t.name).join(', ') || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{batch.students?.length || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 font-medium hover:text-blue-800 px-3 transition-colors">View Details</button>
                  </td>
                </tr>
              ))}
              {batches.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No batches found. Create one.
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
