import React from 'react';
import { X, MapPin, Thermometer, ShieldAlert, Footprints } from 'lucide-react';

interface ApertureData {
  id: string;
  name: string;
  elevation: string;
  temperature: string;
  status: string;
  description: string;
  occupants: string[];
  hazards: string[];
}

interface ApertureInspectorModalProps {
  apertureId: string | null;
  onClose: () => void;
  bridgeStatus: string;
  ambientTemp: number;
}

export const ApertureInspectorModal: React.FC<ApertureInspectorModalProps> = ({
  apertureId,
  onClose,
  bridgeStatus,
  ambientTemp,
}) => {
  if (!apertureId) return null;

  const dataMap: Record<string, ApertureData> = {
    magma_dais: {
      id: 'magma_dais',
      name: 'Central Magma Dais',
      elevation: '+12.0 meters',
      temperature: `${ambientTemp + 450}°C (Convective Core)`,
      status: 'HIGHLY VOLATILE',
      description:
        'A raised basalt altar elevated above the subterranean magma lake. The ancient primordial dragon Ignis-Vorax coils here, anchoring its body to the subterranean heat conduits.',
      occupants: ['Ignis-Vorax (The Ancient Dragon)'],
      hazards: ['Superheated Convection', 'Draconic Stomp', 'Magma Geysers'],
    },
    basalt_bridge: {
      id: 'basalt_bridge',
      name: 'Basalt Arch Bridge',
      elevation: '+4.5 meters',
      temperature: '620°C',
      status: bridgeStatus,
      description:
        'A narrow natural arch of cooled volcanic glass spanning the fiery abyss between the threshold and the dais. Fragile against sudden seismic shocks or magma surges.',
      occupants: ['None currently (Transitory Corridor)'],
      hazards: ['Thermal Degradation', 'Narrow Footing', 'Submersion Risk'],
    },
    threshold_arch: {
      id: 'threshold_arch',
      name: 'Threshold of Despair (Entry Arch)',
      elevation: '+2.0 meters',
      temperature: `${ambientTemp}°C`,
      status: 'STABLE ANCHOR',
      description:
        'The massive cyclopean stone archway opening into the subterranean sanctum. Relatively shielded from direct flame, providing Kaelen with an initial tactical anchor.',
      occupants: ['Kaelen (The Wanderer)'],
      hazards: ['Fissure Expansion', 'Falling Basalt Shards'],
    },
    magma_trench: {
      id: 'magma_trench',
      name: 'Molten Abyssal Trench',
      elevation: '-18.0 meters',
      temperature: '1,450°C',
      status: 'RAPID FLOW',
      description:
        'A churning subterranean river of pure liquid rock circulating beneath the entire sanctum chamber. Connects directly to the planetary mantle.',
      occupants: ['None (Lethal Zone)'],
      hazards: ['Instant Thermal Disintegration', 'Sulfuric Fume Ignition'],
    },
  };

  const current = dataMap[apertureId] || dataMap.magma_dais;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border-4 border-black p-5 shadow-[8px_8px_0px_#000000] relative animate-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b-3 border-black pb-3 mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-600" />
            <div>
              <span className="bg-black text-amber-300 font-mono text-[10px] font-black px-1.5 py-0.5 uppercase tracking-wider">
                TOPOLOGICAL APERTURE
              </span>
              <h3 className="text-lg font-black uppercase tracking-tight text-zinc-950 mt-0.5">
                {current.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-200 border-2 border-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Telemetry Strip */}
        <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-xs">
          <div className="bg-zinc-50 border-2 border-black p-2">
            <span className="text-[10px] text-zinc-500 uppercase block font-bold">Elevation:</span>
            <span className="font-extrabold text-zinc-900 tabular-nums">{current.elevation}</span>
          </div>
          <div className="bg-zinc-50 border-2 border-black p-2">
            <span className="text-[10px] text-zinc-500 uppercase block font-bold">Temperature:</span>
            <span className="font-extrabold text-rose-600 tabular-nums">{current.temperature}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed text-zinc-800 font-serif mb-4 bg-amber-50/70 p-3 border border-amber-200">
          {current.description}
        </p>

        {/* Occupants & Hazards */}
        <div className="space-y-3 font-mono text-xs mb-4">
          <div>
            <div className="text-[10px] font-bold uppercase text-zinc-500 mb-1 flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5" /> Present Occupants:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {current.occupants.map((occ, i) => (
                <span
                  key={i}
                  className="bg-zinc-900 text-white px-2 py-0.5 font-bold border border-black"
                >
                  {occ}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase text-rose-700 mb-1 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Active Hazards:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {current.hazards.map((haz, i) => (
                <span
                  key={i}
                  className="bg-rose-100 text-rose-900 border border-rose-300 px-2 py-0.5 font-bold"
                >
                  ⚠️ {haz}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 border-t-2 border-black flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-black text-amber-300 font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            DISMISS INSPECTOR
          </button>
        </div>
      </div>
    </div>
  );
};
