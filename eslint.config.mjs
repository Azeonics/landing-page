import next from 'eslint-config-next';

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'public/**', 'test-results/**'] },
  ...next,
  {
    // Imperative animation surfaces (GSAP tickers, R3F useFrame, latest-value
    // refs): the compiler-era hook rules flag the mutation-by-design patterns
    // these APIs are built on. Everything else keeps full strictness.
    files: [
      'components/layout/PageTransition.tsx',
      'components/hero/HeroScene.tsx',
      'components/sections/AssemblyDiagram.tsx',
      'components/sections/AssemblyModelScene.tsx',
    ],
    rules: {
      'react-hooks/refs': 'off',
      'react-hooks/immutability': 'off',
    },
  },
];

export default config;
