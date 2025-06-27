"use client";
import React, { useState, useEffect, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Body2() {
    // Data sensor dari /api/produkdata
    const [sensorData, setSensorData] = useState({ temp: 0, humd: 0, tempStatus: "NORMAL", humdStatus: "NORMAL" });
    // Status umum (menggumpal / tidak menggumpal) dari /api/potensi
    const [status, setStatus] = useState("tidak menggumpal");
    // Untuk mengatur tampilan notifikasi warning
    const [showPopup, setShowPopup] = useState(false);
    // Untuk menyimpan waktu notifikasi terakhir yang ditampilkan
    const prevWaktuRef = useRef("");

    // Custom hook untuk mengambil data suhu & kelembaban
    const useSSE = (url, setData, tempLow, tempHigh, humdLow, humdHigh) => {
        useEffect(() => {
            const eventSource = new EventSource(`${API_URL}${url}`);
            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const temp = data?.temp || 0;
                    const humd = data?.humd || 0;
                    const tempStatus = temp < tempLow ? "LOW" : temp > tempHigh ? "OVER" : "NORMAL";
                    const humdStatus = humd < humdLow ? "LOW" : humd > humdHigh ? "OVER" : "NORMAL";
                    setData({ temp, humd, tempStatus, humdStatus });
                } catch (error) {
                    console.error(`Error parsing SSE data from ${url}:`, error);
                }
            };

            eventSource.onerror = () => {
                console.error(`SSE connection error for ${url}, closing connection.`);
                eventSource.close();
            };

            return () => {
                eventSource.close();
            };
        }, [url, setData, tempLow, tempHigh, humdLow, humdHigh]);
    };

    // Ambil status umum dari /api/potensi
    useEffect(() => {
        const eventSource = new EventSource(`${API_URL}/api/potensi`);
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setStatus(data.status);
            } catch (error) {
                console.error("Error parsing SSE data from /api/potensi:", error);
            }
        };

        eventSource.onerror = (error) => {
            console.error("SSE connection error on /api/potensi:", error);
            eventSource.close();
        };

        return () => eventSource.close();
    }, []);

    // Ambil data sensor dari /api/produkdata
    useSSE("/api/produkdata", setSensorData, 29, 50, 29, 71);

    // Ambil notifikasi dari /api/cekgumpalan
    useEffect(() => {
        const eventSource = new EventSource(`${API_URL}/api/cekgumpalan`);
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const notifStatus = data?.status.toLowerCase() || "tidak menggumpal";
                if (
                    notifStatus === "menggumpal" &&
                    status &&
                    status.toLowerCase() === "menggumpal" &&
                    prevWaktuRef.current !== data.waktu
                ) {
                    prevWaktuRef.current = data.waktu;
                    setShowPopup(true);
                    setTimeout(() => setShowPopup(false), 5000);
                }
            } catch (error) {
                console.error("Error parsing SSE data from /api/cekgumpalan:", error);
            }
        };
    
        eventSource.onerror = (error) => {
            console.error("SSE connection error on /api/cekgumpalan:", error);
            eventSource.close();
        };
    
        return () => eventSource.close();
    }, [status]);
    

    return (
        <div className="custom-height bg-blue py-1 relative">
            {showPopup && (
                <div className="fixed top-26 right-2 bg-red-600 text-white p-4 rounded shadow-lg z-50">
                    <p>Suhu & Kelembapan Pupuk diluar standard</p>
                    <p>Akan terjadi penggumpalan</p>
                    <p>Segera bersihkan pupuk yang menggumpal pada area Hopper</p>
                </div>
            )}

            <div className="absolute solenoid-valve">
                <img className="solenoid-valve-image" src="/sol_val.png" alt="Solenoid Valve" />
            </div>
            <div className="absolute kodrum z-20">
                <img className="kodrum-image" src="/kodrum.png" alt="Kodrum" />
            </div>
            <div className="absolute custom-hopper2 z-24">
                <img className="custom-hopper-image" src="/hopper-2.png" alt="Hopper" />
            </div>
            
            <div className="custom-size-pressure absolute flex flex-col items-center gray-custom rounded-sm text-monitoring-custom z-20" style={{ top: "7%", left: "50vw" }}>
                <div className="flex items-center">
                    <div className="bg-gray-800 p-3 rounded-sm flex flex-col items-center text-white">
                        <h2 className="font-bold text-center custom-suhu">SUHU</h2>
                        <div className="font-bold text-green-400">{sensorData.temp} °C</div>
                    </div>
                </div>
                <div className="flex justify-around w-full mt-3">
                    <div className="flex flex-col items-center">
                        <div className={`custom-indicator border border-white rounded-sm ${sensorData.tempStatus === "LOW" ? "bg-green-500" : "bg-gray-500"}`}></div>
                        <span className="text-green-700 font-semibold">LOW</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`custom-indicator border border-white rounded-sm ${sensorData.tempStatus === "NORMAL" ? "bg-yellow-500" : "bg-gray-500"}`}></div>
                        <span className="text-yellow-700 font-semibold">NORMAL</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`custom-indicator border border-white rounded-sm ${sensorData.tempStatus === "OVER" ? "bg-red-500" : "bg-gray-500"}`}></div>
                        <span className="text-red-700 font-semibold">OVER</span>
                    </div>
                </div>
            </div>

            <div className="absolute text-monitoring-custom custom-size-pressure flex flex-col items-center gray-custom rounded-sm z-20" style={{ bottom: "20vh", left: "50vw" }}>
                <div className="flex items-center">
                    <div className="bg-gray-800 p-3 rounded-sm flex flex-col items-center text-white">
                        <h2 className="font-bold text-center custom-suhu">KELEMBABAN</h2>
                        <div className="font-bold text-green-400">{sensorData.humd} %</div>
                    </div>
                </div>
                <div className="flex justify-around w-full mt-3">
                    <div className="flex flex-col items-center">
                        <div className={`custom-indicator border border-white rounded-sm ${sensorData.humdStatus === "LOW" ? "bg-green-500" : "bg-gray-500"}`}></div>
                        <span className="text-green-700 font-semibold">LOW</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`custom-indicator border border-white rounded-sm ${sensorData.humdStatus === "NORMAL" ? "bg-yellow-500" : "bg-gray-500"}`}></div>
                        <span className="text-yellow-700 font-semibold">NORMAL</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`custom-indicator border border-white rounded-sm ${sensorData.humdStatus === "OVER" ? "bg-red-500" : "bg-gray-500"}`}></div>
                        <span className="text-red-700 font-semibold">OVER</span>
                    </div>
                </div>
            </div>

            {/* ===== PERBAIKAN DITERAPKAN DI SINI ===== */}
            {/* Mengubah zIndex menjadi 10 agar berada di lapisan belakang */}
            <div 
                className="absolute"
                style={{ top: '24vh', left: '32vw', zIndex: 10 }}
            >
                <svg width="30vw" height="30vh">
                    <line x1="4vw" y1="5vh" x2="25vw" y2="5vh" stroke="black" strokeWidth="3"></line>
                    <line x1="25vw" y1="2vh" x2="25vw" y2="30vh" stroke="black" strokeWidth="3"></line>
                    <line x1="25vw" y1="0vh" x2="25vw" y2="2vh" stroke="black" strokeWidth="3"></line>
                </svg>
            </div>
            
            <div className="absolute gray-custom shadow-md p-1 text-center z-20" style={{ top: '25vh', right: '5vw' }}>
                <div className="bg-black text-white px-3 py-2 text-monitoring-custom">
                    <p className="font-bold">STATUS</p>
                </div>
                <div className="bg-black text-white px-3 py-2 mt-2 text-monitoring-custom flex flex-col items-start">
                    <div className="flex items-center justify-between w-full mb-2">
                        <p className="font-bold">Menggumpal</p>
                        <div className={`w-6 h-6 border border-white ${status.toLowerCase() === "menggumpal" ? "bg-red-500" : "bg-gray-500"}`}></div>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <p className="font-bold">Tidak Menggumpal</p>
                        <div className={`ml-3 w-6 h-6 border border-white ${status.toLowerCase() === "tidak menggumpal" ? "bg-green-500" : "bg-gray-500"}`}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}