const fs = require('fs');

function parseGLB(path) {
  const buf = fs.readFileSync(path);
  let offset = 12;
  let json = null, bin = null;
  while (offset < buf.length) {
    const chunkLen = buf.readUInt32LE(offset);
    const chunkType = buf.slice(offset + 4, offset + 8).toString('ascii');
    const chunk = buf.slice(offset + 8, offset + 8 + chunkLen);
    if (chunkType === 'JSON') json = JSON.parse(chunk.toString('utf8'));
    if (chunkType === 'BIN\x00') bin = chunk;
    offset += 8 + chunkLen;
  }
  return { gltf: json, bin };
}

function readAccessor(gltf, bin, idx) {
  const a = gltf.accessors[idx];
  const bv = gltf.bufferViews[a.bufferView];
  const start = (bv.byteOffset || 0) + (a.byteOffset || 0);
  const compSize = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[a.type];
  const out = [];
  for (let i = 0; i < a.count; i++) {
    const row = [];
    for (let c = 0; c < compSize; c++) {
      row.push(bin.readFloatLE(start + (i * compSize + c) * 4));
    }
    out.push(row);
  }
  return out;
}

for (const path of process.argv.slice(2)) {
  const { gltf, bin } = parseGLB(path);
  console.log(`\n===== ${path.split(/[\\/]/).pop()} =====`);
  const anim = gltf.animations[0];
  for (const ch of anim.channels) {
    if (ch.target.path !== 'rotation') continue;
    const s = anim.samplers[ch.sampler];
    const times = readAccessor(gltf, bin, s.input).map(r => r[0]);
    const quats = readAccessor(gltf, bin, s.output);
    const node = gltf.nodes[ch.target.node];
    console.log(`\nNode ${ch.target.node} '${node.name}' rotation keys=${quats.length}`);
    const q0 = quats[0];
    const angles = quats.map(q => {
      const dot = Math.abs(q0[0]*q[0] + q0[1]*q[1] + q0[2]*q[2] + q0[3]*q[3]);
      const clamped = Math.min(1, Math.max(-1, dot));
      return (2 * Math.acos(clamped) * 180 / Math.PI);
    });
    const picks = [0, 10, 20, 30, 40, 50, 60];
    for (const i of picks) {
      if (i < quats.length) {
        console.log(`  t=${times[i].toFixed(2)}s q=[${quats[i].map(v=>v.toFixed(3)).join(', ')}] angleFromStart=${angles[i].toFixed(1)}deg`);
      }
    }
    console.log(`  maxAngleFromStart=${Math.max(...angles).toFixed(1)}deg`);
  }
}
