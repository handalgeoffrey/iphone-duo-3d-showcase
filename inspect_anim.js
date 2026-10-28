const fs = require('fs');

function parseGLB(path) {
  const buf = fs.readFileSync(path);
  let offset = 12;
  let json = null;
  while (offset < buf.length) {
    const chunkLen = buf.readUInt32LE(offset);
    const chunkType = buf.slice(offset + 4, offset + 8).toString('ascii');
    if (chunkType === 'JSON') json = JSON.parse(buf.slice(offset + 8, offset + 8 + chunkLen).toString('utf8'));
    offset += 12 + chunkLen;
  }
  return json;
}

function accessorInfo(gltf, idx) {
  const a = gltf.accessors[idx];
  return { count: a.count, type: a.type, min: a.min, max: a.max };
}

for (const path of process.argv.slice(2)) {
  const gltf = parseGLB(path);
  console.log(`\n===== ${path.split(/[\\/]/).pop()} =====`);
  if (!gltf.animations) { console.log('no animations'); continue; }
  for (const anim of gltf.animations) {
    console.log(`Animation: ${anim.name} channels=${anim.channels.length}`);
    let duration = 0;
    anim.channels.forEach((ch, i) => {
      const s = anim.samplers[ch.sampler];
      const input = gltf.accessors[s.input];
      const output = gltf.accessors[s.output];
      if (input.max) duration = Math.max(duration, input.max[0]);
      console.log(` ch${i} node=${ch.target.node} path=${ch.target.path} interpolation=${s.interpolation || 'LINEAR'}`);
      console.log(`   input times: count=${input.count} min=${JSON.stringify(input.min)} max=${JSON.stringify(input.max)}`);
      console.log(`   output: count=${output.count} type=${output.type} min=${JSON.stringify(output.min)} max=${JSON.stringify(output.max)}`);
    });
    console.log(` Duration: ${duration.toFixed(4)}s`);
  }
  // print root node transforms for orientation
  console.log('\nRoot scene nodes:');
  const scene = gltf.scenes[gltf.scene || 0];
  for (const ni of scene.nodes) {
    const n = gltf.nodes[ni];
    console.log(` node ${ni} '${n.name}' t=${JSON.stringify(n.translation)} r=${JSON.stringify(n.rotation)} s=${JSON.stringify(n.scale)}`);
  }
}
