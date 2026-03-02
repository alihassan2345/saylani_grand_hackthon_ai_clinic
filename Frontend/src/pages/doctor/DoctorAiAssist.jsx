import React, { useState } from 'react';
import { aiDiagnosisAssistAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Brain, Plus, X, Zap, AlertTriangle, TestTube, Pill, ChevronRight, WifiOff, HeartPulse, Activity, User, Calendar } from 'lucide-react';

const severityColors = { 
    high: 'bg-rose-50 border-rose-200 text-rose-700', 
    medium: 'bg-amber-50 border-amber-200 text-amber-700', 
    low: 'bg-emerald-50 border-emerald-200 text-emerald-700' 
};

const DoctorAiAssist = () => {
    const [symptoms, setSymptoms] = useState([]);
    const [symptomInput, setSymptomInput] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [patientGender, setPatientGender] = useState('');
    const [medicalHistory, setMedicalHistory] = useState('');
    const [result, setResult] = useState(null);
    const [aiWarning, setAiWarning] = useState(null);
    const [loading, setLoading] = useState(false);

    const addSymptom = () => {
        const s = symptomInput.trim();
        if (s && !symptoms.includes(s)) {
            setSymptoms(prev => [...prev, s]);
            setSymptomInput('');
        }
    };

    const removeSymptom = (s) => setSymptoms(prev => prev.filter(x => x !== s));

    const handleAnalyze = async () => {
        if (symptoms.length === 0) return toast.error('Add at least one symptom');
        setLoading(true);
        setResult(null);
        setAiWarning(null);
        try {
            const res = await aiDiagnosisAssistAPI({ symptoms, patientAge, patientGender, medicalHistory });
            setResult(res.data.data);
            if (res.data.warning) {
                setAiWarning(res.data.warning);
                toast('AI unavailable – showing general guidance', { icon: '⚠️' });
            }
        } catch (err) {
            const status = err.response?.status;
            const msg = err.response?.data?.message;
            if (status === 503) {
                toast.error('AI service is not configured on the server.');
            } else if (status === 429) {
                toast.error('AI quota exceeded. Please try again later.');
            } else if (status === 401 || status === 403) {
                toast.error('Authentication error. Please log in again.');
            } else {
                toast.error(msg || 'AI service unavailable. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Brain size={28} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">AI Diagnosis Assistant</h2>
                        <p className="text-sky-100 text-sm">Powered by Google Gemini AI</p>
                    </div>
                </div>
                <p className="text-sky-100 text-sm mt-2">Enter patient symptoms for intelligent diagnostic support.</p>
                <div className="flex items-center gap-2 mt-3 text-xs bg-white/10 rounded-lg p-2">
                    <AlertTriangle size={14} className="text-amber-200" />
                    <p className="text-sky-100">For clinical reference only. Always apply professional medical judgment.</p>
                </div>
            </div>

            {/* Input Form */}
            <div className="bg-white rounded-xl border border-sky-100 p-6 space-y-5 shadow-sm">
                <h3 className="font-semibold text-sky-900 flex items-center gap-2">
                    <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                    Patient Information
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-sky-700 mb-1 flex items-center gap-1">
                            <Calendar size={12} className="text-sky-400" />
                            Patient Age
                        </label>
                        <input 
                            type="number" 
                            placeholder="e.g. 35" 
                            value={patientAge} 
                            onChange={e => setPatientAge(e.target.value)}
                            className="w-full px-3 py-2.5 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-sky-700 mb-1 flex items-center gap-1">
                            <User size={12} className="text-sky-400" />
                            Gender
                        </label>
                        <select 
                            value={patientGender} 
                            onChange={e => setPatientGender(e.target.value)}
                            className="w-full px-3 py-2.5 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white"
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div className="col-span-2">
                        <label className="block text-xs font-medium text-sky-700 mb-1 flex items-center gap-1">
                            <HeartPulse size={12} className="text-sky-400" />
                            Medical History
                        </label>
                        <input 
                            type="text" 
                            placeholder="Diabetes, hypertension, previous surgeries..." 
                            value={medicalHistory} 
                            onChange={e => setMedicalHistory(e.target.value)}
                            className="w-full px-3 py-2.5 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Symptoms Input */}
                <div>
                    <label className="block text-xs font-medium text-sky-700 mb-2 flex items-center gap-1">
                        <Activity size={12} className="text-sky-400" />
                        Current Symptoms *
                    </label>
                    
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text" 
                            placeholder="Type symptom and press Enter or Add"
                            value={symptomInput}
                            onChange={e => setSymptomInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSymptom())}
                            className="flex-1 px-3 py-2.5 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                        <button 
                            type="button" 
                            onClick={addSymptom}
                            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                            <Plus size={16} /> Add
                        </button>
                    </div>
                    
                    {symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {symptoms.map(s => (
                                <span 
                                    key={s} 
                                    className="flex items-center gap-1 bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1 rounded-full text-sm"
                                >
                                    {s}
                                    <button 
                                        type="button" 
                                        onClick={() => removeSymptom(s)} 
                                        className="hover:text-sky-900"
                                    >
                                        <X size={13} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Analyze Button */}
                <button 
                    onClick={handleAnalyze} 
                    disabled={loading || symptoms.length === 0}
                    className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:from-sky-300 disabled:to-sky-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> 
                            Analyzing with AI...
                        </>
                    ) : (
                        <>
                            <Zap size={18} /> 
                            Analyze Symptoms with AI
                        </>
                    )}
                </button>
            </div>

            {/* Fallback Warning */}
            {aiWarning && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <WifiOff size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-amber-700">AI Service Unavailable</p>
                        <p className="text-xs text-amber-600 mt-0.5">{aiWarning} Results below are general clinical guidance and are not AI-generated.</p>
                    </div>
                </div>
            )}

            {/* Results */}
            {result && (
                <div className="space-y-4">
                    {/* Diagnoses */}
                    {result.diagnoses && (
                        <div className="bg-white rounded-xl border border-sky-100 p-6 shadow-sm">
                            <h3 className="font-semibold text-sky-900 mb-4 flex items-center gap-2">
                                <div className="w-1 h-5 bg-sky-500 rounded-full"></div>
                                <Brain size={18} className="text-sky-600" /> 
                                Possible Diagnoses
                            </h3>
                            <div className="space-y-3">
                                {result.diagnoses.map((d, i) => (
                                    <div 
                                        key={i} 
                                        className={`border rounded-xl p-4 ${
                                            severityColors[d.likelihood?.toLowerCase()] || 'bg-sky-50 border-sky-200'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-semibold text-sky-900">{d.condition}</p>
                                                <p className="text-sm mt-1 text-sky-700 opacity-80">{d.description}</p>
                                            </div>
                                            <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full border whitespace-nowrap ${
                                                d.likelihood?.toLowerCase() === 'high' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                                                d.likelihood?.toLowerCase() === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                'bg-emerald-100 text-emerald-700 border-emerald-200'
                                            }`}>
                                                {d.likelihood}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tests & Treatments Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.tests?.length > 0 && (
                            <div className="bg-white rounded-xl border border-sky-100 p-5 shadow-sm">
                                <h4 className="font-semibold text-sky-900 mb-3 flex items-center gap-2">
                                    <TestTube size={16} className="text-sky-600" /> 
                                    Recommended Tests
                                </h4>
                                <ul className="space-y-2">
                                    {result.tests.map((t, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-sky-700">
                                            <ChevronRight size={14} className="text-sky-500 mt-0.5 flex-shrink-0" /> 
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result.treatments?.length > 0 && (
                            <div className="bg-white rounded-xl border border-sky-100 p-5 shadow-sm">
                                <h4 className="font-semibold text-sky-900 mb-3 flex items-center gap-2">
                                    <Pill size={16} className="text-emerald-600" /> 
                                    Treatment Recommendations
                                </h4>
                                <ul className="space-y-2">
                                    {result.treatments.map((t, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-sky-700">
                                            <ChevronRight size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" /> 
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Red Flags */}
                    {result.redFlags?.length > 0 && (
                        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
                            <h4 className="font-semibold text-rose-700 mb-3 flex items-center gap-2">
                                <AlertTriangle size={16} className="text-rose-600" /> 
                                Red Flags to Watch For
                            </h4>
                            <ul className="space-y-2">
                                {result.redFlags.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-rose-700">
                                        <span className="mt-0.5 flex-shrink-0">⚠</span> 
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Raw AI Analysis */}
                    {result.raw && (
                        <div className="bg-white rounded-xl border border-sky-100 p-5 shadow-sm">
                            <h4 className="font-semibold text-sky-900 mb-3 flex items-center gap-2">
                                <Brain size={16} className="text-sky-600" /> 
                                AI Analysis
                            </h4>
                            <p className="text-sm text-sky-700 whitespace-pre-wrap">{result.raw}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DoctorAiAssist;