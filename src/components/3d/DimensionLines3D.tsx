import React from 'react';
import { Html, Line } from '@react-three/drei';

interface DimensionLines3DProps {
  visible: boolean;
  isFolded?: boolean;
}

export const DimensionLines3D: React.FC<DimensionLines3DProps> = ({
  visible,
  isFolded = false
}) => {
  if (!visible) return null;

  // Model dimensions in meters:
  // Height = ~0.118m (117.8 mm)
  // Width open = ~0.165m (164.6 mm), closed = ~0.084m (84.1 mm)
  // Depth open = ~0.0052m (5.2 mm), closed = ~0.0113m (11.3 mm)
  const currentWidth = isFolded ? 0.0841 : 0.1646;
  const halfWidth = currentWidth / 2;
  const halfHeight = 0.1178 / 2;
  const depth = isFolded ? 0.0113 : 0.0052;

  return (
    <group position={[0, 0.01, 0]}>
      {/* 1. Width Dimension Line (Top) */}
      <group position={[0, halfHeight + 0.02, 0]}>
        <Line
          points={[
            [-halfWidth, 0, 0],
            [halfWidth, 0, 0]
          ]}
          color="#86868b"
          lineWidth={1}
          dashed={false}
        />
        {/* Left Tick */}
        <Line
          points={[
            [-halfWidth, -0.006, 0],
            [-halfWidth, 0.006, 0]
          ]}
          color="#86868b"
          lineWidth={1}
        />
        {/* Right Tick */}
        <Line
          points={[
            [halfWidth, -0.006, 0],
            [halfWidth, 0.006, 0]
          ]}
          color="#86868b"
          lineWidth={1}
        />
        <Html center position={[0, 0.012, 0]} className="dimension-badge-html" style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '3px 8px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '11px',
            fontWeight: 600,
            color: '#1d1d1f',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}>
            {isFolded ? '84.1 mm closed' : '164.6 mm open'}
          </div>
        </Html>
      </group>

      {/* 2. Height Dimension Line (Right) */}
      <group position={[halfWidth + 0.02, 0, 0]}>
        <Line
          points={[
            [0, -halfHeight, 0],
            [0, halfHeight, 0]
          ]}
          color="#86868b"
          lineWidth={1}
        />
        {/* Bottom Tick */}
        <Line
          points={[
            [-0.006, -halfHeight, 0],
            [0.006, -halfHeight, 0]
          ]}
          color="#86868b"
          lineWidth={1}
        />
        {/* Top Tick */}
        <Line
          points={[
            [-0.006, halfHeight, 0],
            [0.006, halfHeight, 0]
          ]}
          color="#86868b"
          lineWidth={1}
        />
        <Html center position={[0.02, 0, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '3px 8px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '11px',
            fontWeight: 600,
            color: '#1d1d1f',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}>
            117.8 mm
          </div>
        </Html>
      </group>

      {/* 3. Depth & Weight Callout (Bottom Center) */}
      <group position={[0, -halfHeight - 0.025, depth / 2]}>
        <Html center position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '11px',
              fontWeight: 600,
              color: '#0071e3',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}>
              Depth: {isFolded ? '11.3 mm' : '5.2 mm'}
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '11px',
              fontWeight: 600,
              color: '#1d1d1f',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}>
              Mass: 254 g
            </span>
          </div>
        </Html>
      </group>
    </group>
  );
};
