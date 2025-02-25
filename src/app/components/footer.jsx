'use client'
import Link from 'next/link';
import { FcHome } from 'react-icons/fc';

export default function Footer() {

  return (
    <div className="sticky bottom-0 z-99">
      <div className="bg-grey footer-height flex justify-between text-monitoring-custom items-center p-2 z-40">
        <div className="space-x-2">
          <Link href="/realtime">
            <button>HISTORY KLASIFIKASI</button>
          </Link>
          <Link href="/historyall">
            <button>HISTORY DATA MASUK</button>
          </Link>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <button 
            className="bg-blue-800 text-white px-6 py-2 rounded-sm shadow-md hover:bg-blue-600"
          >
            Mulai Klasifikasi
          </button>
        </div>
        <Link href="/">
          <div className="mr-8">
            <FcHome size={35} />
          </div>
        </Link>
      </div>
    </div>
  );
}
