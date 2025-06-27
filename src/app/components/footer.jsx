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
        <Link href="/">
          <div className="mr-8">
            <FcHome size={35} />
          </div>
        </Link>
      </div>
    </div>
  );
}
