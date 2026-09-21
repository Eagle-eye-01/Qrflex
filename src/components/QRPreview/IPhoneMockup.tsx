import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, MotionValue } from 'framer-motion';
import { sound } from '../../utils/audio';
import { fetchUserWeather, type WeatherInfo } from '../../utils/weather';
import type { QRDesignSettings } from '../../types/qr';
import { X, Navigation, Cloud, Sun, CloudRain, Wind, Droplets } from 'lucide-react';

interface IPhoneMockupProps {
  payload: string;
  design: QRDesignSettings;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  laserActive?: boolean;
}

type AppState = 'home' | 'qr' | 'camera' | 'gallery' | 'weather';

export const IPhoneMockup: React.FC<IPhoneMockupProps> = ({
  payload,
  design,
  tiltX,
  tiltY,
  laserActive = false,
}) => {
  const [activeApp, setActiveApp] = useState<AppState>('home');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Dynamic live clock for status bar & analog clock icon
  const [now, setNow] = useState(() => new Date());

  // Live user weather & location
  const [weather, setWeather] = useState<WeatherInfo>({
    city: 'Detecting...',
    temp: 21,
    high: 24,
    low: 16,
    condition: 'Partly Cloudy',
    weatherCode: 2,
    humidity: 55,
    windSpeed: 12,
    loading: true,
    permissionState: 'prompt',
  });

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch live weather and user location on mount
  useEffect(() => {
    fetchUserWeather((info) => {
      setWeather(info);
    });
  }, []);

  // Camera stream lifecycle
  useEffect(() => {
    if (activeApp === 'camera') {
      navigator.mediaDevices?.getUserMedia?.({ video: true })
        .then((stream) => {
          setCameraStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error('Camera access denied or unavailable', err));
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
    }

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [activeApp]);

  const handleAppClick = (app: AppState) => {
    sound.playClick();
    setActiveApp(app);
  };

  // Date and Time strings
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const dayNumber = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const timeFormatted = `${hours === 0 ? 12 : hours > 12 ? hours - 12 : hours}:${minutes < 10 ? '0' + minutes : minutes}`;

  // Clock hands rotation
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6;
  const secondDeg = seconds * 6;

  // Scale QR code proportionally
  const qrDisplaySize = Math.round(150 + ((Math.min(420, Math.max(160, design.size)) - 160) / (420 - 160)) * (235 - 150));

  // Render authentic Weather Sheet/Modal
  const renderWeatherModal = () => (
    <div className="absolute inset-0 bg-gradient-to-b from-[#1b5a9b] via-[#2a77c4] to-[#4794db] z-50 flex flex-col pt-12 pb-6 px-4 text-white overflow-hidden animate-in fade-in duration-200">
      {/* Weather Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-1.5 bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-white/90 border border-white/10">
          <Navigation className="w-3 h-3 text-[#e4ff1a]" />
          <span>{weather.permissionState === 'granted' ? 'LIVE GPS LOCATION' : 'DETECTED REGION'}</span>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            setActiveApp('home');
          }}
          className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Temp & City */}
      <div className="flex flex-col items-center mt-3 text-center">
        <h2 className="text-2xl font-semibold tracking-wide">{weather.city}</h2>
        <div className="text-6xl font-extralight tracking-tighter my-1">
          {weather.loading ? '--' : `${weather.temp}°`}
        </div>
        <p className="text-sm font-medium text-white/90">{weather.condition}</p>
        <div className="flex space-x-3 text-xs text-white/80 font-medium mt-1">
          <span>H: {weather.high}°</span>
          <span>L: {weather.low}°</span>
        </div>
      </div>

      {/* Hourly Strip Mockup */}
      <div className="mt-6 bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
        <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 border-b border-white/10 pb-1 flex items-center justify-between">
          <span>HOURLY FORECAST</span>
          <span className="text-[#e4ff1a]">OPEN-METEO SYNC</span>
        </div>
        <div className="flex justify-between text-center text-xs">
          {[
            { t: 'Now', temp: weather.temp, icon: Sun },
            { t: '2 PM', temp: weather.temp + 1, icon: Sun },
            { t: '3 PM', temp: weather.temp + 2, icon: Cloud },
            { t: '4 PM', temp: weather.temp + 1, icon: Cloud },
            { t: '5 PM', temp: weather.temp - 1, icon: CloudRain },
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center space-y-1">
                <span className="text-[10px] text-white/80">{item.t}</span>
                <IconComp className="w-4 h-4 text-[#ffea00]" />
                <span className="font-semibold text-[11px]">{item.temp}°</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Humidity & Wind telemetry */}
      <div className="grid grid-cols-2 gap-2.5 mt-3">
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-2.5 border border-white/10 flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-cyan-300 flex-shrink-0" />
          <div>
            <div className="text-[9px] text-white/60 font-bold">HUMIDITY</div>
            <div className="text-xs font-bold">{weather.humidity}%</div>
          </div>
        </div>
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-2.5 border border-white/10 flex items-center space-x-2">
          <Wind className="w-4 h-4 text-emerald-300 flex-shrink-0" />
          <div>
            <div className="text-[9px] text-white/60 font-bold">WIND SPEED</div>
            <div className="text-xs font-bold">{weather.windSpeed} km/h</div>
          </div>
        </div>
      </div>

      {/* Switch to QR Studio Button */}
      <div className="mt-auto flex flex-col items-center pt-2">
        <button
          onClick={() => {
            sound.playClick();
            setActiveApp('qr');
          }}
          className="w-full py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
        >
          <span>OPEN QR STUDIO ENGINE</span>
          <span className="text-xs font-mono text-[#e4ff1a]">⚡</span>
        </button>
      </div>
    </div>
  );

  // Render Camera App
  const renderCameraApp = () => (
    <div className="absolute inset-0 bg-black z-40 flex flex-col justify-between overflow-hidden">
      {cameraStream ? (
        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-[#0a0a0f] text-white">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3 border border-white/20">
            <span className="text-2xl">📷</span>
          </div>
          <p className="text-xs font-semibold mb-1">OPTICAL VIEWFINDER STANDBY</p>
          <p className="text-[10px] text-white/60 max-w-[200px]">Simulated iPhone camera sensor ready to scan live matrices.</p>
        </div>
      )}

      {/* Camera UI Top */}
      <div className="relative z-50 h-16 bg-black/40 backdrop-blur-md flex items-center justify-between px-5 pt-4">
        <span className="text-yellow-400 font-mono text-[10px] font-bold tracking-wider">⚡ FLASH AUTO</span>
        <span className="text-white/80 font-mono text-[10px]">4K 60FPS</span>
      </div>

      {/* Viewfinder Target */}
      <div className="relative z-40 flex-1 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 border border-white/40 rounded-2xl relative">
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#e4ff1a]" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#e4ff1a]" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#e4ff1a]" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#e4ff1a]" />
        </div>
      </div>

      {/* Bottom Shutter Bar */}
      <div className="relative z-50 h-28 bg-black/70 backdrop-blur-md flex items-center justify-around px-6 pb-2">
        <button
          onClick={() => handleAppClick('gallery')}
          className="w-11 h-11 rounded-lg bg-white/20 border border-white/30 overflow-hidden flex items-center justify-center"
        >
          <QRCodeCanvas value={payload} size={36} fgColor="#000" bgColor="#fff" level="M" />
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveApp('qr');
          }}
          className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-95 transition-transform"
        >
          <div className="w-12 h-12 bg-white rounded-full" />
        </button>

        <button
          onClick={() => handleAppClick('home')}
          className="text-white/90 text-xs font-semibold hover:text-white px-2 py-1"
        >
          Done
        </button>
      </div>
    </div>
  );

  // Render Photos / Gallery
  const renderGalleryApp = () => (
    <div className="absolute inset-0 bg-white dark:bg-[#0c0d12] z-40 flex flex-col pt-12 overflow-hidden">
      <div className="px-4 pb-2 border-b dark:border-white/10 border-slate-200 flex justify-between items-end h-12">
        <span className="text-xl font-bold dark:text-white text-black">Photos</span>
        <button
          onClick={() => handleAppClick('home')}
          className="text-blue-500 text-sm font-semibold hover:text-blue-400"
        >
          Done
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-1">
        <div className="grid grid-cols-3 gap-1">
          <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-[10px] text-slate-400 font-mono">IMG_0841</div>
          <div className="aspect-square bg-slate-300 dark:bg-slate-700 rounded flex items-center justify-center text-[10px] text-slate-400 font-mono">IMG_0842</div>

          {/* Active Generated QR Code as saved photo */}
          <div
            className="aspect-square bg-white border dark:border-white/10 border-slate-300 rounded flex items-center justify-center p-1.5 cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
            onClick={() => handleAppClick('qr')}
            title="Click to view QR Engine"
          >
            <QRCodeCanvas
              value={payload}
              size={80}
              fgColor={design.fgColor}
              bgColor={design.bgColor}
              level={design.level}
              marginSize={0}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render 1:1 Authentic iPhone X iOS Home Screen
  const renderHomeScreen = () => (
    <div
      className="absolute inset-0 z-20 flex flex-col justify-between pt-12 pb-4 px-3 select-none overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 85% 18%, rgba(0, 195, 255, 0.85) 0%, transparent 40%),
          radial-gradient(circle at 15% 32%, rgba(255, 45, 125, 0.9) 0%, transparent 45%),
          radial-gradient(circle at 65% 50%, rgba(255, 120, 65, 0.85) 0%, transparent 42%),
          radial-gradient(circle at 50% 82%, rgba(255, 255, 255, 0.95) 0%, transparent 55%),
          linear-gradient(180deg, #101322 0%, #191c33 22%, #38254c 42%, #c9a4bd 68%, #eef1f6 100%)
        `,
      }}
    >
      {/* 4x5 App Icon Grid */}
      <div className="grid grid-cols-4 gap-y-3.5 gap-x-2 pt-2 px-1">
        {/* ROW 1 */}
        {/* 1. Mail */}
        <button onClick={() => sound.playClick()} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-gradient-to-b from-[#56a9fe] to-[#127efb] shadow-md flex items-center justify-center active:scale-95 transition-transform">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" fill="white" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke="#127efb" strokeWidth="2" />
            </svg>
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Mail</span>
        </button>

        {/* 2. Calendar */}
        <button onClick={() => sound.playClick()} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-white shadow-md flex flex-col items-center justify-between p-1.5 active:scale-95 transition-transform">
            <span className="text-[#ff3b30] text-[8px] font-bold tracking-tight uppercase leading-none mt-0.5">
              {dayName.slice(0, 3)}
            </span>
            <span className="text-black text-2xl font-light leading-none -mt-1">{dayNumber}</span>
            <div className="h-0.5" />
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Calendar</span>
        </button>

        {/* 3. Photos */}
        <button onClick={() => handleAppClick('gallery')} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-white shadow-md flex items-center justify-center p-2 active:scale-95 transition-transform">
            <svg className="w-8 h-8" viewBox="0 0 100 100">
              <circle cx="50" cy="25" r="16" fill="#fbc02d" opacity="0.8" />
              <circle cx="68" cy="32" r="16" fill="#f57c00" opacity="0.8" />
              <circle cx="75" cy="50" r="16" fill="#e53935" opacity="0.8" />
              <circle cx="68" cy="68" r="16" fill="#ab47bc" opacity="0.8" />
              <circle cx="50" cy="75" r="16" fill="#1e88e5" opacity="0.8" />
              <circle cx="32" cy="68" r="16" fill="#00acc1" opacity="0.8" />
              <circle cx="25" cy="50" r="16" fill="#43a047" opacity="0.8" />
              <circle cx="32" cy="32" r="16" fill="#8bc34a" opacity="0.8" />
            </svg>
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Photos</span>
        </button>

        {/* 4. Camera */}
        <button onClick={() => handleAppClick('camera')} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-gradient-to-b from-[#d5d7de] via-[#8c8e96] to-[#6e7078] shadow-md flex items-center justify-center active:scale-95 transition-transform border border-black/10">
            <div className="w-8 h-8 rounded-full border-[3px] border-black/80 flex items-center justify-center relative bg-[#1c1d22]">
              <div className="w-3.5 h-3.5 rounded-full bg-[#3a3b45] border border-white/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#111]" />
              </div>
              <div className="w-1 h-1 bg-yellow-400 rounded-full absolute -top-1 -right-0.5 shadow-[0_0_2px_#facc15]" />
            </div>
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Camera</span>
        </button>

        {/* ROW 2 */}
        {/* 5. Maps */}
        <button onClick={() => sound.playClick()} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-[#cce8c5] shadow-md flex items-center justify-center relative overflow-hidden active:scale-95 transition-transform border border-black/10">
            {/* Map lines */}
            <div className="absolute inset-0 bg-[#d9edd2]">
              <div className="absolute w-full h-3 bg-white top-3 rotate-[-15deg] border-t border-b border-[#f5a623]" />
              <div className="absolute w-3 h-full bg-white left-4 border-l border-r border-[#f5a623]" />
            </div>
            {/* Highway 280 badge */}
            <div className="relative z-10 w-6 h-5 bg-[#0055b3] rounded-[4px] border border-white flex flex-col items-center justify-center shadow-sm">
              <div className="w-full h-1.5 bg-[#e31837] rounded-t-[3px]" />
              <span className="text-white text-[7px] font-black leading-none mt-0.5">280</span>
            </div>
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Maps</span>
        </button>

        {/* 6. Clock */}
        <button onClick={() => sound.playClick()} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-black shadow-md flex items-center justify-center p-1 active:scale-95 transition-transform border border-white/10">
            <div className="relative w-10 h-10 rounded-full bg-black border border-white/20 flex items-center justify-center">
              {/* Hour hand */}
              <div
                className="absolute w-[2px] h-3 bg-white rounded-full top-2 left-1/2 -translate-x-1/2 origin-bottom"
                style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
              />
              {/* Minute hand */}
              <div
                className="absolute w-[1.5px] h-4 bg-white/90 rounded-full top-1 left-1/2 -translate-x-1/2 origin-bottom"
                style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
              />
              {/* Second hand */}
              <div
                className="absolute w-[1px] h-4 bg-[#ff9500] rounded-full top-1 left-1/2 -translate-x-1/2 origin-bottom"
                style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }}
              />
              <div className="w-1 h-1 bg-[#ff9500] rounded-full z-10" />
            </div>
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Clock</span>
        </button>

        {/* 7. Weather (LIVE USER WEATHER & LOCATION) */}
        <button
          onClick={() => handleAppClick('weather')}
          className="flex flex-col items-center space-y-1 group relative cursor-pointer"
          title={`Weather in ${weather.city}: ${weather.temp}° (${weather.condition})`}
        >
          <div className="w-[50px] h-[50px] rounded-[12px] bg-gradient-to-b from-[#38a5f8] to-[#0d79d6] shadow-md flex flex-col items-center justify-between p-1.5 active:scale-95 transition-transform overflow-hidden relative border border-white/20">
            {/* Live Sun */}
            <div className="absolute top-1 right-1 w-5 h-5 bg-[#ffea00] rounded-full shadow-[0_0_8px_#ffea00]" />
            {/* Cloud */}
            <div className="absolute bottom-2 left-1 z-10">
              <svg className="w-8 h-5 text-white fill-white drop-shadow-sm" viewBox="0 0 24 24">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
            </div>
            {/* Live Temp Badge */}
            <div className="absolute bottom-0.5 right-1.5 z-20 text-[10px] font-bold text-white drop-shadow">
              {weather.loading ? '--' : `${weather.temp}°`}
            </div>
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] flex items-center space-x-0.5">
            <span>Weather</span>
          </span>
        </button>

        {/* 8. News */}
        <button onClick={() => sound.playClick()} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-gradient-to-b from-[#ff334b] to-[#e60023] shadow-md flex items-center justify-center p-2 active:scale-95 transition-transform">
            <div className="w-7 h-7 bg-white rounded flex flex-col p-1 justify-between shadow-sm">
              <div className="w-full h-1 bg-[#ff334b] rounded-full" />
              <div className="w-3/4 h-1 bg-black/60 rounded-full" />
              <div className="w-full h-1 bg-black/40 rounded-full" />
            </div>
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">News</span>
        </button>

        {/* ROW 3 */}
        {/* 9. Home */}
        <button onClick={() => sound.playClick()} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-gradient-to-b from-[#ff9a00] to-[#ff5e3a] shadow-md flex items-center justify-center active:scale-95 transition-transform">
            <svg className="w-6 h-6 text-white fill-white" viewBox="0 0 24 24">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Home</span>
        </button>

        {/* 10. Notes */}
        <button onClick={() => sound.playClick()} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-[#fdfdfd] shadow-md flex flex-col overflow-hidden active:scale-95 transition-transform border border-slate-200">
            <div className="w-full h-2.5 bg-[#f5b300] border-b border-black/10" />
            <div className="flex-1 p-1 space-y-1">
              <div className="w-full h-[1px] bg-slate-300" />
              <div className="w-full h-[1px] bg-slate-300" />
              <div className="w-3/4 h-[1px] bg-slate-300" />
            </div>
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Notes</span>
        </button>

        {/* 11. Stocks */}
        <button onClick={() => sound.playClick()} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-[#111114] shadow-md flex items-center justify-center p-2 relative active:scale-95 transition-transform border border-white/10">
            <div className="absolute inset-y-1 left-3 w-[1px] bg-cyan-400 opacity-60" />
            <svg className="w-7 h-5 text-emerald-400 stroke-current stroke-2 fill-none" viewBox="0 0 30 20">
              <path d="M2 18 L10 10 L16 14 L28 2" />
            </svg>
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Stocks</span>
        </button>

        {/* 12. Reminders */}
        <button onClick={() => sound.playClick()} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-white shadow-md flex flex-col justify-center px-2 py-1.5 space-y-1 active:scale-95 transition-transform">
            {[
              { c: 'bg-blue-500' },
              { c: 'bg-orange-400' },
              { c: 'bg-red-500' },
              { c: 'bg-emerald-500' },
            ].map((d, i) => (
              <div key={i} className="flex items-center space-x-1">
                <div className={`w-1.5 h-1.5 rounded-full ${d.c}`} />
                <div className="w-full h-[1.5px] bg-slate-200 rounded" />
              </div>
            ))}
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Reminders</span>
        </button>

        {/* ROW 4 */}
        {/* 13. TV */}
        <button onClick={() => sound.playClick()} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-black shadow-md flex items-center justify-center p-2 active:scale-95 transition-transform border border-white/10">
            <div className="w-7 h-5 rounded-[4px] border-2 border-white flex items-center justify-center bg-gradient-to-tr from-cyan-600 to-blue-500">
              <div className="w-2 h-2 bg-white/40 rounded-full" />
            </div>
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">TV</span>
        </button>

        {/* 14. App Store */}
        <button onClick={() => sound.playClick()} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-gradient-to-b from-[#18a0fb] to-[#006bd8] shadow-md flex items-center justify-center active:scale-95 transition-transform">
            <span className="text-white text-2xl font-black font-sans tracking-tighter select-none">A</span>
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">App Store</span>
        </button>

        {/* 15. iTunes Store */}
        <button onClick={() => sound.playClick()} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-gradient-to-b from-[#f2479e] to-[#9925e0] shadow-md flex items-center justify-center active:scale-95 transition-transform">
            <svg className="w-6 h-6 text-white fill-white" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">iTunes Store</span>
        </button>

        {/* 16. iBooks */}
        <button onClick={() => sound.playClick()} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-gradient-to-b from-[#ff9f00] to-[#f4511e] shadow-md flex items-center justify-center active:scale-95 transition-transform">
            <svg className="w-6 h-6 text-white fill-white" viewBox="0 0 24 24">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 2v20" />
            </svg>
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">iBooks</span>
        </button>

        {/* ROW 5 */}
        {/* 17. Health */}
        <button onClick={() => sound.playClick()} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-white shadow-md flex items-center justify-center active:scale-95 transition-transform">
            <svg className="w-6 h-6 text-[#ff2d55] fill-[#ff2d55]" viewBox="0 0 24 24">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Health</span>
        </button>

        {/* 18. Wallet */}
        <button onClick={() => sound.playClick()} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-[#1a1a1d] shadow-md flex flex-col justify-end p-1.5 active:scale-95 transition-transform border border-white/10">
            <div className="w-full h-1 bg-cyan-400 rounded-t-sm" />
            <div className="w-full h-1 bg-yellow-400 rounded-t-sm -mt-0.5" />
            <div className="w-full h-1.5 bg-red-500 rounded-t-sm -mt-0.5" />
            <div className="w-full h-4 bg-[#2c2d33] rounded-sm mt-0.5 border border-white/10" />
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Wallet</span>
        </button>

        {/* 19. Settings */}
        <button onClick={() => sound.playClick()} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-gradient-to-b from-[#a0a4ab] via-[#757a82] to-[#595e66] shadow-md flex items-center justify-center active:scale-95 transition-transform border border-black/10">
            <svg className="w-7 h-7 text-[#2b2d31] fill-current" viewBox="0 0 24 24">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
            </svg>
          </div>
          <span className="text-[10px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Settings</span>
        </button>

        {/* 20. QR Engine App (Quick switch to generated matrix preview) */}
        <button onClick={() => handleAppClick('qr')} className="flex flex-col items-center space-y-1">
          <div className="w-[50px] h-[50px] rounded-[12px] bg-black shadow-md flex items-center justify-center active:scale-95 transition-transform border border-[#e4ff1a]/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#e4ff1a]/10" />
            <QRCodeCanvas value={payload} size={30} fgColor="#e4ff1a" bgColor="#000" level="M" />
          </div>
          <span className="text-[10px] text-volt font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">QR Studio</span>
        </button>
      </div>

      {/* Page Indicator Dots */}
      <div className="flex justify-center items-center space-x-1.5 py-1">
        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
      </div>

      {/* Frosted Glass Bottom Dock */}
      <div className="h-[72px] bg-white/45 dark:bg-white/35 backdrop-blur-2xl rounded-[26px] flex items-center justify-between px-3 border border-white/40 shadow-xl">
        {/* Phone */}
        <button onClick={() => sound.playClick()} className="w-[48px] h-[48px] bg-gradient-to-b from-[#4cd964] to-[#28cd41] rounded-[12px] flex items-center justify-center shadow-md active:scale-95 transition-transform">
          <svg className="w-6 h-6 text-white fill-white" viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </button>

        {/* Safari */}
        <button onClick={() => sound.playClick()} className="w-[48px] h-[48px] bg-white rounded-[12px] flex items-center justify-center shadow-md active:scale-95 transition-transform">
          <div className="w-8 h-8 rounded-full border-2 border-[#007aff] flex items-center justify-center relative">
            <div className="w-2.5 h-6 bg-gradient-to-b from-[#ff3b30] to-white rotate-45" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          </div>
        </button>

        {/* Messages */}
        <button onClick={() => sound.playClick()} className="w-[48px] h-[48px] bg-gradient-to-b from-[#4cd964] to-[#28cd41] rounded-[12px] flex items-center justify-center shadow-md active:scale-95 transition-transform">
          <svg className="w-6 h-6 text-white fill-white" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>

        {/* Music */}
        <button onClick={() => sound.playClick()} className="w-[48px] h-[48px] bg-white rounded-[12px] flex items-center justify-center shadow-md active:scale-95 transition-transform">
          <svg className="w-6 h-6 text-[#fa233b] fill-[#fa233b]" viewBox="0 0 24 24">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center py-6 select-none perspective-[1200px] cursor-pointer hover:cursor-grab active:cursor-grabbing">
      {/* 3D iPhone Assembly */}
      <motion.div
        className="relative flex flex-col items-center"
        style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
      >
        {/* Ambient Drop Shadow for 3D realism */}
        <div
          className="absolute inset-0 bg-black/45 blur-2xl rounded-[48px]"
          style={{ transform: 'translateZ(-30px) translateY(12px) scale(0.96)' }}
        />

        {/* iPhone Stainless Steel Chassis Frame (Curved, Polished Edges) */}
        <div className="relative p-[10px] bg-gradient-to-b from-[#e1e2e6] via-[#9da0a8] to-[#6d7078] rounded-[50px] shadow-[0_25px_50px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white/40">
          {/* Inner Black OLED Bezel */}
          <div className="relative p-[4px] bg-black rounded-[42px] overflow-hidden">
            {/* Screen Display Glass */}
            <div className="relative w-[284px] h-[584px] bg-black rounded-[38px] overflow-hidden flex flex-col items-center justify-center shadow-inner">
              
              {/* TOP IPHONE NOTCH (Classic iPhone X / XS / 11 Notch) */}
              <div className="absolute top-0 inset-x-0 h-6 z-50 flex justify-center pointer-events-none">
                <div className="w-[144px] h-6 bg-black rounded-b-[18px] flex items-center justify-center px-3 relative shadow-sm">
                  {/* Speaker Ear Slot */}
                  <div className="w-11 h-1 bg-[#1c1c1f] rounded-full border border-white/5" />
                  {/* Front TrueDepth Camera */}
                  <div className="absolute right-4 w-2.5 h-2.5 rounded-full bg-[#090a10] border border-white/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                  </div>
                </div>
              </div>

              {/* Status Bar (Left & Right of Notch) */}
              <div className="absolute top-2.5 inset-x-5 flex justify-between items-center z-50 text-[11px] font-semibold text-white pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {/* Left: Current Time */}
                <span className="font-sans pl-1 tracking-tight">{timeFormatted}</span>

                {/* Right: Cellular Signal, Wi-Fi, Battery */}
                <div className="flex items-center space-x-1.5 pr-1">
                  {/* 4 Signal Bars */}
                  <div className="flex items-end space-x-[1.5px] h-2.5">
                    <div className="w-[2px] h-[3px] bg-white rounded-[0.5px]" />
                    <div className="w-[2px] h-[5px] bg-white rounded-[0.5px]" />
                    <div className="w-[2px] h-[7px] bg-white rounded-[0.5px]" />
                    <div className="w-[2px] h-[9px] bg-white rounded-[0.5px]" />
                  </div>
                  {/* Wi-Fi Icon */}
                  <svg className="w-3.5 h-3 text-white fill-white" viewBox="0 0 24 24">
                    <path d="M12 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                    <path d="M8.5 13.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M5 10a10 10 0 0 1 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                  {/* Battery Icon */}
                  <div className="w-5 h-2.5 border border-white rounded-[3px] p-[1.5px] flex items-center relative">
                    <div className="w-[85%] h-full bg-white rounded-[1.5px]" />
                    <div className="w-[1.5px] h-[3.5px] bg-white rounded-r-[1px] absolute -right-[2.5px] top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Screen Glass Specular Reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-50" />

              {/* ACTIVE APPS */}
              {activeApp === 'home' && renderHomeScreen()}
              {activeApp === 'weather' && renderWeatherModal()}
              {activeApp === 'camera' && renderCameraApp()}
              {activeApp === 'gallery' && renderGalleryApp()}

              {/* QR ENGINE APP (Interactive Preview with Contained Laser) */}
              {activeApp === 'qr' && (
                <div
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4 transition-colors duration-300"
                  style={{
                    backgroundColor: design.bgColor,
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${design.fgColor}16 0%, transparent 80%)`,
                  }}
                >
                  {/* Top Bar Switch to Home */}
                  <div className="absolute top-12 inset-x-4 flex justify-between items-center z-40">
                    <button
                      onClick={() => handleAppClick('home')}
                      className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 hover:bg-black/60 flex items-center space-x-1 transition-colors"
                    >
                      <span>◀ Home</span>
                    </button>
                    <span className="font-mono text-[10px] text-white/80 font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10">
                      120Hz MATRIX
                    </span>
                  </div>

                  {/* QR Card Container */}
                  <div className="relative z-10 p-4 rounded-[24px] bg-black/10 backdrop-blur-md border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-200 overflow-hidden flex items-center justify-center">
                    <QRCodeCanvas
                      value={payload}
                      size={qrDisplaySize}
                      fgColor={design.fgColor}
                      bgColor={design.bgColor}
                      level={design.level}
                      marginSize={design.margin}
                      className="rounded-lg shadow-sm block"
                    />

                    {/* Laser Optical Scan Beam - Contained strictly within QR Card */}
                    {laserActive && (
                      <motion.div
                        className="absolute inset-x-0 pointer-events-none z-20 flex items-center justify-center"
                        initial={{ top: '6%' }}
                        animate={{
                          top: ['6%', '94%', '6%'],
                          opacity: [0.35, 1, 0.35],
                        }}
                        transition={{
                          duration: 2.6,
                          ease: 'easeInOut',
                          repeat: Infinity,
                        }}
                      >
                        <div className="absolute w-3.5 h-3.5 bg-white rounded-full blur-[2px] opacity-95 shadow-[0_0_8px_#ffffff]" />
                        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#e4ff1a] to-transparent shadow-[0_0_12px_#e4ff1a]" />
                        <div className="absolute w-full h-4 bg-gradient-to-b from-transparent via-[#e4ff1a]/15 to-transparent pointer-events-none" />
                      </motion.div>
                    )}
                  </div>

                  {/* Live OS spec badge */}
                  <div className="absolute bottom-10 font-mono text-[9px] font-bold text-white/60 tracking-wider">
                    TAP HOME BAR TO RETURN
                  </div>
                </div>
              )}

              {/* iOS Home Indicator Bar */}
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveApp('home');
                }}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/70 hover:bg-white rounded-full z-50 mix-blend-difference cursor-pointer transition-colors shadow-sm"
                title="Tap to go Home"
              />
            </div>
          </div>

          {/* Physical Side Buttons on iPhone Steel Frame */}
          {/* Left: Ring/Silent Switch */}
          <div className="absolute left-[-2.5px] top-[75px] w-[3px] h-[18px] bg-[#5a5b5f] rounded-l-sm shadow-inner" />
          {/* Left: Volume Up */}
          <div className="absolute left-[-2.5px] top-[115px] w-[3px] h-[36px] bg-[#5a5b5f] rounded-l-sm shadow-inner" />
          {/* Left: Volume Down */}
          <div className="absolute left-[-2.5px] top-[165px] w-[3px] h-[36px] bg-[#5a5b5f] rounded-l-sm shadow-inner" />
          {/* Right: Power / Side Button */}
          <div className="absolute right-[-2.5px] top-[135px] w-[3px] h-[55px] bg-[#5a5b5f] rounded-r-sm shadow-inner" />
        </div>
      </motion.div>
    </div>
  );
};
