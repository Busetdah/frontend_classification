// Nama file: HistoryTable.js
'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

const HistoryTable = () => {
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      const apiUrl = `https://api.smartbaggingsystem.site/api/statusgumpalan?page=${currentPage}`;
      
      try {
        const response = await axios.get(apiUrl);
        setTableData(response.data.data);
        setPagination(response.data);
      } catch (err) {
        setError("Gagal memuat data. Silakan coba lagi nanti.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleNextPage = () => {
    if (pagination && pagination.next_page_url) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination && pagination.prev_page_url) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="custom-height p-4 bg-white rounded-lg shadow flex flex-col max-w-5xl mx-auto w-full">
      
      <h3 className="text-lg font-semibold mb-4 shrink-0">Tabel Riwayat Status Gumpalan</h3>
      
      {/* ===== PERUBAHAN DI SINI: class 'flex-grow' DIHAPUS ===== */}
      <div className="overflow-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-6 py-2">No.</th>
              <th scope="col" className="px-6 py-2">Tanggal</th>
              <th scope="col" className="px-6 py-2">Suhu (°C)</th>
              <th scope="col" className="px-6 py-2">Kelembaban (%)</th>
              <th scope="col" className="px-6 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && !tableData.length ? (
              <tr>
                <td colSpan="5" className="text-center p-8 text-gray-500">Memuat data...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="text-center p-8 text-red-600">{error}</td>
              </tr>
            ) : (
              tableData.map((item, index) => (
                <tr key={item.id} className="bg-white border-t hover:bg-gray-50">
                  <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                    {pagination.from + index}
                  </th>
                  <td className="px-6 py-2">{dayjs(item.waktu).format('DD MMM YY, HH:mm:ss')}</td>
                  <td className="px-6 py-2">{item.temp}</td>
                  <td className="px-6 py-2">{item.humd}</td>
                  <td className="px-6 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Menggumpal' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
            {!loading && !error && tableData.length === 0 && (
                <tr>
                    <td colSpan="5" className="text-center p-8 text-gray-500">Tidak ada data untuk ditampilkan.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Karena flex-grow dihapus di atas, bagian footer ini akan menempel di bawah tabel, bukan di bawah halaman */}
      <div className="shrink-0 flex justify-between items-center pt-4 mt-auto">
        <button
          onClick={handlePrevPage}
          disabled={!pagination?.prev_page_url || loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Halaman <span className="font-semibold">{pagination?.current_page || 0}</span> dari <span className="font-semibold">{pagination?.last_page || 0}</span>
        </span>
        <button
          onClick={handleNextPage}
          disabled={!pagination?.next_page_url || loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HistoryTable;