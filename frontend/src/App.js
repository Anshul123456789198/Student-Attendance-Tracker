import React, { useState } from 'react';
import AddStudent from './components/AddStudent';
import MarkAttendance from './components/MarkAttendance';
import ViewReport from './components/ViewReport';
import './styles/App.css';

function App() {
    const [activeTab, setActiveTab] = useState('add');
    const [refreshKey, setRefreshKey] = useState(0);

    const handleStudentAdded = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1> Student Attendance Tracker</h1>
                <nav className="nav-tabs">
                    <button 
                        className={activeTab === 'add' ? 'active' : ''}
                        onClick={() => setActiveTab('add')}
                    >
                        Add Student
                    </button>
                    <button 
                        className={activeTab === 'mark' ? 'active' : ''}
                        onClick={() => setActiveTab('mark')}
                    >
                        Mark Attendance
                    </button>
                    <button 
                        className={activeTab === 'view' ? 'active' : ''}
                        onClick={() => setActiveTab('view')}
                    >
                        View Report
                    </button>
                </nav>
            </header>

            <main className="app-main">
                {activeTab === 'add' && (
                    <AddStudent onStudentAdded={handleStudentAdded} />
                )}
                {activeTab === 'mark' && (
                    <MarkAttendance key={refreshKey} />
                )}
                {activeTab === 'view' && (
                    <ViewReport />
                )}
            </main>


        </div>
    );
}

export default App;