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
export function applyCNOT(state, control, target, numQubits) {
  const dim = Math.pow(2, numQubits);
  const newState = [...state];

  for (let i = 0; i < dim; i++) {
    const controlMask = 1 << (numQubits - 1 - control);
    const targetMask = 1 << (numQubits - 1 - target);

    if (i & controlMask) {
      const targetBit = (i & targetMask) ? 1 : 0;
      const j = targetBit ? (i & ~targetMask) : (i | targetMask);

      // Prevent double swapping (only swap when i < j)
      if (i < j) {
        const temp = newState[i];
        newState[i] = newState[j];
        newState[j] = temp;
      }
    }
  }

  return newState;
}

// Apply SWAP gate
export function applySWAP(state, q1, q2, numQubits) {
  const dim = Math.pow(2, numQubits);
  const newState = [...state];

  for (let i = 0; i < dim; i++) {
    const mask1 = 1 << (numQubits - 1 - q1);
    const mask2 = 1 << (numQubits - 1 - q2);

    const bit1 = (i & mask1) ? 1 : 0;
    const bit2 = (i & mask2) ? 1 : 0;

    if (bit1 !== bit2) {
      const j = i ^ mask1 ^ mask2;
      if (i < j) {
        const temp = newState[i];
        newState[i] = newState[j];
        newState[j] = temp;
      }
    }
  }

  return newState;
}

// Helper to check if two states are equal (considering float precision)
export function statesEqual(s1, s2) {
  if (s1.length !== s2.length) return false;
  return s1.every((val, i) => {
    const diffReal = Math.abs(val.real - s2[i].real);
    const diffImag = Math.abs(val.imag - s2[i].imag);
    return diffReal < 0.001 && diffImag < 0.001;
  });
}

// Helper to format state for display
export function stateToString(state, numQubits) {
  return state.map((val, i) => {
    if (val.magnitude() < 0.001) return null;
    const sign = val.real < 0 ? '-' : '';
    const mag = val.magnitude();
    const bitString = i.toString(2).padStart(numQubits, '0');

    let coeff = '';
    if (Math.abs(mag - 1) < 0.01) coeff = '';
    else coeff = mag.toFixed(2);

    return `${sign}${coeff}|${bitString}⟩`;
  }).filter(Boolean).join(' + ');
}

// Levels Configuration
export const LEVELS = [
  {
    id: 1,
    name: "The First Step",
    description: "Initialize basic quantum bit rotation",
    tutorial: "OPERATOR: The Pauli-X gate is your primary bit-flip protocol. Invert the qubit from state |0⟩ to |1⟩ to stabilize the sector initial point.",
    numQubits: 1,
    initialState: [new Complex(1), new Complex(0)], // |0⟩
    targetState: [new Complex(0), new Complex(1)], // |1⟩
    availableGates: ['X'],
    maxMoves: 1,
    difficulty: "Beginner"
  },
  {
    id: 2,
    name: "Entering Superposition",
    description: "Create and manipulate superposition states",
    tutorial: "OPERATOR: The Hadamard gate splits the probability stream. Your qubit now pulses in parallel realities. Achieve 50/50 superposition to bypass the interference wall.",
    numQubits: 1,
    initialState: [new Complex(1), new Complex(0)], // |0⟩
    targetState: [new Complex(1/Math.sqrt(2)), new Complex(1/Math.sqrt(2))], // |+⟩
    availableGates: ['H', 'X'],
    maxMoves: 3,
    difficulty: "Easy"
  },
  {
    id: 3,
    name: "Entanglement Introduction",
    description: "Establish quantum entanglement bonds",
    tutorial: "CHIEF ARCHITECT: CNOT creates entanglement. Select control qubit, then target. Start with an H-gate on qubit 0, then bind them with CNOT(0→1). Forge the Bell state.",
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
    description: "Orchestrate triple-array synchronization",
    tutorial: "COMMANDER: SWAP exchanges qubit signatures. Use H, X, and SWAP to align the target pattern across all three nodes. Precision is mission-critical.",
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
    description: "High-density entanglement puzzle",
    tutorial: "CHIEF ARCHITECT: No room for error. Deploy all quantum protocols. Create a complex interleaved state using precise gate sequencing. Achieve the singularity.",
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
