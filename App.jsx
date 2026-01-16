import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { 
  Atom, 
  Info, 
  Activity, 
  Zap, 
  Box,
  Rotate3d,
  ChevronRight,
  FlaskConical,
  Beaker,
  Dna,
  Binary,
  Microscope,
  Cpu,
  Cloud,
  CheckCircle2,
  Github 
} from 'lucide-react';

// --- Firebase Configuration & Initialization ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'elementum-lab-pro';

// --- Data Constants ---
const ELEMENTS = [
  { number: 1, symbol: 'H', name: 'Hydrogen', mass: '1.008', group: 'nonmetal', col: 1, row: 1, shells: [1], config: '1s¹', valency: 1, en: 2.20, melting: 13.99, boiling: 20.27, radius: 37, ionization: 1312, state: 'Gas' },
  { number: 2, symbol: 'He', name: 'Helium', mass: '4.0026', group: 'noble-gas', col: 18, row: 1, shells: [2], config: '1s²', valency: 0, en: null, melting: 0.95, boiling: 4.22, radius: 31, ionization: 2372, state: 'Gas' },
  { number: 3, symbol: 'Li', name: 'Lithium', mass: '6.94', group: 'alkali-metal', col: 1, row: 2, shells: [2, 1], config: '[He] 2s¹', valency: 1, en: 0.98, melting: 453.65, boiling: 1603, radius: 152, ionization: 520, state: 'Solid' },
  { number: 4, symbol: 'Be', name: 'Beryllium', mass: '9.0122', group: 'alkaline-earth', col: 2, row: 2, shells: [2, 2], config: '[He] 2s²', valency: 2, en: 1.57, melting: 1560, boiling: 2742, radius: 112, ionization: 900, state: 'Solid' },
  { number: 5, symbol: 'B', name: 'Boron', mass: '10.81', group: 'metalloid', col: 13, row: 2, shells: [2, 3], config: '[He] 2s² 2p¹', valency: 3, en: 2.04, melting: 2349, boiling: 4200, radius: 82, ionization: 801, state: 'Solid' },
  { number: 6, symbol: 'C', name: 'Carbon', mass: '12.011', group: 'nonmetal', col: 14, row: 2, shells: [2, 4], config: '[He] 2s² 2p²', valency: 4, en: 2.55, melting: 3823, boiling: 4098, radius: 77, ionization: 1086, state: 'Solid' },
  { number: 7, symbol: 'N', name: 'Nitrogen', mass: '14.007', group: 'nonmetal', col: 15, row: 2, shells: [2, 5], config: '[He] 2s² 2p³', valency: 3, en: 3.04, melting: 63.15, boiling: 77.36, radius: 75, ionization: 1402, state: 'Gas' },
  { number: 8, symbol: 'O', name: 'Oxygen', mass: '15.999', group: 'nonmetal', col: 16, row: 2, shells: [2, 6], config: '[He] 2s² 2p⁴', valency: 2, en: 3.44, melting: 54.36, boiling: 90.20, radius: 73, ionization: 1314, state: 'Gas' },
  { number: 9, symbol: 'F', name: 'Fluorine', mass: '18.998', group: 'halogen', col: 17, row: 2, shells: [2, 7], config: '[He] 2s² 2p⁵', valency: 1, en: 3.98, melting: 53.53, boiling: 85.03, radius: 71, ionization: 1681, state: 'Gas' },
  { number: 10, symbol: 'Ne', name: 'Neon', mass: '20.180', group: 'noble-gas', col: 18, row: 2, shells: [2, 8], config: '[He] 2s² 2p⁶', valency: 0, en: null, melting: 24.56, boiling: 27.07, radius: 69, ionization: 2081, state: 'Gas' },
  { number: 11, symbol: 'Na', name: 'Sodium', mass: '22.990', group: 'alkali-metal', col: 1, row: 3, shells: [2, 8, 1], config: '[Ne] 3s¹', valency: 1, en: 0.93, melting: 370.87, boiling: 1156, radius: 186, ionization: 496, state: 'Solid' },
  { number: 12, symbol: 'Mg', name: 'Magnesium', mass: '24.305', group: 'alkaline-earth', col: 2, row: 3, shells: [2, 8, 2], config: '[Ne] 3s²', valency: 2, en: 1.31, melting: 923, boiling: 1363, radius: 160, ionization: 738, state: 'Solid' },
  { number: 26, symbol: 'Fe', name: 'Iron', mass: '55.845', group: 'transition-metal', col: 8, row: 4, shells: [2, 8, 14, 2], config: '[Ar] 3d⁶ 4s²', valency: 2, en: 1.83, melting: 1811, boiling: 3134, radius: 126, ionization: 762, state: 'Solid' },
  { number: 79, symbol: 'Au', name: 'Gold', mass: '196.97', group: 'transition-metal', col: 11, row: 6, shells: [2, 8, 18, 32, 18, 1], config: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', valency: 1, en: 2.54, melting: 1337, boiling: 3129, radius: 144, ionization: 890, state: 'Solid' },
];

const GROUPS = {
  'nonmetal': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
  'noble-gas': 'bg-purple-500/20 text-purple-300 border-purple-500/50',
  'alkali-metal': 'bg-red-500/20 text-red-300 border-red-500/50',
  'alkaline-earth': 'bg-orange-500/20 text-orange-300 border-orange-500/50',
  'metalloid': 'bg-amber-500/20 text-amber-300 border-amber-500/50',
  'halogen': 'bg-blue-500/20 text-blue-300 border-blue-500/50',
  'post-transition-metal': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
  'transition-metal': 'bg-pink-500/20 text-pink-300 border-pink-500/50',
};

// --- Atomic Simulation Component ---
const AtomicVisualizer = ({ shells, isMolecular = false, atoms = [] }) => {
  const mountRef = useRef(null);
  const [threeLoaded, setThreeLoaded] = useState(false);

  useEffect(() => {
    if (window.THREE) { setThreeLoaded(true); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = () => setThreeLoaded(true);
    document.head.appendChild(script);
  }, []);
  
  useEffect(() => {
    if (!threeLoaded || !mountRef.current || !window.THREE) return;
    const THREE = window.THREE;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00ffff, 1.5, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const createAtomGroup = (x, y, z, shellData, color = 0xff3333) => {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), new THREE.MeshPhongMaterial({ color }));
      group.add(nucleus);
      const anims = [];
      shellData.forEach((count, i) => {
        const radius = (i + 1) * 0.8;
        const orbit = new THREE.Mesh(new THREE.RingGeometry(radius - 0.01, radius + 0.01, 64), new THREE.MeshBasicMaterial({ color: 0x334455, transparent: true, opacity: 0.3, side: THREE.DoubleSide }));
        orbit.rotation.x = Math.PI / 2;
        group.add(orbit);
        const eGroup = new THREE.Group();
        for(let e=0; e<count; e++) {
          const electron = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshPhongMaterial({ color: 0x00ffff }));
          const angle = (e / count) * Math.PI * 2;
          electron.position.x = Math.cos(angle) * radius;
          electron.position.z = Math.sin(angle) * radius;
          eGroup.add(electron);
        }
        group.add(eGroup);
        anims.push({ group: eGroup, speed: 0.02 / (i+1) });
      });
      scene.add(group);
      return { group, anims };
    };

    let activeItems = [];
    if (isMolecular && atoms.length) {
      atoms.forEach((a, i) => {
        const x = (i - (atoms.length-1)/2) * 2.5;
        activeItems.push(createAtomGroup(x, 0, 0, a.shells, i % 2 === 0 ? 0xff4444 : 0x44ff44));
      });
    } else {
      activeItems.push(createAtomGroup(0, 0, 0, shells));
    }

    camera.position.z = 6;
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      activeItems.forEach(a => {
        a.anims.forEach(s => s.group.rotation.y += s.speed);
        a.group.rotation.y += 0.005;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [shells, threeLoaded, isMolecular, atoms]);

  return <div ref={mountRef} className="w-full h-[350px] bg-slate-950/50 rounded-2xl overflow-hidden border border-white/5" />;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedElement, setSelectedElement] = useState(ELEMENTS[0]);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [view, setView] = useState('TABLE'); 
  const [labBasket, setLabBasket] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // --- Auth & Session Initialization ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) { console.error("Auth Failed", err); }
    };
    initAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  // --- Cloud Data Listener ---
  useEffect(() => {
    if (!user) return;
    const labDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'lab-state', 'current');
    
    const unsubscribe = onSnapshot(labDoc, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.labBasket) setLabBasket(data.labBasket);
        if (data.view) setView(data.view);
        if (data.selectedNumber) {
          const el = ELEMENTS.find(e => e.number === data.selectedNumber);
          if (el) setSelectedElement(el);
        }
      }
    }, (err) => {
      // Basic silent error handling for Firestore listeners
    });

    return () => unsubscribe();
  }, [user]);

  // --- Cloud Data Persistence ---
  const saveToCloud = async (newData) => {
    if (!user) return;
    setIsSyncing(true);
    const labDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'lab-state', 'current');
    try {
      await setDoc(labDoc, newData, { merge: true });
    } catch (err) { console.error("Save Error", err); }
    setTimeout(() => setIsSyncing(false), 500);
  };

  const activeElement = selectedElement || hoveredElement;

  const handleElementSelect = (el) => {
    setSelectedElement(el);
    saveToCloud({ selectedNumber: el.number });
  };

  const addToLab = (el) => {
    const newBasket = [...labBasket, { ...el, id: Date.now() }].slice(-3);
    setLabBasket(newBasket);
    saveToCloud({ labBasket: newBasket });
  };

  const toggleView = (v) => {
    setView(v);
    saveToCloud({ view: v });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* --- Sync Indicator --- */}
      <div className="fixed top-6 right-8 z-[60] flex items-center gap-2 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">
        {isSyncing ? (
          <><Cloud className="text-cyan-400 animate-pulse" size={14} /> Cloud Syncing...</>
        ) : (
          <><CheckCircle2 className="text-emerald-400" size={14} /> Synced to Lab</>
        )}
      </div>

      <div className="fixed left-0 top-0 h-full w-20 border-r border-white/5 bg-slate-950/50 backdrop-blur-xl z-50 flex flex-col items-center py-8 justify-between">
        <div className="flex flex-col items-center gap-8">
          <div className="p-3 bg-cyan-600 rounded-2xl shadow-lg shadow-cyan-500/40 cursor-pointer" onClick={() => toggleView('TABLE')}>
            <FlaskConical size={24} className="text-white" />
          </div>
          <div className="flex flex-col gap-6 mt-4">
            <button onClick={() => toggleView('TABLE')} className={`p-3 rounded-xl transition-all ${view === 'TABLE' ? 'bg-white/10 text-cyan-400' : 'text-slate-600 hover:text-white'}`}><Atom size={24} /></button>
            <button onClick={() => toggleView('MOLECULE')} className={`p-3 rounded-xl transition-all ${view === 'MOLECULE' ? 'bg-white/10 text-cyan-400' : 'text-slate-600 hover:text-white'}`}><Binary size={24} /></button>
          </div>
        </div>
        
        <div className="pb-8">
          {/* Updated GitHub link for the user's specific repository */}
          <a 
            href="https://github.com/your-username/elementum-lab" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-xl text-slate-600 hover:text-white hover:bg-white/5 transition-all block"
            title="View on GitHub"
          >
            <Github size={24} />
          </a>
        </div>
      </div>

      <main className="pl-24 pr-8 py-8">
        {view === 'TABLE' ? (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in duration-500">
            <div className="xl:col-span-8 space-y-8">
              <header>
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Elementum</h1>
                <p className="text-slate-400 font-medium">Cloud-Synced Periodic Atlas & Spectral Database</p>
              </header>

              <div className="bg-slate-900/20 p-8 rounded-[2.5rem] border border-white/5">
                <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(18, minmax(35px, 1fr))', gridTemplateRows: 'repeat(7, 60px)' }}>
                  {ELEMENTS.map((el) => (
                    <button
                      key={el.number}
                      onClick={() => handleElementSelect(el)}
                      onMouseEnter={() => setHoveredElement(el)}
                      onMouseLeave={() => setHoveredElement(null)}
                      className={`relative border transition-all duration-300 flex flex-col items-center justify-center rounded-lg ${GROUPS[el.group] || 'bg-slate-900 border-slate-800'} ${selectedElement?.number === el.number ? 'scale-110 z-20 border-white ring-4 ring-white/10 shadow-2xl' : 'hover:scale-105'}`}
                      style={{ gridColumn: el.col, gridRow: el.row }}
                    >
                      <span className="absolute top-0.5 left-1 text-[8px] font-black opacity-40">{el.number}</span>
                      <span className="text-lg font-black">{el.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="xl:col-span-4">
              <div className="bg-slate-900/40 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-md sticky top-8">
                <div className={`p-8 ${GROUPS[activeElement.group]} border-b border-white/10`}>
                  <h2 className="text-7xl font-black text-white">{activeElement.symbol}</h2>
                  <p className="text-2xl font-bold opacity-80">{activeElement.name}</p>
                </div>
                <div className="p-8 space-y-8">
                  <AtomicVisualizer shells={activeElement.shells} />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase">Electronegativity</p>
                      <p className="text-2xl font-black">{activeElement.en || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase">Radius (pm)</p>
                      <p className="text-2xl font-black">{activeElement.radius}</p>
                    </div>
                  </div>
                  <button onClick={() => addToLab(activeElement)} className="w-full bg-white text-slate-950 font-black uppercase py-5 rounded-2xl transition-all hover:bg-cyan-400 flex items-center justify-center gap-3">
                    Load into Lab Analysis <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="text-center">
              <h2 className="text-4xl font-black text-white uppercase mb-4">Molecular Forge</h2>
              <p className="text-slate-400">Combine elements to visualize theoretical covalent bonding.</p>
            </header>
            <div className="bg-slate-900/50 rounded-[3rem] p-12 border border-white/10 min-h-[500px]">
              {labBasket.length > 0 ? (
                <div className="w-full">
                  <AtomicVisualizer isMolecular={true} atoms={labBasket} />
                  <div className="mt-8 flex justify-center gap-4">
                    {labBasket.map(b => (
                      <div key={b.id} className="bg-slate-950 p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
                        <p className="text-3xl font-black text-white">{b.symbol}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase">{b.name}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => {setLabBasket([]); saveToCloud({labBasket: []})}} className="mx-auto block mt-8 text-xs font-black uppercase text-rose-500">Clear Forge</button>
                </div>
              ) : (
                <div className="text-center opacity-40 py-20">
                  <FlaskConical size={80} className="mx-auto text-slate-600 mb-6" />
                  <p className="text-xl font-bold uppercase tracking-widest text-slate-500">Forge Empty</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
