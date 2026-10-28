const fs = require('fs');

function inspect(path) {
  const buf = fs.readFileSync(path);
  const magic = buf.slice(0, 4).toString('ascii');
  const version = buf.readUInt32LE(4);
  const length = buf.readUInt32LE(8);
  console.log(`\n===== ${path.split('\\').pop()} =====`);
  console.log('magic:', magic, 'version:', version, 'binLength:', length, 'actual:', buf.length);
  let offset = 12;
  const chunks = [];
  while (offset < buf.length) {
    const chunkLen = buf.readUInt32LE(offset);
    const chunkType = buf.slice(offset + 4, offset + 8).toString('ascii');
    const chunk = buf.slice(offset + 8, offset + 8 + chunkLen);
    chunks.push({ chunkType, chunkLen, chunk });
    offset += 12 + chunkLen;
  }
  const jsonChunk = chunks.find(c => c.chunkType === 'JSON');
  const binChunk = chunks.find(c => c.chunkType === 'BIN\x00');
  if (!jsonChunk) { console.log('no JSON chunk'); return; }
  const gltf = JSON.parse(jsonChunk.chunk.toString('utf8'));
  console.log('\n--- asset ---', JSON.stringify(gltf.asset, null, 2));
  console.log('\n--- scenes ---', gltf.scenes ? gltf.scenes.map(s => ({ index: s.index, name: s.name, nodes: s.nodes })) : null);
  console.log('\n--- nodes ---');
  if (gltf.nodes) {
    gltf.nodes.forEach((n, i) => {
      const parts = [];
      if (n.name) parts.push('name=' + n.name);
      if (n.mesh !== undefined) parts.push('mesh=' + n.mesh);
      if (n.children) parts.push('children=' + n.children.join(','));
      if (n.translation) parts.push('pos=' + n.translation.map(v => v.toFixed(2)).join(','));
      if (n.scale) parts.push('scale=' + n.scale.map(v => v.toFixed(3)).join(','));
      if (n.rotation) parts.push('rot=' + n.rotation.map(v => v.toFixed(3)).join(','));
      if (n.matrix) parts.push('matrix=' + n.matrix.map(v => v.toFixed(2)).join(','));
      console.log(`  [${i}] ` + parts.join(' '));
    });
  }
  console.log('\n--- meshes ---');
  if (gltf.meshes) {
    gltf.meshes.forEach((m, i) => {
      const prims = m.primitives ? m.primitives.map(p => ({
        attributes: p.attributes ? Object.keys(p.attributes) : [],
        material: p.material,
        indices: p.indices,
        targets: p.targets ? p.targets.length : 0,
        mode: p.mode,
      })) : [];
      console.log(`  [${i}] name='${m.name}' primitives=${JSON.stringify(prims)} weights=${JSON.stringify(m.weights)}`);
    });
  }
  console.log('\n--- materials ---');
  if (gltf.materials) {
    gltf.materials.forEach((mat, i) => {
      const pbr = mat.pbrMetallicRoughness || {};
      const info = [];
      if (mat.name) info.push('name=' + mat.name);
      if (pbr.baseColorFactor) info.push('baseColor=' + pbr.baseColorFactor.map(v => v.toFixed(2)).join(','));
      if (pbr.metallicFactor !== undefined) info.push('metallic=' + pbr.metallicFactor.toFixed(2));
      if (pbr.roughnessFactor !== undefined) info.push('roughness=' + pbr.roughnessFactor.toFixed(2));
      // texture refs
      const texRefs = [];
      ['baseColorTexture','metallicRoughnessTexture','normalTexture','occlusionTexture','emissiveTexture'].forEach(k => {
        const t = (k === 'baseColorTexture' ? pbr : mat)[k];
        if (t) texRefs.push(k + '->tex' + t.index + (t.texCoord !== undefined ? ' coord' + t.texCoord : ''));
      });
      if (texRefs.length) info.push('textures=' + texRefs.join(','));
      console.log(`  [${i}] ` + info.join(' '));
    });
  }
  console.log('\n--- textures ---');
  if (gltf.textures) {
    gltf.textures.forEach((t, i) => {
      const src = t.source !== undefined ? 'source=' + t.source : '';
      const sampler = t.sampler !== undefined ? 'sampler=' + t.sampler : '';
      console.log(`  [${i}] ${src} ${sampler}`);
    });
  }
  console.log('\n--- images ---');
  if (gltf.images) {
    gltf.images.forEach((im, i) => {
      console.log(`  [${i}] name='${im.name}' mime=${im.mimeType} uri=${im.uri} bufferView=${im.bufferView}`);
    });
  }
  console.log('\n--- animations ---');
  if (gltf.animations) {
    gltf.animations.forEach((anim, i) => {
      console.log(`  [${i}] name='${anim.name}'`);
      (anim.channels || []).forEach(ch => {
        console.log(`     target node=${ch.target.node} path=${ch.target.path} sampler=${ch.sampler}`);
      });
    });
  }
  console.log('\n--- accessors count ---', gltf.accessors ? gltf.accessors.length : 0, 'bufferViews', gltf.bufferViews ? gltf.bufferViews.length : 0);
  if (binChunk) console.log('BIN chunk size:', binChunk.chunkLen);
}

const files = process.argv.slice(2);
if (!files.length) {
  console.log('Usage: node inspect_glb.js <file1> [file2] ...');
  process.exit(1);
}
files.forEach(inspect);
