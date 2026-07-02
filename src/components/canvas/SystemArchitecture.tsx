'use client';

import { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html, Line } from '@react-three/drei';

export interface TechNode {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops';
  pos: [number, number, number];
  details: string;
  skills: string[];
}

export const techNodes: TechNode[] = [
  // Frontend
  { id: 'next', name: 'Next.js & React', category: 'frontend', pos: [12.5, 1.2, 0], details: 'High-performance React frameworks for server-side rendering, static site generation, and responsive layouts.', skills: ['App Router', 'React Server Components', 'Server Actions', 'SEO optimization'] },
  { id: 'ts', name: 'TypeScript', category: 'frontend', pos: [11.3, 2.3, 0.4], details: 'Strict syntactical superset of JavaScript adding optional static typing for scalable architectures.', skills: ['Generics', 'Type Guards', 'Utility Types', 'TS Config'] },
  { id: 'three', name: 'Three.js / R3F', category: 'frontend', pos: [13.2, 2.5, -0.6], details: 'Procedural 3D web graphics, shaders, and animations using React Three Fiber.', skills: ['Shaders', 'WebGL Canvas', 'BufferGeometry', 'Three.js Timer'] },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', pos: [11.0, 0.7, -0.4], details: 'Utility-first styling system optimized for custom aesthetic layouts and glassmorphic designs.', skills: ['CSS variables', 'Neon drop-shadows', 'Fluid layouts', 'Custom grid systems'] },
  
  // Backend
  { id: 'node', name: 'Node.js Runtime', category: 'backend', pos: [15.5, 1.2, 0], details: 'Scalable server-side event-driven JavaScript engine built for high-performance networks.', skills: ['REST APIs', 'Event Loop', 'Buffers & Streams', 'API Route Handlers'] },
  { id: 'supabase', name: 'Supabase BaaS', category: 'backend', pos: [16.6, 2.3, 0.4], details: 'Backend-as-a-service utilizing PostgreSQL, real-time sync systems, secure auth APIs, and storage buckets.', skills: ['PostgreSQL DB', 'Row Level Security', 'Database triggers', 'Auth Gateways'] },
  { id: 'python', name: 'Python Core', category: 'backend', pos: [14.8, 2.5, -0.4], details: 'Advanced backend scripting, computational mathematical modules, and analytics pipelines.', skills: ['REST APIs', 'Numerical arrays', 'Pandas analytics', 'PyTorch / AI'] },
  { id: 'ws', name: 'WebSockets Engine', category: 'backend', pos: [16.8, 0.7, -0.6], details: 'Real-time, bi-directional, event-based network communication pipelines.', skills: ['Pub/Sub model', 'Polling fallback', 'Binary streams', 'State synchronization'] },

  // Database
  { id: 'postgres', name: 'PostgreSQL', category: 'database', pos: [15.5, -1.2, 0], details: 'Extensible, ACID-compliant object-relational SQL database engine.', skills: ['Query Indexes', 'Relational Schemas', 'JSONB Storage', 'Foreign keys'] },
  { id: 'redis', name: 'Redis Cache', category: 'database', pos: [16.8, -0.7, 0.4], details: 'In-memory key-value data storage, caching layers, and transient message broker.', skills: ['TTL expiration', 'Caching patterns', 'Pub/sub queues', 'Session storage'] },
  { id: 'prisma', name: 'Prisma ORM', category: 'database', pos: [16.6, -2.3, -0.6], details: 'Next-generation TypeScript database client providing automated type definitions.', skills: ['Migrations', 'Relation maps', 'Auto-generated types', 'Relations joining'] },
  { id: 'mongo', name: 'MongoDB', category: 'database', pos: [14.8, -2.5, 0.4], details: 'NoSQL document-based database featuring dynamic JSON schemas.', skills: ['Aggregation pipelines', 'Document shards', 'BSON storage', 'Mongoose schemas'] },

  // DevOps
  { id: 'docker', name: 'Docker / Containers', category: 'devops', pos: [12.5, -1.2, 0], details: 'Operating-system-level virtualization to deliver software in isolated container packages.', skills: ['Dockerfiles', 'Compose files', 'Image layers', 'Volume mounting'] },
  { id: 'aws', name: 'AWS Cloud', category: 'devops', pos: [11.0, -0.7, 0.4], details: 'Cloud compute platforms, simple file storage hosting, and lambda functions.', skills: ['EC2 nodes', 'S3 buckets', 'Lambda routes', 'IAM security'] },
  { id: 'cicd', name: 'CI/CD Pipelines', category: 'devops', pos: [11.3, -2.3, -0.6], details: 'Automated code integration, lint auditing, test checks, and Vercel hooks.', skills: ['GitHub Actions', 'Test suites', 'Deploy scripts', 'Environment logs'] },
  { id: 'vercel', name: 'Vercel Platform', category: 'devops', pos: [13.2, -2.5, 0.4], details: 'Next-generation hosting infrastructure for serverless web applications.', skills: ['Serverless routes', 'Edge middleware', 'CDN caching', 'Secure domains'] }
];

const connections: [string, string][] = [
  // Inner Core Loop
  ['next', 'node'],
  ['node', 'postgres'],
  ['postgres', 'docker'],
  ['docker', 'next'],
  
  // Frontend cluster connections
  ['next', 'ts'],
  ['next', 'three'],
  ['next', 'tailwind'],
  
  // Backend cluster connections
  ['node', 'supabase'],
  ['node', 'ws'],
  ['node', 'python'],
  
  // Database cluster connections
  ['postgres', 'redis'],
  ['postgres', 'prisma'],
  ['postgres', 'mongo'],
  
  // DevOps cluster connections
  ['docker', 'aws'],
  ['docker', 'cicd'],
  ['docker', 'vercel']
];

interface DataPulseProps {
  start: [number, number, number];
  end: [number, number, number];
  speed?: number;
  color?: string;
  delay?: number;
}

function DataPulse({ start, end, speed = 0.4, color = '#00f0ff', delay = 0 }: DataPulseProps) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end]);

  useFrame((state) => {
    if (!pulseRef.current) return;
    const time = state.clock.getElapsedTime();
    const progress = ((time * speed) + delay) % 1.0;
    
    // Lerp position along the vector line
    pulseRef.current.position.lerpVectors(startVec, endVec, progress);
  });

  return (
    <mesh ref={pulseRef}>
      <sphereGeometry args={[0.035, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
}

interface SystemArchitectureProps {
  onSelectNode: (node: TechNode | null) => void;
  selectedNode: TechNode | null;
}

export default function SystemArchitecture({ onSelectNode, selectedNode }: SystemArchitectureProps) {
  const meshAsset = null; // Mesh asset placeholder fallback
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Core rings rotation refs
  const nextRingRef = useRef<THREE.Mesh>(null);
  const nodeRingRef = useRef<THREE.Mesh>(null);
  const dbRingRef = useRef<THREE.Mesh>(null);
  const dockerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Slow rotation on system
      groupRef.current.rotation.y = Math.sin(time * 0.08) * 0.12;
    }

    // Spin core nodes orbital visual details
    if (nextRingRef.current) nextRingRef.current.rotation.y = time * 0.8;
    if (nodeRingRef.current) nodeRingRef.current.rotation.x = time * 0.8;
    if (dbRingRef.current) dbRingRef.current.rotation.z = time * 0.8;
    if (dockerRingRef.current) dockerRingRef.current.rotation.y = -time * 0.8;
  });

  // Material helpers based on category
  const getColor = (category: string, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) return '#00ff66'; // Glowing Green
    if (isHovered) return '#ff007f';  // Cyber Pink

    switch (category) {
      case 'frontend': return '#00f0ff'; // Cyan
      case 'backend': return '#bd00ff';  // Purple
      case 'database': return '#ff0055'; // Pinkish-Red
      case 'devops': return '#fbbf24';   // Amber Gold
      default: return '#9ca3af';
    }
  };

  const lineGeometries = useMemo(() => {
    return connections.map(([startId, endId], idx) => {
      const startNode = techNodes.find(n => n.id === startId);
      const endNode = techNodes.find(n => n.id === endId);
      
      if (!startNode || !endNode) return null;
      
      const startPos = new THREE.Vector3(...startNode.pos);
      const endPos = new THREE.Vector3(...endNode.pos);
      
      return {
        id: `${startId}-${endId}-${idx}`,
        points: [startPos, endPos],
        start: startNode.pos,
        end: endNode.pos,
        category: startNode.category
      };
    }).filter(Boolean);
  }, []);

  return (
    <group ref={groupRef}>
      {/* Mesh Asset Fallback */}
      {meshAsset ? <primitive object={meshAsset} /> : <mesh><boxGeometry args={[2, 2, 2]} /><meshBasicMaterial color="#00ffcc" wireframe /></mesh>}

      {/* 1. Connections using optimized Drei Line */}
      {lineGeometries.map((line) => {
        if (!line) return null;
        const color = line.category === 'frontend' ? '#00f0ff' : '#bd00ff';
        return (
          <Line
            key={line.id}
            points={line.points}
            color={color}
            lineWidth={0.8}
            transparent
            opacity={0.16}
            blending={THREE.AdditiveBlending}
          />
        );
      })}

      {/* 2. Floating Animated Data Pulses */}
      {lineGeometries.map((line, idx) => {
        if (!line) return null;
        const color = line.category === 'frontend' ? '#00f0ff' : '#bd00ff';
        return (
          <DataPulse
            key={`pulse-${line.id}`}
            start={line.start}
            end={line.end}
            speed={0.22 + (idx % 3) * 0.06}
            delay={(idx * 0.18) % 1}
            color={color}
          />
        );
      })}

      {/* 3. Core Nodes Specific Ring Highlights */}
      {/* Next.js core node ring (X=12.5, Y=1.2) */}
      <mesh ref={nextRingRef} position={[12.5, 1.2, 0]} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[0.55, 0.008, 6, 24]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.3} />
      </mesh>

      {/* Node.js core node ring (X=15.5, Y=1.2) */}
      <mesh ref={nodeRingRef} position={[15.5, 1.2, 0]} rotation={[0, Math.PI / 2.2, 0]}>
        <torusGeometry args={[0.55, 0.008, 6, 24]} />
        <meshBasicMaterial color="#bd00ff" transparent opacity={0.3} />
      </mesh>

      {/* PostgreSQL core node ring (X=15.5, Y=-1.2) */}
      <mesh ref={dbRingRef} position={[15.5, -1.2, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.55, 0.008, 6, 24]} />
        <meshBasicMaterial color="#ff0055" transparent opacity={0.3} />
      </mesh>

      {/* Docker core node ring (X=12.5, Y=-1.2) */}
      <mesh ref={dockerRingRef} position={[12.5, -1.2, 0]} rotation={[0, -Math.PI / 4, 0]}>
        <torusGeometry args={[0.55, 0.008, 6, 24]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.3} />
      </mesh>

      {/* 4. Tech Nodes (Styled by Category) */}
      {techNodes.map((node) => {
        const isHovered = hoveredNodeId === node.id;
        const isSelected = selectedNode?.id === node.id;
        const size = (node.id === 'next' || node.id === 'node' || node.id === 'postgres' || node.id === 'docker') ? 0.28 : 0.16;
        const color = getColor(node.category, isHovered, isSelected);

        return (
          <group key={node.id} position={node.pos}>
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredNodeId(node.id);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredNodeId(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(node);
              }}
            >
              {/* Category-based distinct geometries */}
              {node.category === 'frontend' && (
                <octahedronGeometry args={[size, 0]} />
              )}
              {node.category === 'backend' && (
                <dodecahedronGeometry args={[size, 0]} />
              )}
              {node.category === 'database' && (
                <cylinderGeometry args={[size * 0.8, size * 0.8, size * 1.5, 6, 1]} />
              )}
              {node.category === 'devops' && (
                <tetrahedronGeometry args={[size * 1.2, 0]} />
              )}

              <meshBasicMaterial
                color={color}
                wireframe={!isSelected && !isHovered}
              />
            </mesh>

            {/* Glowing outer wireframe shell */}
            {(isHovered || isSelected) && (
              <mesh scale={[1.6, 1.6, 1.6]}>
                <sphereGeometry args={[size, 10, 10]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={0.12}
                  wireframe
                />
              </mesh>
            )}

            {/* Hover HTML tooltip tag */}
            {isHovered && (
              <Html distanceFactor={6} position={[0, size + 0.35, 0]} center pointerEvents="none">
                <div className="bg-[#04040c] text-[#00ffcc] border border-[#00ffcc]/40 px-2 py-1 rounded text-[10px] uppercase tracking-wider shadow-lg whitespace-nowrap">
                  {node.name}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
