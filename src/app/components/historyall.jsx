// Nama file: HistoryRealtime.js
'use client'

import React, { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import dayjs from "dayjs";

// Pastikan variabel lingkungan ini sudah di-set di file .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const HistoryRealtime = () => {
  // State untuk menyimpan data yang akan ditampilkan di chart
  const [data, setData] = useState([]);
  // State untuk melacak status koneksi SSE
  const [connectionStatus, setConnectionStatus] = useState("Menyambungkan...");

  useEffect(() => {
    // URL ini akan digunakan untuk koneksi SSE, sesuai permintaan Anda
    const sseUrl = `${API_URL}/api/sensordata`;

    console.log(`Membuka koneksi SSE ke: ${sseUrl}`);
    const eventSource = new EventSource(sseUrl);

    // Dipanggil saat koneksi berhasil dibuka
    eventSource.onopen = () => {
      setConnectionStatus("Terhubung");
      console.log("Koneksi SSE berhasil dibuka.");
    };

    // Dipanggil setiap kali server mengirim pesan (event default)
    eventSource.onmessage = (event) => {
      try {
        // Karena server mengirim array data dalam format JSON string, kita parse
        const newArrayData = JSON.parse(event.data);

        // Pastikan data yang diterima adalah sebuah array
        if (Array.isArray(newArrayData)) {
          // Format seluruh array yang diterima dari server
          const formattedData = newArrayData.map(item => ({
            time: dayjs(item.waktu).format("HH:mm:ss"),
            temp: item.temp,
            humd: item.humd,
          }))
          // Balik urutan agar data tertua di kiri dan terbaru di kanan (kronologis)
          .reverse();

          // Ganti seluruh data chart dengan data baru yang sudah diformat
          setData(formattedData);
        }

      } catch (error) {
        console.error("Gagal mem-parsing data SSE atau format data salah:", error);
      }
    };

    // Dipanggil jika terjadi error pada koneksi
    eventSource.onerror = (error) => {
      setConnectionStatus("Koneksi Error");
      console.error("Error pada EventSource:", error);
      eventSource.close(); // Tutup koneksi jika error agar tidak terus mencoba
    };

    // Fungsi cleanup: Tutup koneksi saat komponen di-unmount
    return () => {
      eventSource.close();
      console.log("Koneksi SSE ditutup.");
    };
  }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali

  return (
    // Class 'custom-height' ditambahkan di sini untuk menyamakan tinggi page
    <div className="custom-height p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Grafik Data Real-time (SSE)</h3>
        {/* Indikator Status Koneksi */}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart 
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            isAnimationActive={false} // Animasi dimatikan untuk update yang mulus
            type="monotone" 
            dataKey="temp" 
            stroke="#ff7300" 
            name="Temperature (°C)" 
          />
          <Line 
            isAnimationActive={false}
            type="monotone" 
            dataKey="humd" 
            stroke="#007bff"
            name="Humidity (%)" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryRealtime;