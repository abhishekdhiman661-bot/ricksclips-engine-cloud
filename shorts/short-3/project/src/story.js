import words from "./words.js";

export default {
  seed: 1925,
  words,
  light: "golden",
  build({ W, kit, mat, glow, cast, fx, makeLook, rand, clock, aim, aerial, THREE, makePalette, tintLight, buildSet, prop, dress, lights, LIGHTS }) {
    const { at, end } = clock;

    // --- Palettes ---
    const vaultPal = makePalette(rand.fork(10), { family: "amber", accent: "orange" });
    const prisonPal = makePalette(rand.fork(20), { family: "indigo", accent: "teal" });
    const londonPal = makePalette(rand.fork(30), { family: "blue", accent: "amber" });
    const palacePal = makePalette(rand.fork(40), { family: "olive", accent: "red" });

    // --- Environment / Ground ---
    kit.ground(W, { kind: "slabs", color: vaultPal.floor });
    kit.hills(W, { color: "#312e81", dist: 75 });

    // Grand Bank Façade (Banco de Portugal / London Waterlow Office)
    kit.house(W, {
      x: 0, z: -10, ry: 0, w: 26, d: 8, h: 8,
      wall: "stone", wallColor: "#cbd5e1",
      roof: "tiles", roofColor: "#0f172a",
      trim: "#f59e0b",
      sign: "BANCO DE PORTUGAL"
    });

    // Paved Street & Columns
    kit.path(W, [-22, 5], [22, 5], { width: 3.2, kind: "stone", color: "#64748b" });

    // Stacks of 100% Genuine Banknotes
    const cashStackGroup = new THREE.Group();
    const cashMat = mat("plaster", { color: "#86efac" });
    const cashGoldMat = mat("wood", { color: "#eab308" });

    for (let i = -1.2; i <= 1.2; i += 0.5) {
      for (let j = -1.2; j <= 1.2; j += 0.5) {
        const h = Math.max(0.3, 1.6 - Math.sqrt(i * i + j * j) * 0.7);
        const stack = kit.box(0.42, h, 0.42, (i + j) % 2 === 0 ? cashMat : cashGoldMat, { x: i, y: h / 2, z: j });
        cashStackGroup.add(stack);
      }
    }
    cashStackGroup.position.set(3.5, 0, 1.5);
    W.add(cashStackGroup, { name: "cashStacks" });

    // Hero Prop: Industrial Banknote Printing Press with Rolling Cylinders
    const pressGroup = new THREE.Group();
    const castIronMat = mat("stone", { color: "#1e293b" });
    const steelMat = mat("wood", { color: "#94a3b8" });

    // Frame
    const base = kit.box(2.2, 0.4, 2.8, castIronMat, { x: 0, y: 0.2, z: 0 });
    pressGroup.add(base);

    // Rollers
    const roller1 = kit.cyl(0.35, 0.35, 2.0, steelMat, { x: 0, y: 1.1, z: -0.5, ry: Math.PI / 2 });
    const roller2 = kit.cyl(0.35, 0.35, 2.0, steelMat, { x: 0, y: 1.1, z: 0.5, ry: Math.PI / 2 });
    pressGroup.add(roller1);
    pressGroup.add(roller2);

    // Paper feed sheet
    const paperSheet = kit.box(1.8, 0.05, 2.2, cashMat, { x: 0, y: 1.15, z: 0 });
    pressGroup.add(paperSheet);

    pressGroup.position.set(-3.5, 0, 2);
    W.add(pressGroup, { name: "printingPress" });

    // --- Cast ---
    // Artur Alves dos Reis (Charming 28-year-old gentleman swindler)
    const artur = cast.add({
      name: "artur",
      look: makeLook(rand.fork(105), "adult", {
        fem: false,
        skin: "#fcd34d",
        hair: "#1c1917",
        hairStyle: "short",
        outfit: "suit",
        top: "#0f172a",
        hat: "bowler",
        hatColor: "#020617",
        shoes: "#18181b",
        mustache: true,
        build: 1.05
      }),
      pos: [-0.8, 4.0],
      h: 1.78
    });

    // British Printing Executive (Waterlow & Sons Chairman)
    const executive = cast.add({
      name: "executive",
      look: makeLook(rand.fork(210), "elder", {
        fem: false,
        skin: "#fed7aa",
        hair: "#e2e8f0",
        hat: "tophat",
        hatColor: "#172554",
        outfit: "coat",
        top: "#1e3a8a",
        shoes: "#020617",
        glasses: true,
        build: 1.1
      }),
      pos: [2.0, 4.0],
      h: 1.82
    });

    // Bank Clerk / Investigator
    const clerk = cast.add({
      name: "clerk",
      look: makeLook(rand.fork(315), "adult", {
        fem: false,
        skin: "#fde68a",
        hair: "#78350f",
        hairStyle: "short",
        outfit: "vest",
        top: "#475569",
        shoes: "#334155",
        glasses: true,
        build: 0.95
      }),
      pos: [0, 9],
      h: 1.72
    });

    // Initial character visibility
    executive.hide(0);
    clerk.hide(0);

    // --- Acting Timeline ---
    // Scene 1: Hook - Golden banknotes in vault
    artur.face(0, "smug").arms(0, "hold");
    fx.add("burst", 0.5, 2.5, [3.5, 1.8, 1.5], { size: 1.2, color: "#eab308" });

    // Scene 2: Prison cell revelation
    const tPrison = at("prison", 10) || 12.0;
    artur.face(tPrison, "thinking").arms(tPrison, "think");

    // Scene 3: Forging secret contract & gold seals
    const tContract = at("contract", 22) || 24.0;
    artur.face(tContract, "grin").arms(tContract, "reach");
    fx.add("stars", tContract, tContract + 2.0, [-0.8, 2.4, 4.0], { size: 0.9, color: "#f59e0b" });

    // Scene 4: Pitching to London Waterlow Chairman
    const tLondon = at("London", 38) || 40.0;
    executive.show(tLondon - 0.5);
    executive.face(tLondon, "surprised").arms(tLondon, "point");
    artur.face(tLondon, "smug").arms(tLondon, "hips");

    // Scene 5: Loading government plates & printing money
    const tPrinters = at("printers", 54) || 57.0;
    executive.face(tPrinters, "happy").arms(tPrinters, "clap");
    artur.face(tPrinters, "grin").arms(tPrinters, "wave");
    fx.emit("steam", tPrinters, tPrinters + 4.0, [-3.5, 1.2, 2], { size: 0.3, rise: 1.2, count: 12 });

    // Scene 6: Suitcases of genuine cash & grand bank opening
    const tSuitcases = at("suitcases", 72) || 75.0;
    executive.hide(tSuitcases);
    artur.face(tSuitcases, "laugh").arms(tSuitcases, "armsUp");
    fx.add("burst", tSuitcases, tSuitcases + 2.0, [0, 2.5, 4], { size: 1.4, color: "#22c55e" });

    // Scene 7: Bank clerk notices duplicate serial numbers
    const tClerk = at("clerk", 92) || 95.0;
    clerk.show(tClerk - 0.5);
    clerk.face(tClerk, "shocked").arms(tClerk, "point");
    artur.face(tClerk, "worried").arms(tClerk, "facepalm");
    fx.add("exclaim", tClerk + 1.0, tClerk + 2.8, [0, 2.4, 9], { size: 0.8, color: "#ef4444" });

    // Scene 8: Bonfire furnace & government burning the currency
    const tBurn = at("burn", 106) || 108.0;
    clerk.hide(tBurn);
    artur.face(tBurn, "shocked").arms(tBurn, "hold");
    fx.emit("smoke", tBurn, tBurn + 4.5, [0, 0.5, 5], { size: 0.5, rise: 1.8, count: 20 });

    // --- Camera Timeline ---
    const cameraKeys = [
      // 01: Hook - Money stack overview
      { t: 0, pos: [2.5, 2.8, 6.0], look: [3.0, 1.2, 2.0], light: "golden", move: "push", fov: 42 },

      // 02: Prison cell scheme
      { t: tPrison - 1.0, pos: [-0.8, 2.0, 6.8], look: [-0.8, 1.5, 4.0], light: "night", move: "push", fov: 36 },

      // 03: Forging signatures & gold seals
      { t: tContract - 1.0, pos: [-0.8, 1.8, 2.5], look: [-0.8, 1.4, 1.2], light: "golden", move: "push", fov: 38 },

      // 04: London boardroom presentation
      { t: tLondon - 1.0, pos: [0.6, 2.2, 7.5], look: [0.6, 1.6, 4.0], light: "interior", move: "push", fov: 40 },

      // 05: Industrial printing press in action
      { t: tPrinters - 1.0, pos: [-3.5, 2.5, 5.8], look: [-3.5, 1.3, 2.0], light: "day", move: "pull", fov: 44 },

      // 06: Grand bank lobby & riches
      { t: tSuitcases - 0.5, pos: [0, 3.2, 9.5], look: [0, 1.6, 4.0], light: "golden", move: "pull", fov: 42 },

      // 07: Duplicate serial number confrontation
      { t: tClerk - 0.5, pos: [0, 2.4, 12.5], look: [0, 1.6, 9.0], light: "day", move: "push", fov: 36 },

      // 08: Burning currency bonfire finale
      { t: tBurn - 0.5, pos: [0, 3.8, 10.0], look: [0, 1.4, 4.0], light: "golden", move: "pull", fov: 44 }
    ];

    return {
      camera: cameraKeys,
      kicks: [
        { t: 0.5, amp: 0.18 },
        { t: tSuitcases, amp: 0.2 },
        { t: tClerk, amp: 0.22 },
        { t: tBurn, amp: 0.25 }
      ]
    };
  }
};
