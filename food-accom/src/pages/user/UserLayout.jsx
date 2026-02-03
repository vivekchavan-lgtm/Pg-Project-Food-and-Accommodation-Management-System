import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function UserLayout() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>

            {/* SHARED NAVBAR */}
            <Navbar />

            {/* Main Content Area */}
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            {/* SHARED FOOTER */}
            <Footer />
        </div>
    );
}
