import words from "./words.js";

export default {
  seed: 1910,
  words,
  light: "day",
  build({ W, kit, mat, glow, cast, fx, makeLook, rand, clock, aim, aerial, THREE, makePalette, tintLight, buildSet, prop, dress, lights, LIGHTS }) {
    const { at, end } = clock;

    // --- Palettes ---
    const harborPal = makePalette(rand.fork(10), { family: "blue", accent: "orange" });
    const stormPal = makePalette(rand.fork(20), { family: "indigo", accent: "teal" });
    const sunsetPal = makePalette(rand.fork(30), { family: "amber", accent: "red" });

    // --- Environment / Water & Harbor Pier ---
    const waterMat = mat("plaster", { color: "#0284c7" });
    const darkWaterMat = mat("plaster", { color: "#0f172a" });
    const woodPierMat = mat("wood", { color: "#78350f" });
    const stoneDockMat = mat("stone", { color: "#334155" });
    const ironMat = mat("stone", { color: "#1e293b" });
    const goldMat = mat("wood", { color: "#eab308" });
    const rustSteelMat = mat("stone", { color: "#475569" });

    // Harbor water plane
    kit.ground(W, { kind: "grass", color: harborPal.floor || "#0369a1" });
    kit.hills(W, { color: "#0c4a6e", dist: 80 });

    // Wooden Shipyard Dock / Pier
    kit.path(W, [-15, 0], [15, 0], { width: 4.0, kind: "stone", color: "#1e293b" });

    // Harbor Crane / Lighthouse in background
    kit.house(W, {
      x: -12, z: -15, ry: 0, w: 6, d: 6, h: 18,
      wall: "brick", wallColor: "#b91c1c",
      roof: "flat", roofColor: "#0f172a",
      trim: "#f8fafc",
      sign: "DRYDOCK 17"
    });

    // --- Model 1: Engineer's Battleship (With 17-Foot Bulbous Bow) ---
    const engineerShip = new THREE.Group();
    // Main Hull
    const engHull = kit.box(2.6, 2.2, 9.0, ironMat, { x: 0, y: 1.1, z: 0 });
    engineerShip.add(engHull);
    // Pointed Bow
    const engBow = kit.box(2.0, 2.0, 3.5, ironMat, { x: 0, y: 1.1, z: 5.5 });
    engineerShip.add(engBow);
    // Prominent 17-Foot Steel Bulbous Bow (The hero prop!)
    const bulbMat = mat("stone", { color: "#ea580c" }); // Orange protective primer paint!
    const bulb = kit.cyl(1.1, 0.7, 3.2, bulbMat, { x: 0, y: 0.5, z: 7.2, rx: Math.PI / 2 });
    engineerShip.add(bulb);
    // Smokestacks / Funnels
    const engFunnel1 = kit.cyl(0.45, 0.45, 2.4, rustSteelMat, { x: 0, y: 3.2, z: -1.2 });
    const engFunnel2 = kit.cyl(0.45, 0.45, 2.4, rustSteelMat, { x: 0, y: 3.2, z: 1.2 });
    engineerShip.add(engFunnel1);
    engineerShip.add(engFunnel2);
    // Bridge Tower
    const engBridge = kit.box(1.8, 1.6, 2.2, ironMat, { x: 0, y: 2.8, z: 3.0 });
    engineerShip.add(engBridge);

    engineerShip.position.set(-3.5, 0, 8);
    W.add(engineerShip, { name: "engineerShip" });

    // --- Model 2: Tycoon's Sleek Knife-Bow Warship ---
    const tycoonShip = new THREE.Group();
    // Ultra sharp sleek Hull
    const tycHull = kit.box(2.2, 2.0, 9.5, ironMat, { x: 0, y: 1.0, z: 0 });
    tycoonShip.add(tycHull);
    // Needle-sharp Bow (No bulb!)
    const tycBow = kit.box(1.2, 1.9, 4.0, ironMat, { x: 0, y: 1.0, z: 5.8 });
    tycoonShip.add(tycBow);
    // Gilded Funnels & Rails
    const tycFunnel = kit.cyl(0.5, 0.5, 2.8, goldMat, { x: 0, y: 3.3, z: 0 });
    tycoonShip.add(tycFunnel);
    const tycBridge = kit.box(1.6, 1.8, 2.5, ironMat, { x: 0, y: 2.7, z: 2.8 });
    tycoonShip.add(tycBridge);

    tycoonShip.position.set(3.5, 0, 8);
    W.add(tycoonShip, { name: "tycoonShip" });

    // --- Model 3: Golden Naval Speed Trophy ---
    const trophyGroup = new THREE.Group();
    const pedestal = kit.box(0.8, 1.2, 0.8, stoneDockMat, { x: 0, y: 0.6, z: 0 });
    const cup = kit.cyl(0.4, 0.25, 0.9, goldMat, { x: 0, y: 1.6, z: 0 });
    const handles = kit.box(1.1, 0.1, 0.3, goldMat, { x: 0, y: 1.8, z: 0 });
    trophyGroup.add(pedestal);
    trophyGroup.add(cup);
    trophyGroup.add(handles);
    trophyGroup.position.set(0, 0, 3.5);
    W.add(trophyGroup, { name: "speedTrophy" });

    // --- Cast ---
    // The Naval Engineer (Hero)
    const engineer = cast.add({
      name: "engineer",
      look: makeLook(rand.fork(101), "adult", {
        fem: false,
        skin: "#fed7aa",
        hair: "#451a03",
        hairStyle: "short",
        outfit: "overalls",
        top: "#0369a1",
        shoes: "#1e293b",
        build: 1.05
      }),
      pos: [-2.2, 3.5],
      h: 1.78
    });

    // The Shipyard Tycoon (Doubter / Rival)
    const tycoon = cast.add({
      name: "tycoon",
      look: makeLook(rand.fork(202), "adult", {
        fem: false,
        skin: "#fde047",
        hair: "#334155",
        hairStyle: "parted",
        outfit: "suit",
        top: "#881337",
        shoes: "#0f172a",
        mustache: true,
        build: 1.18
      }),
      pos: [2.2, 3.5],
      h: 1.84
    });

    // Initial Positions
    engineer.face(0, "determined").arms(0, "hold");
    tycoon.hide(0);

    // --- Animation Timeline based on Narrator's Spoken Words ---
    // Shot 01 (0.0s - 5.8s): Engineer welds 17-foot steel bulb
    const tWeld = at("welded", 1) || 1.2;
    engineer.face(tWeld, "determined").arms(tWeld, "reach");
    fx.add("burst", tWeld, tWeld + 3.5, [-3.5, 1.2, 14.5], { size: 1.4, color: "#f97316" });

    // Shot 02 (5.8s - 11.4s): Tycoon enters, competing for $1M naval trophy
    const tTrophy = at("richest", 7) || 7.5;
    tycoon.show(tTrophy - 0.5);
    tycoon.face(tTrophy, "smug").arms(tTrophy, "point");
    fx.add("stars", tTrophy, tTrophy + 2.0, [0, 2.6, 3.5], { size: 1.2, color: "#eab308" });

    // Shot 03 (11.4s - 16.8s): Tycoon taps the bulb and laughs (Joke 1)
    const tMock = at("yells", 14) || 13.0;
    tycoon.face(tMock, "laugh").arms(tMock, "armsUp");
    engineer.face(tMock, "unimpressed").arms(tMock, "fold");
    fx.add("exclaim", tMock + 1.0, tMock + 3.0, [2.2, 2.5, 3.5], { size: 0.9, color: "#ef4444" });

    // Shot 04 (16.8s - 23.0s): Engineer checks 43 brass steam gauges
    const tGauges = at("gauges", 20) || 19.5;
    tycoon.hide(tGauges);
    engineer.face(tGauges, "focused").arms(tGauges, "work");
    fx.add("burst", tGauges, tGauges + 2.5, [-2.2, 2.2, 3.5], { size: 0.8, color: "#38bdf8" });

    // Shot 05 (23.0s - 28.5s): Both giant battleships accelerate at 6 a.m.
    const tFurnace = at("furnaces", 26) || 25.0;
    fx.add("burst", tFurnace, tFurnace + 3.0, [-3.5, 4.5, 6.8], { size: 1.5, color: "#334155" });
    fx.add("burst", tFurnace + 0.2, tFurnace + 3.2, [3.5, 4.5, 6.8], { size: 1.5, color: "#334155" });

    // Shot 06 (28.5s - 34.8s): Tycoon pulls ahead, shouting insult (Joke 2)
    const tTaunt = at("shouting", 31) || 30.5;
    tycoon.show(tTaunt - 0.5);
    tycoon.face(tTaunt, "smug").arms(tTaunt, "wave");
    engineer.face(tTaunt, "determined").arms(tTaunt, "steer");

    // Shot 07 (34.8s - 40.4s): Bulb creates smooth secondary cancelling wave
    const tSecondary = at("secondary", 37) || 37.0;
    tycoon.hide(tSecondary);
    fx.add("notes", tSecondary, tSecondary + 3.0, [-3.5, 0.5, 14.0], { size: 1.2, color: "#38bdf8" });

    // Shot 08 (40.4s - 45.7s): Heavy storm swells slam both ships
    const tStorm = at("swells", 42) || 42.0;
    tycoon.show(tStorm - 0.5);
    tycoon.face(tStorm, "shocked").arms(tStorm, "panic");
    engineer.face(tStorm, "focused").arms(tStorm, "steer");
    fx.add("burst", tStorm, tStorm + 3.0, [0, 2.0, 10.0], { size: 2.2, color: "#e0f2fe" });

    // Shot 09 (45.7s - 47.8s): Sleek ship stalls!
    const tStall = at("stalls", 46) || 46.5;
    tycoon.face(tStall, "terrified").arms(tStall, "facepalm");
    fx.add("burst", tStall, tStall + 2.0, [3.5, 3.5, 8.0], { size: 1.8, color: "#1e293b" });

    // Shot 10 (47.8s - 53.9s): Narrator scientific reveal - destructive interference
    const tReveal = at("cancels", 50) || 50.0;
    fx.add("stars", tReveal, tReveal + 3.5, [-3.5, 1.2, 14.5], { size: 1.5, color: "#22c55e" });

    // Shot 11 (53.9s - 59.6s): Engineer zooms past drenched tycoon, triumphant victory!
    const tVictory = at("zooms", 55) || 55.5;
    engineer.face(tVictory, "grin").arms(tVictory, "wave");
    tycoon.face(tVictory, "defeated").arms(tVictory, "shiver");
    fx.add("stars", tVictory, tVictory + 3.5, [-3.5, 3.2, 8.0], { size: 1.6, color: "#fbbf24" });

    // --- Dynamic 9:16 Camera Timeline ---
    const cameraKeys = [
      // 01: Low Angle Hero Bow Welding (0.0s - 5.8s)
      { t: 0, pos: [-3.5, 1.8, 18.0], look: [-3.5, 1.2, 14.0], light: "day", move: "push", fov: 44 },

      // 02: Pier Two-Shot with Golden Speed Trophy (5.8s - 11.4s)
      { t: 5.8, pos: [0, 2.2, 8.0], look: [0, 1.5, 3.5], light: "day", move: "push", fov: 42 },

      // 03: Tycoon Mocks Bulbous Nose (11.4s - 16.8s)
      { t: 11.4, pos: [1.2, 1.8, 6.5], look: [0, 1.3, 3.5], light: "golden", move: "push", fov: 38 },

      // 04: Boiler Room Gauges (16.8s - 23.0s)
      { t: 16.8, pos: [-2.2, 2.0, 5.8], look: [-2.2, 1.5, 3.5], light: "interior", move: "push", fov: 36 },

      // 05: High Aerial Wide Race Launch (23.0s - 28.5s)
      { t: 23.0, pos: [0, 8.5, 22.0], look: [0, 2.0, 8.0], light: "dawn", move: "pull", fov: 48 },

      // 06: Tycoon Surges Ahead with Megaphone (28.5s - 34.8s)
      { t: 28.5, pos: [3.5, 3.5, 12.0], look: [3.5, 2.6, 8.0], light: "day", move: "push", fov: 40 },

      // 07: Waterline Profile on Bulb's Secondary Wave (34.8s - 40.4s)
      { t: 34.8, pos: [-6.5, 1.6, 15.5], look: [-3.5, 0.8, 14.0], light: "day", move: "push", fov: 38 },

      // 08: Dramatic Storm Dutch Angle (40.4s - 45.7s)
      { t: 40.4, pos: [1.5, 3.8, 16.0], look: [0, 1.8, 8.0], light: "storm", move: "push", fov: 46 },

      // 09: Sleek Ship Stalls in Heavy Spray (45.7s - 47.8s)
      { t: 45.7, pos: [3.5, 2.8, 13.0], look: [3.5, 1.8, 8.0], light: "storm", move: "push", fov: 36 },

      // 10: Scientific 3D Wave Cancellation Diagram (47.8s - 53.9s)
      { t: 47.8, pos: [-5.0, 1.5, 16.5], look: [-3.5, 0.6, 14.0], light: "day", move: "pull", fov: 40 },

      // 11: Triumphant Winner Zooms Past Drenched Tycoon (53.9s - 59.6s)
      { t: 53.9, pos: [-1.0, 4.0, 15.0], look: [0, 2.0, 8.0], light: "golden", move: "pull", fov: 44 }
    ];

    return {
      camera: cameraKeys,
      kicks: [
        { t: 0.8, amp: 0.15 },
        { t: 11.5, amp: 0.18 },
        { t: 23.2, amp: 0.25 },
        { t: 40.5, amp: 0.35 },
        { t: 45.8, amp: 0.3 }
      ]
    };
  }
};
