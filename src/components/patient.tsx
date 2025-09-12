import { useState } from "react";
import { fetchPatient } from "../store";
import PatientId from "./PatientId";
import PatientStats from "./PatientStats";
import PatientSOAP from "./PatientSOAP";
import "./patient.css";

export const Patient = () => {

  const showDebugInfo = false;

  const [patientData, setPatientData] = useState<any>(null);
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSearch, setShowSearch] = useState(true);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPatientData(null);
    if (!searchId.trim()) {
      setError("Please enter an MRN.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetchPatient(searchId.trim());
      const patient = response.patient || response;
      setPatientData(patient);
      setShowSearch(false); // Hide search after successful patient load
    } catch (err: any) {
      setPatientData(null);
      
      // Handle specific authentication errors
      if (err.message.includes('Authentication')) {
        setError("Authentication failed. Please refresh the page and log in again.");
      } else if (err.message.includes('401')) {
        setError("Unauthorized access. Please check your permissions.");
      } else {
        setError("Patient not found or error fetching patient data.");
      }
      
      console.error("Error fetching patient data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchPatient = () => {
    setPatientData(null);
    setSearchId('');
    setError('');
    setShowSearch(true); // Show search when switching patients
  };

  return (
    <div className="text-left patient-container mt-10 mb-40">
      {showSearch && (
        <div className="px-3 lg:px-0">
          <h3 className="text-xl font-normal text-gray-600 mb-1 text-left">Patient Search</h3>
          <form onSubmit={handleSearch} className="patient-search-form">
            <div className="flex flex-col space-y-2">
              <label htmlFor="patient-search" className="text-sm font-medium text-gray-700">
                MRN
              </label>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  id="patient-search"
                  type="text"
                  placeholder="Enter MRN"
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                  className="patient-search-input focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
                />
                <button
                  type="submit"
                  className="patient-search-button w-full sm:w-auto"
                  disabled={loading}
                  style={loading ? { backgroundColor: '#1F84C6' } : undefined}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>
          </form>
          {error && <div className="text-red-500 mb-2 text-sm md:text-base">{error}</div>}
        </div>
      )}
            
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-8 mb-6 lg:items-stretch">
        <div className="lg:flex-1">
          {patientData && <PatientId
            patient_id={patientData.id}
            name={patientData.name}
            dob={patientData.dob}
            gender={patientData.gender}
            mrn={patientData.mrn}
            visit_id={patientData.visit_id}
            admit_date={patientData.admit_date}
            site={patientData.site}
            bed={patientData.bed}
            onSwitchPatient={handleSwitchPatient}
          />}
        </div>
        
        <div className="lg:flex-1">
          {patientData && patientData.predictions && <PatientStats predictions={patientData.predictions} />}
        </div>
      </div>

      <div className="w-full">
        {patientData && patientData.rounds && <PatientSOAP rounds={patientData.rounds} />}
      </div>

      {/* Debug information */}
      {patientData && showDebugInfo && (
        <div className="debug-section mt-4 p-2 bg-gray-100 rounded text-xs px-3 lg:px-0">
          <details>
            <summary className="cursor-pointer">Debug: Raw Patient Data</summary>
            <pre className="mt-2 overflow-auto text-xs">{JSON.stringify(patientData, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default Patient;