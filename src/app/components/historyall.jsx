'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const HistoryAll = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (start = "", end = "") => {
    let url = `${API_URL}/api/sensordata`;

    if (start && end) {
      url += `?start=${start}&end=${end}`;
    }

    try {
      const response = await axios.get(url);
      const formattedData = response.data.map((item, index) => ({
        time: dayjs(item.recorded_at).format("HH:mm:ss"),
        temp: item.temp + Math.sin(index) * 2,
        humd: item.humd + Math.cos(index) * 2,
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilter = () => {
    fetchData(startDate, endDate);
  };

  return (
    <div class="custom-height p-4">
      <div >
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={handleFilter}>Filter</button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temp" stroke="#ff7300" name="Temperature (°C)" />
          <Line type="monotone" dataKey="humd" stroke="#007bff" name="Humidity (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryAll;
