import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Cpu, Atom, Zap } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import QuantumGame from './pages/QuantumGame';
import LevelSelect from './pages/LevelSelect';
import { Toaster } from './components/ui/toaster';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo and Title */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Atom className="h-20 w-20 text-cyan-400 animate-pulse" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Hello Quantum
            </h1>
          </div>
          <p className="text-2xl text-gray-300 mb-4">
            Learn Quantum Computing Through Interactive Puzzles
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Master the fundamentals of quantum mechanics - qubits, superposition, and entanglement -
            through visual and interactive challenges. No equations required!
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-black/40 backdrop-blur border-cyan-500/30 p-6">
            <Cpu className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-cyan-300 mb-2">Real Quantum Logic</h3>
            <p className="text-gray-400 text-sm">
              Authentic quantum state simulator with matrix operations
            </p>
          </Card>

          <Card className="bg-black/40 backdrop-blur border-purple-500/30 p-6">
            <Zap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-purple-300 mb-2">5 Challenging Levels</h3>
            <p className="text-gray-400 text-sm">
              Progressive difficulty from basic gates to complex entanglement
            </p>
          </Card>

          <Card className="bg-black/40 backdrop-blur border-pink-500/30 p-6">
            <Atom className="h-12 w-12 text-pink-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-pink-300 mb-2">Visual Learning</h3>
            <p className="text-gray-400 text-sm">
              Intuitive visualization of quantum states and operations
            </p>
          </Card>
        </div>

        {/* CTA */}
        <Button
          onClick={() => navigate('/levels')}
          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white px-8 py-6 text-xl font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
        >
          Start Learning Quantum
        </Button>

        {/* Info */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Developed by Yuvraj</p>
          <p className="mt-2">Available quantum gates: H, X, Z, CNOT, SWAP</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/levels" element={<LevelSelect />} />
          <Route path="/game/:levelId" element={<QuantumGame />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
