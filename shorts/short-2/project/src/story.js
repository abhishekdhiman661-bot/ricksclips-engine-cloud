import words from "./words.js";

export default {
  seed: 96,
  words,
  light: "day",
  build({ W, kit, mat, glow, cast, fx, makeLook, rand, clock, aim, aerial, THREE, makePalette, tintLight, buildSet, prop, dress, lights, LIGHTS }) {
    const { at, end } = clock;

    // --- Palettes ---
    const campusPal = makePalette(rand.fork(11), { family: "blue", accent: "orange" });
    const dormPal = makePalette(rand.fork(22), { family: "amber", accent: "teal" });
    const corporatePal = makePalette(rand.fork(33), { family: "indigo", accent: "red" });
    const courtPal = makePalette(rand.fork(44), { family: "olive", accent: "amber" });

    // --- Environment / Ground ---
    kit.ground(W, { kind: "grass", color: campusPal.floor });
    kit.hills(W, { color: "#1e3a8a", dist: 70 });

    // College campus / High school building
    kit.house(W, {
      x: 0, z: -10, ry: 0, w: 24, d: 8, h: 7,
      wall: "brick", wallColor: "#991b1b",
      roof: "tiles", roofColor: "#1e293b",
      trim: "#f8fafc",
      sign: "HIGH SCHOOL LAWN"
    });

    // Runway / Landing pad path
    kit.path(W, [-20, 4], [20, 4], { width: 3.5, kind: "stone", color: "#334155" });

    // Mountain of Soda Cans
    const canGroup = new THREE.Group();
    const canBlueMat = mat("plaster", { color: "#2563eb" });
    const canRedMat = mat("plaster", { color: "#dc2626" });
    const canWhiteMat = mat("plaster", { color: "#f8fafc" });

    for (let i = -1.2; i <= 1.2; i += 0.4) {
      for (let j = -1.2; j <= 1.2; j += 0.4) {
        const h = Math.max(0.2, 1.8 - Math.sqrt(i * i + j * j));
        const can = kit.cyl(0.12, 0.12, h, (i + j) % 2 === 0 ? canBlueMat : canRedMat, { x: i, y: h / 2, z: j });
        canGroup.add(can);
      }
    }
    canGroup.position.set(4, 0, 1);
    W.add(canGroup, { name: "canMountain" });

    // Hero Prop: AV-8B Harrier II Jump Jet Model
    const jetGroup = new THREE.Group();
    const metalMat = mat("wood", { color: "#475569" });
    const darkMetalMat = mat("stone", { color: "#1e293b" });

    // Jet Fuselage
    const fuselage = kit.box(1.2, 0.9, 4.2, metalMat, { x: 0, y: 1.2, z: 0 });
    jetGroup.add(fuselage);

    // Wings
    const wings = kit.box(4.5, 0.1, 1.8, metalMat, { x: 0, y: 1.3, z: -0.2 });
    jetGroup.add(wings);

    // Vertical Stabilizer / Tail
    const tail = kit.box(0.15, 1.4, 1.0, darkMetalMat, { x: 0, y: 2.1, z: -1.7 });
    jetGroup.add(tail);

    // Thrust Nozzles
    const nozzleL = kit.cyl(0.25, 0.25, 0.5, darkMetalMat, { x: -0.7, y: 0.9, z: 0.3, ry: Math.PI / 2 });
    const nozzleR = kit.cyl(0.25, 0.25, 0.5, darkMetalMat, { x: 0.7, y: 0.9, z: 0.3, ry: Math.PI / 2 });
    jetGroup.add(nozzleL);
    jetGroup.add(nozzleR);

    jetGroup.position.set(0, 0, 4);
    W.add(jetGroup, { name: "harrierJet" });

    // --- Cast ---
    // John Leonard (21-year-old business student)
    const john = cast.add({
      name: "john",
      look: makeLook(rand.fork(102), "adult", {
        fem: false,
        skin: "#fed7aa",
        hair: "#78350f",
        hairStyle: "short",
        outfit: "tee",
        top: "#0284c7",
        shoes: "#1e293b",
        build: 1.0
      }),
      pos: [-1.5, 3.5],
      h: 1.76
    });

    // Corporate Executive (Pepsi Boss)
    const exec = cast.add({
      name: "exec",
      look: makeLook(rand.fork(204), "adult", {
        fem: false,
        skin: "#fde047",
        hair: "#64748b",
        hairStyle: "short",
        outfit: "suit",
        top: "#1e1b4b",
        shoes: "#0f172a",
        mustache: true,
        build: 1.15
      }),
      pos: [2.5, 3.5],
      h: 1.82
    });

    // Federal Judge
    const judge = cast.add({
      name: "judge",
      look: makeLook(rand.fork(306), "elder", {
        fem: true,
        skin: "#fbcfe8",
        hair: "#94a3b8",
        hairStyle: "bun",
        outfit: "robe",
        top: "#0f172a",
        shoes: "#020617",
        glasses: true,
        build: 1.05
      }),
      pos: [0, 10],
      h: 1.7
    });

    // Initial character states
    exec.hide(0);
    judge.hide(0);

    // --- Acting Timeline ---
    // Scene 1: Hook - Harrier Jet landing on campus
    john.face(0, "determined").arms(0, "hold");

    // Scene 2: Commercial on TV
    const tCommercial = at("television", 6) || 8.0;
    john.face(tCommercial, "surprised").arms(tCommercial, "point");
    fx.add("burst", tCommercial, tCommercial + 1.5, [0, 2.2, 4], { size: 1.0, color: "#38bdf8" });

    // Scene 3: Soda can mountain calculation
    const tCans = at("sodas", 20) || 22.0;
    john.face(tCans, "shocked").arms(tCans, "facepalm");

    // Scene 4: Dorm room catalog loophole discovery
    const tLoophole = at("loophole", 36) || 40.0;
    john.face(tLoophole, "grin").arms(tLoophole, "think");
    fx.add("stars", tLoophole, tLoophole + 1.8, [-1.5, 2.3, 3.5], { size: 0.8, color: "#fbbf24" });

    // Scene 5: Boardroom pitch to investors
    const tMath = at("investors", 60) || 64.0;
    john.face(tMath, "smug").arms(tMath, "reach");

    // Scene 6: Demanding jet from Pepsi Executive
    const tDemand = at("certified", 72) || 75.0;
    exec.show(tDemand - 0.5);
    exec.face(tDemand, "shocked").arms(tDemand, "armsUp");
    john.face(tDemand, "happy").arms(tDemand, "hips");
    fx.add("exclaim", tDemand + 1.0, tDemand + 2.5, [2.5, 2.4, 3.5], { size: 0.8, color: "#ef4444" });

    // Scene 7: Federal Courtroom lawsuit
    const tCourt = at("federal", 85) || 89.0;
    exec.hide(tCourt);
    judge.show(tCourt - 0.5);
    judge.face(tCourt, "angry").arms(tCourt, "point");
    john.face(tCourt, "worried").arms(tCourt, "shrug");

    // Scene 8: Commercial update to 700M points
    const tSafe = at("immediately", 102) || 105.0;
    judge.hide(tSafe);
    exec.show(tSafe);
    exec.face(tSafe, "smug").arms(tSafe, "clap");
    john.face(tSafe, "laugh").arms(tSafe, "wave");
    fx.add("notes", tSafe + 1.0, tSafe + 3.0, [0, 2.5, 4], { size: 0.9, color: "#22c55e" });

    // --- Camera Timeline ---
    const cameraKeys = [
      // 01: Hook - Harrier Jet overview
      { t: 0, pos: [0, 3.5, 10.5], look: [0, 1.4, 4], light: "day", move: "push", fov: 42 },

      // 02: TV Commercial
      { t: tCommercial - 1.0, pos: [-1.2, 2.0, 6.2], look: [-1.5, 1.5, 3.5], light: "golden", move: "push", fov: 38 },

      // 03: Soda can mountain
      { t: tCans - 1.0, pos: [3.8, 2.6, 5.0], look: [4.0, 1.2, 1.0], light: "day", move: "pull", fov: 44 },

      // 04: Loophole fine print
      { t: tLoophole - 1.0, pos: [-1.5, 1.8, 2.2], look: [-1.5, 1.4, 1.0], light: "interior", move: "push", fov: 36 },

      // 05: Investor calculation
      { t: tMath - 1.0, pos: [0, 2.4, 6.5], look: [-0.5, 1.5, 3.5], light: "day", move: "push", fov: 40 },

      // 06: Pepsi confrontation
      { t: tDemand - 0.5, pos: [0.5, 2.1, 7.0], look: [0.5, 1.6, 3.5], light: "golden", move: "push", fov: 40 },

      // 07: Federal court
      { t: tCourt - 0.5, pos: [0, 2.8, 14.5], look: [0, 1.8, 10.0], light: "day", move: "push", fov: 38 },

      // 08: Updated billboard & resolution
      { t: tSafe - 0.5, pos: [0, 4.0, 11.0], look: [0, 1.6, 4.0], light: "day", move: "pull", fov: 44 }
    ];

    return {
      camera: cameraKeys,
      kicks: [
        { t: 0.5, amp: 0.2 },
        { t: tCommercial, amp: 0.15 },
        { t: tDemand, amp: 0.18 },
        { t: tCourt, amp: 0.22 }
      ]
    };
  }
};
