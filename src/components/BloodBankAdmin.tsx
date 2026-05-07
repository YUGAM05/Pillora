"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { getToken } from '@/lib/tokenStorage';
import { Download, FileSpreadsheet, FileText, Users, Droplet, Calendar, Phone, MapPin, AlertCircle } from 'lucide-react';
// Removed top-level imports that break SSR
import { saveAs } from 'file-saver';

export default function BloodBankAdmin() {
    const [activeTab, setActiveTab] = useState<'donors' | 'requests'>('donors');
    const [donors, setDonors] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalDonors: 0, totalRequests: 0, urgentRequests: 0, availableDonors: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = getToken();
            const [donorsRes, requestsRes] = await Promise.all([
                api.get('/blood-bank/admin/donors', { headers: { Authorization: `Bearer ${token}` } }),
                api.get('/blood-bank/admin/requests', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setDonors(donorsRes.data);
            setRequests(requestsRes.data);

            // Calculate stats
            setStats({
                totalDonors: donorsRes.data.length,
                totalRequests: requestsRes.data.length,
                urgentRequests: requestsRes.data.filter((r: any) => r.isUrgent).length,
                availableDonors: donorsRes.data.filter((d: any) => d.isAvailable).length
            });
        } catch (error) {
            console.error('Failed to fetch blood bank data', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadExcel = async (type: 'donors' | 'requests') => {
        try {
            const token = getToken();
            const endpoint = type === 'donors'
                ? '/blood-bank/admin/export/donors/excel'
                : '/blood-bank/admin/export/requests/excel';

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            saveAs(blob, `blood-${type}-${Date.now()}.xlsx`);
        } catch (error) {
            console.error('Excel export failed:', error);
            alert('Failed to export to Excel');
        }
    };

    const downloadPDF = async (type: 'donors' | 'requests') => {
        try {
            const token = getToken();
            const endpoint = type === 'donors'
                ? '/blood-bank/admin/export/donors/pdf'
                : '/blood-bank/admin/export/requests/pdf';

            const response = await api.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
            const data = type === 'donors' ? response.data.donors : response.data.requests;

            // Dynamically import libraries to avoid SSR errors
            const jspdfModule = await import('jspdf');
            const jsPDF = jspdfModule.jsPDF || jspdfModule.default;
            const autoTable = (await import('jspdf-autotable')).default;

            // Create PDF
            const doc = new jsPDF('landscape');

            // Add title
            doc.setFontSize(18);
            doc.setTextColor(220, 20, 60);
            doc.text(`Blood ${type === 'donors' ? 'Donors' : 'Requests'} Report`, 14, 15);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

            // Prepare table data
            let headers: string[];
            let rows: any[][];

            if (type === 'donors') {
                headers = ['Name', 'Email', 'Blood Group', 'Age', 'Gender', 'Phone', 'City', 'Area', 'Available', 'Last Donation'];
                rows = data.map((d: any) => [
                    d.name, d.email, d.bloodGroup, d.age, d.gender,
                    d.phone, d.city, d.area, d.isAvailable, d.lastDonationDate
                ]);
            } else {
                headers = ['Patient', 'Requested By', 'Blood Group', 'Units', 'Hospital', 'City', 'Contact', 'Status', 'Urgent'];
                rows = data.map((r: any) => [
                    r.patientName, r.requestedBy, r.bloodGroup, r.units,
                    r.hospitalAddress, r.city, r.contactNumber, r.status, r.isUrgent
                ]);
            }

            // Add table
            autoTable(doc, {
                head: [headers],
                body: rows,
                startY: 28,
                theme: 'grid',
                headStyles: {
                    fillColor: [220, 20, 60],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: { fillColor: [245, 245, 245] },
                margin: { top: 28 }
            });

            // Save PDF
            doc.save(`blood-${type}-${Date.now()}.pdf`);
        } catch (error) {
            console.error('PDF export failed:', error);
            alert('Failed to export to PDF');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-teal-500 text-xl">Loading Blood Connect Data...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <header className="mb-12 max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600 mb-2">
                    Blood Connect Management
                </h1>
                <p className="text-slate-400">Manage donors and blood requests</p>
            </header>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<Users className="w-6 h-6" />} label="Total Donors" value={stats.totalDonors} color="blue" />
                <StatCard icon={<Droplet className="w-6 h-6" />} label="Available Donors" value={stats.availableDonors} color="green" />
                <StatCard icon={<FileText className="w-6 h-6" />} label="Total Requests" value={stats.totalRequests} color="purple" />
                <StatCard icon={<AlertCircle className="w-6 h-6" />} label="Urgent Requests" value={stats.urgentRequests} color="red" />
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto">
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('donors')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'donors'
                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        <Users className="w-5 h-5 inline mr-2" />
                        Donors ({donors.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'requests'
                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        <Droplet className="w-5 h-5 inline mr-2" />
                        Requests ({requests.length})
                    </button>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => downloadExcel(activeTab)}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-600/30"
                    >
                        <FileSpreadsheet className="w-5 h-5" />
                        Export to Excel
                    </button>
                    <button
                        onClick={() => downloadPDF(activeTab)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30"
                    >
                        <Download className="w-5 h-5" />
                        Export to PDF
                    </button>
                </div>

                {/* Data Table */}
                <div className="bg-slate-900/50 backdrop-blur border border-white/5 rounded-3xl overflow-hidden">
                    {activeTab === 'donors' ? (
                        <DonorsTable donors={donors} />
                    ) : (
                        <RequestsTable requests={requests} />
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: any) {
    const colorClasses = {
        blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        green: 'bg-green-500/10 border-green-500/20 text-green-400',
        purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
        red: 'bg-red-500/10 border-red-500/20 text-red-400'
    };

    return (
        <div className={`p-6 rounded-2xl border ${colorClasses[color as keyof typeof colorClasses]} backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
            </div>
            <h3 className="text-4xl font-bold text-white mb-1">{value}</h3>
            <p className="text-slate-400 text-sm font-medium">{label}</p>
        </div>
    );
}

function DonorsTable({ donors }: { donors: any[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-800/50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Donor</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Blood Group</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Age/Gender</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Registered</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {donors.map((donor) => (
                        <tr key={donor._id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4">
                                <div>
                                    <p className="font-bold text-white">{donor.name}</p>
                                    <p className="text-sm text-slate-400">{donor.user?.email}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold">
                                    {donor.bloodGroup}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-300">
                                {donor.age} / {donor.gender}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Phone className="w-4 h-4" />
                                    {donor.phone}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <MapPin className="w-4 h-4" />
                                    {donor.area}, {donor.city}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${donor.isAvailable
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {donor.isAvailable ? 'Available' : 'Unavailable'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(donor.createdAt).toLocaleDateString()}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {donors.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    No donors registered yet.
                </div>
            )}
        </div>
    );
}

function RequestsTable({ requests }: { requests: any[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-800/50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Patient</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Blood Group</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Units</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Hospital</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">KYC Verification</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {requests.map((request) => (
                        <tr key={request._id} className={`hover:bg-slate-800/30 transition-colors ${request.isUrgent ? 'bg-red-900/10' : ''}`}>
                            <td className="px-6 py-4">
                                <div>
                                    <p className="font-bold text-white flex items-center gap-2">
                                        {request.patientName}
                                        {request.isUrgent && <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">URGENT</span>}
                                    </p>
                                    <p className="text-sm text-slate-400">Age: {request.age}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold">
                                    {request.bloodGroup}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-white font-bold">
                                {request.units} units
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-slate-300 text-sm">
                                    <p className="font-medium">{request.hospitalAddress}</p>
                                    <p className="text-slate-400">{request.area}, {request.city}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Phone className="w-4 h-4" />
                                    {request.contactNumber}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="space-y-1">
                                    <p className="text-white font-mono text-sm">{request.kycDocumentId || 'No ID Extracted'}</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${request.aiVerificationStatus === 'Verified' ? 'bg-green-500' : request.aiVerificationStatus === 'Rejected' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                        <span className="text-[10px] uppercase font-bold text-slate-400">{request.aiVerificationStatus}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${request.status === 'Open'
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : request.status === 'Urgent'
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {request.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(request.createdAt).toLocaleDateString()}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {requests.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    No blood requests yet.
                </div>
            )}
        </div>
    );
}
