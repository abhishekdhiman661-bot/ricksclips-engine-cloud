import words from "./words.js";

export default {
  seed: 42,
  words,
  light: "day",
  build({ W, kit, mat, glow, cast, fx, makeLook, rand, clock, aim, aerial, THREE, makePalette, tintLight, buildSet, prop, dress, lights, LIGHTS }) {
    const { at, end } = clock;

    // --- Palettes ---
    const prisonPal = makePalette(rand.fork(10), { family: "indigo", accent: "orange" });
    const workshopPal = makePalette(rand.fork(20), { family: "amber", accent: "teal" });
    const outsidePal = makePalette(rand.fork(30), { family: "olive", accent: "red" });
    const snowPal = makePalette(rand.fork(40), { family: "blue", accent: "red" });

    // --- Environment / Ground ---
    kit.ground(W, { kind: "slabs", color: prisonPal.floor });
    kit.hills(W, { color: "#334155", dist: 80 });

    // Prison yard walls & loading bay
    kit.house(W, {
      x: 0, z: -10, ry: 0, w: 22, d: 8, h: 6,
      wall: "brick", wallColor: "#475569",
      roof: "planks", roofColor: "#1e293b",
      trim: "#334155",
      sign: "USP POLLOCK - SHIPPING"
    });

    // Loading dock and fence
    kit.fence(W, [-12, -4], [12, -4], { color: "#64748b", h: 2.5 });

    // Warehouse & Railway environment
    kit.ground(W, { kind: "dirt", color: "#78716c" });
    kit.path(W, [-25, 12], [25, 12], { width: 2.2, kind: "stone", color: "#57534e" });

    // Pallets & crates stack
    prop.crateStack(W, { pal: workshopPal, x: 2, z: 0, ry: 0.1 });
    prop.crateStack(W, { pal: workshopPal, x: -3.5, z: 1, ry: -0.2 });

    // Hero Prop: The Mailbag Pallet with Compartment
    const palletGroup = new THREE.Group();
    const woodMat = mat("wood", { color: "#b45309" });
    const palletBase = kit.box(1.6, 0.2, 1.6, woodMat, { x: 0, y: 0.1, z: 0 });
    palletGroup.add(palletBase);

    // Stacked mailbags around the hidden core
    const sackMat = mat("plaster", { color: "#cbd5e1" });
    for (let i = -0.5; i <= 0.5; i += 0.5) {
      for (let j = -0.5; j <= 0.5; j += 0.5) {
        if (Math.abs(i) === 0.5 && Math.abs(j) === 0.5) {
          const bag = kit.box(0.45, 0.35, 0.45, sackMat, { x: i, y: 0.4, z: j });
          palletGroup.add(bag);
        }
      }
    }
    palletGroup.position.set(0, 0, 0);
    W.add(palletGroup, { name: "heroPallet" });

    // --- Cast ---
    // McNair (Escaped convict in athletic / jogger gear)
    const mcnair = cast.add({
      name: "mcnair",
      look: makeLook(rand.fork(101), "adult", {
        fem: false,
        skin: "#fbd38d",
        hair: "#4a5568",
        hairStyle: "short",
        outfit: "tee",
        top: "#e2e8f0",
        shoes: "#1a202c",
        build: 1.05
      }),
      pos: [0, 0],
      h: 1.78
    });

    // Guard / Cop officer
    const officer = cast.add({
      name: "officer",
      look: makeLook(rand.fork(202), "adult", {
        fem: false,
        skin: "#ecc94b",
        hair: "#2d3748",
        hairStyle: "short",
        hat: "cap",
        hatColor: "#1e3a8a",
        outfit: "uniform",
        top: "#1e40af",
        shoes: "#0f172a",
        mustache: true,
        build: 1.15
      }),
      pos: [3.5, 12],
      h: 1.82
    });

    // Canadian Mountie
    const mountie = cast.add({
      name: "mountie",
      look: makeLook(rand.fork(303), "adult", {
        fem: false,
        skin: "#fed7aa",
        hair: "#1f2937",
        hat: "beret",
        hatColor: "#b91c1c",
        outfit: "uniform",
        top: "#dc2626",
        shoes: "#451a03",
        build: 1.1
      }),
      pos: [-10, 25],
      h: 1.84
    });

    // Initial character states
    officer.hide(0);
    mountie.hide(0);

    // --- Acting Timeline ---
    // Scene 1: Hook - High angle pallet inspection
    mcnair.face(0, "determined").arms(0, "hold");

    // Scene 2: Handcuff slip & leap
    const tEscape1 = at("greases", 5) || 7.0;
    mcnair.face(tEscape1, "smug").arms(tEscape1, "reach");
    fx.add("burst", tEscape1, tEscape1 + 1.2, [0, 1.4, 0], { size: 0.8, color: "#f59e0b" });

    // Scene 3: Crawling duct
    const tDuct = at("crawls", 15) || 16.5;
    mcnair.face(tDuct, "thinking").arms(tDuct, "point");

    // Scene 4: Workshop repair
    const tWorkshop = at("penitentiary", 24) || 26.0;
    mcnair.face(tWorkshop, "neutral").arms(tWorkshop, "hold");

    // Scene 5: Inside pallet compartment with tube
    const tPallet = at("compartment", 44) || 47.0;
    mcnair.face(tPallet, "surprised").arms(tPallet, "hips");
    fx.emit("dust", tPallet, tPallet + 2.5, [0, 0.3, 0], { size: 0.2, count: 8 });

    // Scene 6: Warehouse lunch breakout & run
    const tBreakout = at("leaves", 60) || 64.0;
    mcnair.face(tBreakout, "grin").arms(tBreakout, "armsUp");
    mcnair.walk(tBreakout, tBreakout + 4.0, [[0, 0], [1, 4], [2, 10]]);

    // Scene 7: Railroad encounter with cop
    const tCop = at("railroad", 74) || 78.0;
    officer.show(tCop - 0.5);
    officer.face(tCop, "confused").arms(tCop, "point").turn(tCop, "left");
    mcnair.face(tCop, "smug").arms(tCop, "wave");

    const tJimmy = at("Jimmy", 84) || 88.0;
    mcnair.face(tJimmy, "happy").arms(tJimmy, "think");
    fx.add("question", tCop + 1.5, tCop + 3.0, [3.5, 2.2, 12], { size: 0.6, color: "#38bdf8" });

    // Scene 8: Mounties & resolution
    const tMountie = at("Mounties", 96) || 100.0;
    officer.hide(tMountie);
    mountie.show(tMountie - 0.2);
    mcnair.pos = [-8.8, 25];
    mcnair.face(tMountie, "shocked").arms(tMountie, "facepalm");
    mountie.face(tMountie, "determined").arms(tMountie, "hold");
    fx.add("exclaim", tMountie + 1.0, tMountie + 2.5, [-8.8, 2.3, 25], { size: 0.7, color: "#ef4444" });

    // --- Camera Timeline ---
    const cameraKeys = [
      // 01: Hook - Mail pallet overview
      { t: 0, pos: [0, 3.2, 5.5], look: [0, 0.8, 0], light: "day", move: "push", fov: 42 },

      // 02: Handcuff slip
      { t: tEscape1 - 1.0, pos: [-0.5, 1.8, 3.2], look: [0, 1.4, 0], light: "golden", move: "locked", fov: 38 },

      // 03: Vent crawl
      { t: tDuct - 1.0, pos: [0.8, 2.2, 3.5], look: [0, 1.5, 0], light: "night", move: "push", fov: 36 },

      // 04: Workshop pallets
      { t: tWorkshop - 1.0, pos: [-2.5, 2.4, 5.0], look: [0, 1.0, 0], light: "day", move: "pull", fov: 40 },

      // 05: Secret compartment
      { t: tPallet - 1.0, pos: [0, 1.2, 2.6], look: [0, 0.6, 0], light: "golden", move: "push", fov: 44 },

      // 06: Breakout cut
      { t: tBreakout - 0.5, pos: [1.5, 1.6, 6.0], look: [1.0, 1.2, 3.0], light: "day", move: "push", fov: 42 },

      // 07: Cop confrontation
      { t: tCop - 0.5, pos: [1.8, 1.9, 15.5], look: [2.5, 1.5, 12.0], light: "golden", move: "push", fov: 38 },

      // 08: Canadian capture & resolution
      { t: tMountie - 0.5, pos: [-9.5, 2.2, 28.5], look: [-9.2, 1.6, 25.0], light: "day", move: "pull", fov: 42 }
    ];

    return {
      camera: cameraKeys,
      kicks: [
        { t: tEscape1, amp: 0.15 },
        { t: tBreakout, amp: 0.18 },
        { t: tMountie, amp: 0.2 }
      ]
    };
  }
};
