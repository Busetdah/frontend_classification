'use client'

import { useState, useEffect } from "react";

export default function Header() {
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateClock = () => {
            const options = {
                timeZone: "Asia/Jakarta",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            };

            const formatter = new Intl.DateTimeFormat("id-ID", options);
            const formattedDate = formatter.format(new Date()).replace(/\./g, ":");
            setCurrentTime(formattedDate);
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-grey custom-height-header text-white sticky top-0">
            <div className="flex items-center justify-between px-4 py-1/2">
                <div className="flex items-center space-x-4">
                    <img src="/PetroLogo.png" className="logo-custom" />
                </div>
                <h1 className="text-judul font-bold">SISTEM KLASIFIKASI SUHU DAN KELEMBABAN PUPUK UREA</h1>
                <img src="/pergudangan.png" className="logo-custom" />
            </div>
            <div className="border-t-2 border-black"></div>
            <div className="flex items-center text-center justify-between bg-grey px-4 py-1 text-sm">
                <div className="text-green-500 font-bold">RUNNING</div>
                <div className="text-white font-semibold">
                     PART OF SMART BAGGING SYSTEM
                </div>
                <div className="text-white">{currentTime}</div>
            </div>
        </div>
    );
}
