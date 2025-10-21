// Quantum state simulator and mock level data

// Complex number helper
export class Complex {
  constructor(real, imag = 0) {
    this.real = real;
    this.imag = imag;
  }

  add(other) {
    return new Complex(this.real + other.real, this.imag + other.imag);
  }

  multiply(other) {
    return new Complex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }

  magnitude() {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }

  phase() {
    return Math.atan2(this.imag, this.real);
  }
}

// Quantum gate matrices
export const GATES = {
  H: [ // Hadamard
    [new Complex(1/Math.sqrt(2)), new Complex(1/Math.sqrt(2))],
    [new Complex(1/Math.sqrt(2)), new Complex(-1/Math.sqrt(2))]
  ],
  X: [ // Pauli-X (NOT)
    [new Complex(0), new Complex(1)],
    [new Complex(1), new Complex(0)]
  ],
  Z: [ // Pauli-Z
    [new Complex(1), new Complex(0)],
    [new Complex(0), new Complex(-1)]
  ],
  I: [ // Identity
    [new Complex(1), new Complex(0)],
    [new Complex(0), new Complex(1)]
  ]
};

// Apply single qubit gate
export function applySingleQubitGate(state, gate, targetQubit, numQubits) {
  const dim = Math.pow(2, numQubits);
  const newState = new Array(dim).fill(null).map(() => new Complex(0));

  for (let i = 0; i < dim; i++) {
    const bitMask = 1 << (numQubits - 1 - targetQubit);
    const bit = (i & bitMask) ? 1 : 0;

    const baseIdx = i & ~bitMask;
    const idx0 = baseIdx | (0 << (numQubits - 1 - targetQubit));
    const idx1 = baseIdx | (1 << (numQubits - 1 - targetQubit));

    if (bit === 0) {
      newState[i] = newState[i].add(gate[0][0].multiply(state[idx0]));
      newState[i] = newState[i].add(gate[0][1].multiply(state[idx1]));
    } else {
      newState[i] = newState[i].add(gate[1][0].multiply(state[idx0]));
      newState[i] = newState[i].add(gate[1][1].multiply(state[idx1]));
    }
  }

  return newState;
}

// Apply CNOT gate
export function applyCNOT(state, controlQubit, targetQubit, numQubits) {
  const dim = Math.pow(2, numQubits);
  const newState = new Array(dim);

  for (let i = 0; i < dim; i++) {
    const controlBit = (i >> (numQubits - 1 - controlQubit)) & 1;
    if (controlBit === 1) {
      // If control is 1, flip the target bit
      const targetBitMask = 1 << (numQubits - 1 - targetQubit);
      const flippedIdx = i ^ targetBitMask;
      newState[i] = state[flippedIdx];
    } else {
      // If control is 0, keep the state unchanged
      newState[i] = state[i];
    }
  }

  return newState;
}

// Apply SWAP gate
export function applySWAP(state, qubit1, qubit2, numQubits) {
  const dim = Math.pow(2, numQubits);
  const newState = [...state];

  for (let i = 0; i < dim; i++) {
    const bit1 = (i >> (numQubits - 1 - qubit1)) & 1;
    const bit2 = (i >> (numQubits - 1 - qubit2)) & 1;

    if (bit1 !== bit2) {
      const mask1 = 1 << (numQubits - 1 - qubit1);
      const mask2 = 1 << (numQubits - 1 - qubit2);
      const swappedIdx = (i ^ mask1) ^ mask2;

      if (i < swappedIdx) {
        [newState[i], newState[swappedIdx]] = [newState[swappedIdx], newState[i]];
      }
    }
  }

  return newState;
}

// Check if two states are equal (within tolerance)
export function statesEqual(state1, state2, tolerance = 0.01) {
  if (state1.length !== state2.length) return false;

  for (let i = 0; i < state1.length; i++) {
    const diff = Math.abs(state1[i].magnitude() - state2[i].magnitude());
    if (diff > tolerance) return false;
  }

  return true;
}

// Create initial state |00...0>
export function createInitialState(numQubits) {
  const dim = Math.pow(2, numQubits);
  const state = new Array(dim).fill(null).map(() => new Complex(0));
  state[0] = new Complex(1); // |0...0>
  return state;
}

// Convert state to basis states for display
export function stateToString(state, numQubits) {
  if (!state || state.length === 0) return '|...⟩';

  const dim = Math.pow(2, numQubits);
  let result = [];

  for (let i = 0; i < dim; i++) {
    if (!state[i]) continue;
    const amp = state[i].magnitude();
    if (amp > 0.001) {
      const basis = i.toString(2).padStart(numQubits, '0');
      const prob = (amp * amp * 100).toFixed(1);
      result.push(`|${basis}⟩: ${prob}%`);
    }
  }

  return result.length > 0 ? result.join(' + ') : '|0⟩';
}

// Mock levels data
export const LEVELS = [
  {
    id: 1,
    name: "Superposition Basics",
    description: "Learn about superposition by applying the Hadamard gate",
    tutorial: "The Hadamard (H) gate creates superposition - a qubit exists in both |0⟩ and |1⟩ states simultaneously. Try applying H to qubit 0!",
    numQubits: 1,
    initialState: [new Complex(1), new Complex(0)], // |0>
    targetState: [new Complex(1/Math.sqrt(2)), new Complex(1/Math.sqrt(2))], // |+>
    availableGates: ['H'],
    maxMoves: 1,
    difficulty: "Easy"
  },
  {
    id: 2,
    name: "Flip and Phase",
    description: "Master X and Z gates to manipulate qubit states",
    tutorial: "X gate flips |0⟩↔|1⟩. Z gate adds a phase to |1⟩. Combine H, X, and Z to reach the target!",
    numQubits: 1,
    initialState: [new Complex(1), new Complex(0)], // |0>
    targetState: [new Complex(1/Math.sqrt(2)), new Complex(-1/Math.sqrt(2))], // |->
    availableGates: ['H', 'X', 'Z'],
    maxMoves: 3,
    difficulty: "Easy"
  },
  {
    id: 3,
    name: "Entanglement Introduction",
    description: "Create quantum entanglement using CNOT",
    tutorial: "CNOT creates entanglement! Select control qubit, then target. Start with H on qubit 0, then CNOT(0→1).",
    numQubits: 2,
    initialState: [new Complex(1), new Complex(0), new Complex(0), new Complex(0)], // |00>
    targetState: [new Complex(1/Math.sqrt(2)), new Complex(0), new Complex(0), new Complex(1/Math.sqrt(2))], // |00>+|11> (Bell state)
    availableGates: ['H', 'X', 'CNOT'],
    maxMoves: 3,
    difficulty: "Medium"
  },
  {
    id: 4,
    name: "Three Qubit Dance",
    description: "Manipulate three qubits using SWAP and multi-qubit gates",
    tutorial: "SWAP exchanges qubit states. Use H, X, and SWAP to arrange the target pattern across 3 qubits.",
    numQubits: 3,
    initialState: [new Complex(1), new Complex(0), new Complex(0), new Complex(0), new Complex(0), new Complex(0), new Complex(0), new Complex(0)], // |000>
    targetState: [
      new Complex(0), new Complex(0), new Complex(0), new Complex(0),
      new Complex(1/Math.sqrt(2)), new Complex(0), new Complex(0), new Complex(1/Math.sqrt(2))
    ], // |100>+|111>
    availableGates: ['H', 'X', 'Z', 'CNOT', 'SWAP'],
    maxMoves: 5,
    difficulty: "Medium"
  },
  {
    id: 5,
    name: "Quantum Master",
    description: "Complex entangled state puzzle",
    tutorial: "Use all your quantum knowledge! Create a complex entangled state with precise gate sequences.",
    numQubits: 3,
    initialState: [new Complex(1), new Complex(0), new Complex(0), new Complex(0), new Complex(0), new Complex(0), new Complex(0), new Complex(0)],
    targetState: [
      new Complex(0.5), new Complex(0), new Complex(0.5), new Complex(0),
      new Complex(0), new Complex(0.5), new Complex(0), new Complex(0.5)
    ], // Complex superposition
    availableGates: ['H', 'X', 'Z', 'CNOT', 'SWAP'],
    maxMoves: 8,
    difficulty: "Hard"
  }
];
