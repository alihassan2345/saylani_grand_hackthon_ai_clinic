import React, { useState, useEffect } from 'react';
import { getDoctorAppointmentsAPI, updateAppointmentStatusAPI, getPatientHistoryAPI, addDiagnosisAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Calendar, User, Clock, CheckCircle, Stethoscope, Plus, X, HeartPulse, FileText, Filter } from 'lucide-react';
import WritePrescription from './WritePrescription';

const SEVERITY_OPTS = ['mild', 'moderate', 'severe', 'critical'];
const EMPTY_DIAG = { symptoms: [], symptomInput: '', finalDiagnosis: '', notes: '', severity: 'mild' };

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [patientHistory, setPatientHistory] = useState(null);
    const [showPrescription, setShowPrescription] = useState(false);
    const [diagnosisAppt, setDiagnosisAppt] = useState(null);
    const [diagForm, setDiagForm] = useState(EMPTY_DIAG);
    const [diagSaving, setDiagSaving] = useState(false);

    const fetchAppts = () => {
        const params = {};
        if (dateFilter) params.date = dateFilter;
        if (statusFilter) params.status = statusFilter;
        getDoctorAppointmentsAPI(params).then(r => setAppointments(r.data.data)).finally(() => setLoading(false));
    };

    useEffect(() => { fetchAppts(); }, [dateFilter, statusFilter]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateAppointmentStatusAPI(id, { status });
            toast.success(`Appointment ${status}`);
            fetchAppts();
        } catch { toast.error('Failed'); }
    };

    const viewHistory = async (patientId) => {
        try {
            const res = await getPatientHistoryAPI(patientId);
            setPatientHistory(res.data.data);
        } catch { toast.error('Could not load history'); }
    };

    const openDiagnosis = (appt) => { setDiagnosisAppt(appt); setDiagForm(EMPTY_DIAG); };
    const closeDiagnosis = () => { setDiagnosisAppt(null); setDiagForm(EMPTY_DIAG); };

    const addSymptomTag = () => {
        const s = diagForm.symptomInput.trim();
        if (s && !diagForm.symptoms.includes(s)) setDiagForm(f => ({ ...f, symptoms: [...f.symptoms, s], symptomInput: '' }));
    };

    const saveDiagnosis = async (e) => {
        e.preventDefault();
        if (!diagForm.finalDiagnosis) return toast.error('Enter a diagnosis');
        setDiagSaving(true);
        try {
            await addDiagnosisAPI({
                patientId: diagnosisAppt.patient._id,
                appointmentId: diagnosisAppt._id,
                symptoms: diagForm.symptoms,
                finalDiagnosis: diagForm.finalDiagnosis,
                notes: diagForm.notes,
                severity: diagForm.severity,
            });
            toast.success('Diagnosis saved & appointment marked completed');
            closeDiagnosis();
            fetchAppts();
        } catch { toast.error('Failed to save diagnosis'); }
        finally { setDiagSaving(false); }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
            cancelled: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
            confirmed: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
            pending: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return `${config.bg} ${config.text} ${config.border}`;
    };

    if (showPrescription && selectedAppt) {
        return <WritePrescription appointment={selectedAppt} onBack={() => { setShowPrescription(false); setSelectedAppt(null); fetchAppts(); }} />;
    }

    return (
        <div className="space-y-6">
            {/* Patient History Modal */}
            {patientHistory && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setPatientHistory(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 border border-sky-100 shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-6 bg-sky-500 rounded-full"></div>
                                <h3 className="text-lg font-bold text-sky-900">Patient History — {patientHistory.patient?.name}</h3>
                            </div>
                            <button onClick={() => setPatientHistory(null)} className="text-sky-400 hover:text-sky-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-semibold text-sky-700 mb-2 flex items-center gap-1">
                                    <Calendar size={14} className="text-sky-500" />
                                    Past Appointments ({patientHistory.appointments?.length})
                                </p>
                                {patientHistory.appointments?.slice(0, 3).map(a => (
                                    <div key={a._id} className="text-sm bg-sky-50 rounded-lg p-3 mb-2 border border-sky-100">
                                        <span className="font-medium text-sky-900">{new Date(a.appointmentDate).toLocaleDateString()}</span> 
                                        <span className="text-sky-400 mx-1">—</span> 
                                        {a.type} 
                                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs capitalize ${getStatusBadge(a.status)}`}>{a.status}</span>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-sky-700 mb-2 flex items-center gap-1">
                                    <FileText size={14} className="text-sky-500" />
                                    Prescriptions ({patientHistory.prescriptions?.length})
                                </p>
                                {patientHistory.prescriptions?.slice(0, 3).map(p => (
                                    <div key={p._id} className="text-sm bg-sky-50 rounded-lg p-3 mb-2 border border-sky-100">
                                        <span className="font-medium text-sky-900">{p.diagnosis}</span>
                                        <span className="text-sky-400 ml-2 text-xs">{new Date(p.createdAt).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Diagnosis Modal */}
            {diagnosisAppt && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={closeDiagnosis}>
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-sky-100 shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-1 h-5 bg-sky-500 rounded-full"></div>
                                    <h3 className="text-lg font-bold text-sky-900">Add Diagnosis</h3>
                                </div>
                                <p className="text-sm text-sky-600">{diagnosisAppt.patient?.name} — Token #{diagnosisAppt.tokenNumber}</p>
                            </div>
                            <button onClick={closeDiagnosis} className="text-sky-400 hover:text-sky-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={saveDiagnosis} className="space-y-4">
                            {/* Symptoms */}
                            <div>
                                <label className="block text-xs font-medium text-sky-700 mb-1">Symptoms</label>
                                <div className="flex gap-2">
                                    <input 
                                        value={diagForm.symptomInput} 
                                        onChange={e => setDiagForm(f => ({ ...f, symptomInput: e.target.value }))}
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSymptomTag())}
                                        placeholder="Type symptom & press Enter"
                                        className="flex-1 px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={addSymptomTag} 
                                        className="px-3 py-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                {diagForm.symptoms.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {diagForm.symptoms.map(s => (
                                            <span key={s} className="flex items-center gap-1 bg-sky-50 text-sky-700 text-xs px-2.5 py-1 rounded-full border border-sky-200">
                                                {s} 
                                                <button type="button" onClick={() => setDiagForm(f => ({ ...f, symptoms: f.symptoms.filter(x => x !== s) }))}>
                                                    <X size={11} className="hover:text-sky-900" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Final Diagnosis */}
                            <div>
                                <label className="block text-xs font-medium text-sky-700 mb-1">Final Diagnosis *</label>
                                <input 
                                    required 
                                    value={diagForm.finalDiagnosis} 
                                    onChange={e => setDiagForm(f => ({ ...f, finalDiagnosis: e.target.value }))}
                                    placeholder="e.g. Viral upper respiratory infection"
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" 
                                />
                            </div>
                            
                            {/* Severity */}
                            <div>
                                <label className="block text-xs font-medium text-sky-700 mb-1">Severity</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {SEVERITY_OPTS.map(s => (
                                        <button 
                                            key={s} 
                                            type="button" 
                                            onClick={() => setDiagForm(f => ({ ...f, severity: s }))}
                                            className={`py-2 rounded-lg text-xs font-medium capitalize border transition-all ${
                                                diagForm.severity === s
                                                    ? s === 'critical' ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                                        : s === 'severe' ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                                                            : s === 'moderate' ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                                                                : 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                                                    : 'bg-white border-sky-200 text-sky-600 hover:bg-sky-50'
                                            }`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-medium text-sky-700 mb-1">Clinical Notes</label>
                                <textarea 
                                    value={diagForm.notes} 
                                    onChange={e => setDiagForm(f => ({ ...f, notes: e.target.value }))} 
                                    rows={3}
                                    placeholder="Additional clinical observations, follow-up instructions..."
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none" 
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-1">
                                <button 
                                    type="button" 
                                    onClick={closeDiagnosis} 
                                    className="flex-1 py-2.5 rounded-lg border border-sky-200 text-sky-600 text-sm hover:bg-sky-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={diagSaving} 
                                    className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-sm font-semibold disabled:opacity-60 transition-all shadow-sm"
                                >
                                    {diagSaving ? 'Saving...' : 'Save Diagnosis'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
            <div>
                <h2 className="font-semibold text-sky-900 flex items-center gap-2">
                    <span className="w-1 h-6 bg-sky-500 rounded-full"></span>
                    My Appointments
                </h2>
                <p className="text-sm text-sky-600 mt-0.5">Manage and track patient appointments</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-1 bg-sky-50 p-1 rounded-lg border border-sky-100">
                    <Filter size={14} className="text-sky-500 ml-1" />
                    <input 
                        type="date" 
                        value={dateFilter} 
                        onChange={e => setDateFilter(e.target.value)}
                        className="px-3 py-2 border-0 bg-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-sky-700" 
                    />
                </div>
                
                <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-sky-700"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                
                {(dateFilter || statusFilter) && (
                    <button 
                        onClick={() => { setDateFilter(''); setStatusFilter(''); }} 
                        className="text-sm text-sky-500 hover:text-sky-700 px-3 py-2 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Appointments List */}
            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : appointments.length === 0 ? (
                <div className="bg-white rounded-xl border border-sky-100 p-16 text-center">
                    <Calendar size={48} className="mx-auto mb-3 text-sky-300" />
                    <p className="text-sky-500 font-medium">No appointments found</p>
                    <p className="text-xs text-sky-400 mt-1">Try adjusting your filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {appointments.map(appt => (
                        <div key={appt._id} className="bg-white rounded-xl border border-sky-100 p-5 hover:shadow-md transition-all duration-200">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-400 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                        <span className="text-white font-bold text-sm">#{appt.tokenNumber}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sky-900">{appt.patient?.name}</p>
                                        <p className="text-xs text-sky-500 mt-0.5">{appt.patient?.phone} | {appt.patient?.gender}</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-sky-600">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} className="text-sky-400" />
                                                {new Date(appt.appointmentDate).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} className="text-sky-400" />
                                                {appt.timeSlot}
                                            </span>
                                            <span className="capitalize bg-sky-50 px-2 py-0.5 rounded-full text-sky-600 border border-sky-200">
                                                {appt.type}
                                            </span>
                                        </div>
                                        {appt.reason && (
                                            <p className="text-xs text-sky-500 mt-2 italic bg-sky-50 p-2 rounded-lg border border-sky-100">
                                                "{appt.reason}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(appt.status)}`}>
                                        {appt.status}
                                    </span>
                                </div>
                            </div>
                            
                            {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                                <div className="flex gap-2 mt-4 pt-4 border-t border-sky-100">
                                    <button 
                                        onClick={() => { setSelectedAppt(appt); setShowPrescription(true); }}
                                        className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all shadow-sm"
                                    >
                                        <FileText size={13} /> Write Prescription
                                    </button>
                                    <button 
                                        onClick={() => openDiagnosis(appt)}
                                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all shadow-sm"
                                    >
                                        <Stethoscope size={13} /> Add Diagnosis
                                    </button>
                                    <button 
                                        onClick={() => viewHistory(appt.patient?._id)}
                                        className="border border-sky-200 text-sky-600 hover:bg-sky-50 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                                    >
                                        <User size={13} /> Patient History
                                    </button>
                                    {appt.status !== 'cancelled' && (
                                        <button 
                                            onClick={() => handleStatusUpdate(appt._id, 'cancelled')}
                                            className="border border-rose-200 text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;