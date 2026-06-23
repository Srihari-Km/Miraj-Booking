/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, TrendingUp, ShieldAlert, Cpu, Network, Signal, AlertTriangle, Check, RefreshCw, Server } from 'lucide-react';
import { MOCK_OPERATIONS_ANALYTICS, MOCK_THEATER_OCCUPANCY } from '../data/mockData';
import MirajLogo from './MirajLogo';

interface ManagerDashboardProps {
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export default function ManagerDashboard({ onClose, theme = 'dark' }: ManagerDashboardProps) {
  const isLight = theme === 'light';
  const [failoverTriggered, setFailoverTriggered] = useState(false);
  const [showFailoverToast, setShowFailoverToast] = useState(false);
  const [simulationActive, setSimulationActive] = useState(false);

  const handleTriggerFailover = () => {
    setSimulationActive(true);
    
    // Simulate brief outage delay (800ms) before the automatic backup SD-WAN router recovers sessions
    setTimeout(() => {
      setFailoverTriggered(true);
      setShowFailoverToast(true);
      setSimulationActive(false);

      // Auto dismiss success toast after 8 seconds so the manager can read the metrics fully
      setTimeout(() => {
        setShowFailoverToast(false);
      }, 8000);
    }, 800);
  };

  const handleResetNetwork = () => {
    setFailoverTriggered(false);
    setShowFailoverToast(false);
  };

  // Precise SVG dimensions for the custom Booking Velocity Curve chart
  const paddingX = 40;
  const paddingY = 30;
  const width = 600;
  const height = 180;

  // Max values to scale coordinates properly
  const maxOccupancy = 100;
  const maxVelocity = 70;

  // Generate path strings for live SVG charts
  const pointsCount = MOCK_OPERATIONS_ANALYTICS.length;
  const stepX = (width - paddingX * 2) / (pointsCount - 1);

  // Generate occupancy line coordinates list
  const occupancyPoints = MOCK_OPERATIONS_ANALYTICS.map((item, index) => {
    const x = paddingX + index * stepX;
    const y = height - paddingY - (item.occupancy / maxOccupancy) * (height - paddingY * 2);
    return { x, y, val: item.occupancy, label: item.timeSlot };
  });

  // Generate velocity line coordinates list
  const velocityPoints = MOCK_OPERATIONS_ANALYTICS.map((item, index) => {
    const x = paddingX + index * stepX;
    const y = height - paddingY - (item.velocity / maxVelocity) * (height - paddingY * 2);
    return { x, y, val: item.velocity, label: item.timeSlot };
  });

  const makePathString = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  };

  const makeAreaPathString = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    const baseLineY = height - paddingY;
    const path = makePathString(points);
    return `${path} L ${points[points.length - 1].x} ${baseLineY} L ${points[0].x} ${baseLineY} Z`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative" id="operations-hub-container">
      
      {/* Toast Failover Success Alert */}
      {showFailoverToast && (
        <div 
          className="fixed top-20 right-4 sm:right-8 z-50 max-w-md bg-zinc-950 border-2 border-emerald-500 rounded-2xl p-4 shadow-[0_10px_40px_rgba(16,185,129,0.25)] animate-in slide-in-from-right duration-300 text-left"
          id="failover-telemetry-toast"
        >
          <div className="flex gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-500/15 border border-emerald-500/35 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-emerald-400 uppercase tracking-widest font-mono">SD-WAN SECURE ENCLAVE</h5>
              {/* EXACT words requested by user */}
              <p className="text-xs text-white leading-relaxed mt-1">
                Primary MPLS link down. Automatically shifted traffic to encrypted backup broadband route. Zero customer sessions dropped.
              </p>
              
              <button 
                onClick={() => setShowFailoverToast(false)}
                className="mt-2 text-[10px] text-zinc-500 hover:text-white font-mono uppercase font-bold"
              >
                Dismiss Telemetry Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Hub Dashboard Header */}
      <div className="mb-8 border-b border-zinc-900 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-xl">
            <Cpu className="h-6 w-6 text-red-500 animate-pulse" />
          </div>

          <div>
            {/* requested: Displayed as "Miraj Operations Hub" in the internal analytics view. */}
            <div className="flex items-center gap-1.5">
              <MirajLogo size="sm" variant="gold" />
              <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase font-mono pl-1">
                OPERATIONS LINK
              </span>
            </div>
            
            <h1 className="text-3xl font-black text-white uppercase tracking-tight mt-1" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Miraj Operations Hub
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Enterprise monitoring module for local theater administrators • live POS terminal diagnostics
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors self-start md:self-auto"
        >
          Exit Operations Hub
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Section: Live Active Show Occupancy Rates */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 text-left shadow-xl h-full">
            <h3 className="text-sm font-black text-zinc-300 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Server className="h-4.5 w-4.5 text-amber-500" />
              <span>Auditorium Load Levels</span>
            </h3>

            <div className="flex flex-col gap-5">
              {MOCK_THEATER_OCCUPANCY.map((theater, idx) => {
                // Dynamic colors for high occupancy warnings
                const isHigh = theater.occupancyRate >= 80;
                const barColor = isHigh ? 'bg-amber-500' : 'bg-red-500';
                
                return (
                  <div key={idx} className="flex flex-col gap-1.5" id={`occupancy-item-${idx}`}>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-zinc-100">{theater.movieTitle}</span>
                      <span className="font-mono text-zinc-400">
                        {theater.seatsBooked}/{theater.totalSeats} seats
                      </span>
                    </div>

                    <div className="relative w-full h-2.5 rounded-full bg-zinc-900 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${barColor} transition-all duration-1000`} 
                        style={{ width: `${theater.occupancyRate}%` }} 
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-500">
                      <span>POS TERM #{100+idx}</span>
                      <span className={`${isHigh ? 'text-amber-500' : 'text-red-400'}`}>
                        {theater.occupancyRate}% Capacitated
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl bg-zinc-900/50 p-4 border border-zinc-900 text-xs text-zinc-400 flex flex-col gap-2">
              <div className="flex justify-between font-mono">
                <span>Active Terminal Count:</span>
                <span className="text-white">4 Terminals</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Total Circuit Load:</span>
                <span className="text-white">76.2% Booking Cap</span>
              </div>
            </div>

          </div>
        </div>

        {/* Middle/Right Section: Interactive Line Graph (Booking Velocity Spikes) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 text-left shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h3 className="text-sm font-black text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="h-4.5 w-4.5 text-amber-500" />
                  <span>Interactive Booking Velocity</span>
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Dual-line metrics comparing velocity spikes (tickets/min) against load percent loads
                </p>
              </div>

              {/* Legend */}
              <div className="flex gap-4 text-[10px] font-mono">
                <div className="flex items-center gap-1.5 text-red-500">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Velocity (Txs/Min)</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-500">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Occupancy %</span>
                </div>
              </div>
            </div>

            {/* Pristine Responsive SVG graph plotting mathematically drawn points */}
            <div className="relative w-full overflow-hidden bg-zinc-950/50 rounded-xl p-2 border border-zinc-900" id="velocity-svg-wrapper">
              <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-auto text-zinc-400"
              >
                {/* Grid guidelines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const y = paddingY + ratio * (height - paddingY * 2);
                  return (
                    <line 
                      key={i} 
                      x1={paddingX} 
                      y1={y} 
                      x2={width - paddingX} 
                      y2={y} 
                      stroke="#18181b" 
                      strokeWidth="1" 
                    />
                  );
                })}

                {/* Plot Occupancy Area & Line */}
                <path 
                  d={makeAreaPathString(occupancyPoints)} 
                  fill="rgba(229, 169, 59, 0.04)" 
                />
                <path 
                  d={makePathString(occupancyPoints)} 
                  fill="none" 
                  stroke="#E5A93B" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />

                {/* Plot Velocity Area & Line */}
                <path 
                  d={makeAreaPathString(velocityPoints)} 
                  fill="rgba(239, 68, 68, 0.04)" 
                />
                <path 
                  d={makePathString(velocityPoints)} 
                  fill="none" 
                  stroke="#EF4444" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />

                {/* Plot Coordinates Circles and Labels */}
                {occupancyPoints.map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.y} r="3" fill="#E5A93B" />
                    {/* Time Slot Labels at the bottom axis */}
                    <text 
                      x={pt.x} 
                      y={height - 10} 
                      fill="#71717a" 
                      fontSize="8" 
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}

                {velocityPoints.map((pt, idx) => (
                  <circle key={idx} cx={pt.x} cy={pt.y} r="3.5" fill="#EF4444" />
                ))}
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 text-[10px] sm:text-xs">
              <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-3 text-left">
                <span className="text-zinc-500 block">PEAK TICKETING SPIKE</span>
                <span className="text-[14px] font-black font-mono text-zinc-100 block mt-1">61 Tickets/Min</span>
                <span className="text-zinc-500">Occurred at slot 07:00 PM</span>
              </div>
              <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-3 text-left">
                <span className="text-zinc-500 block">AVERAGE SYSTEM VELOCITY</span>
                <span className="text-[14px] font-black font-mono text-zinc-100 block mt-1">28.4 Tx/Min</span>
                <span className="text-zinc-500">99.8% POS pipeline SLA</span>
              </div>
            </div>

          </div>

          {/* network outage / Failover simulation widget constraint */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 text-left shadow-xl" id="failover-module">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-black text-sm text-zinc-200 flex items-center gap-2 uppercase tracking-wide">
                  <Network className="h-4.5 w-4.5 text-red-500" />
                  <span>SD-WAN Failover Control</span>
                </h4>
                <p className="text-xs text-zinc-500 leading-normal mt-1">
                  Evaluate network routing failover logic by dropping simulated MPLS backend tunnels.
                </p>
              </div>

              {failoverTriggered ? (
                <button
                  onClick={handleResetNetwork}
                  className="rounded-xl border border-zinc-805 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-350 hover:text-white transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Restore Primary MPLS</span>
                </button>
              ) : null}
            </div>

            {/* Virtual Network Map Topology visualization */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
              {/* Primary Tunnel Status */}
              <div className={`p-3.5 rounded-xl border ${failoverTriggered ? 'border-red-500/10 bg-red-950/5 text-zinc-650' : 'border-[#E5A93B]/20 bg-amber-500/5 text-zinc-350'}`}>
                <div className="flex items-center justify-between text-[10px] font-black font-mono">
                  <span>TUNNEL Alpha (MPLS)</span>
                  {failoverTriggered ? (
                    <span className="text-red-500">CLOSED DOWN</span>
                  ) : (
                    <span className="text-amber-500 animate-pulse">ACTIVE LINK</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Signal className={`h-5 w-5 ${failoverTriggered ? 'text-zinc-700' : 'text-amber-500'}`} />
                  <span className="text-xs font-bold font-sans">Corporate POS Backbone</span>
                </div>
              </div>

              {/* Backup SD-WAN Status */}
              <div className={`p-3.5 rounded-xl border ${failoverTriggered ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-zinc-800 bg-zinc-950 text-zinc-500'}`}>
                <div className="flex items-center justify-between text-[10px] font-black font-mono">
                  <span>TUNNEL Beta (SD-WAN)</span>
                  {failoverTriggered ? (
                    <span className="text-emerald-500 animate-pulse">FAILOVER ACTIVE</span>
                  ) : (
                    <span>IDLE standby</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Network className={`h-5 w-5 ${failoverTriggered ? 'text-emerald-400' : 'text-zinc-600'}`} />
                  <span className="text-xs font-bold font-sans">Encrypted Broadband Tunnel</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                disabled={simulationActive || failoverTriggered}
                onClick={handleTriggerFailover}
                className={`w-full rounded-xl py-3.5 text-xs font-black uppercase tracking-wider text-center transition-all ${
                  failoverTriggered
                    ? 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-500 text-white cursor-pointer active:scale-95'
                }`}
                id="trigger-failover-button"
              >
                {simulationActive ? 'Dropping MPLS link & forcing failover IP routings...' : 'Simulate Network Outage / Trigger SD-WAN Failover Protection'}
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
