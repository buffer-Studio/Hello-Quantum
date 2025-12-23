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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo and Title */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Atom className="h-20 w-20 text-primary animate-pulse" />
            <h1 className="text-6xl font-bold text-primary tracking-tight">
              Hello Quantum
            </h1>
          </div>
          <p className="text-2xl text-muted-foreground mb-4 font-light">
            Learn Quantum Computing Through Interactive Puzzles
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Master the fundamentals of quantum mechanics - qubits, superposition, and entanglement -
            through visual and interactive challenges. No equations required!
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card border-border shadow-sm p-6 hover:shadow-md transition-shadow">
            <Cpu className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Real Quantum Logic</h3>
            <p className="text-muted-foreground text-sm">
              Authentic quantum state simulator with matrix operations
            </p>
          </Card>

          <Card className="bg-card border-border shadow-sm p-6 hover:shadow-md transition-shadow">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">5 Challenging Levels</h3>
            <p className="text-muted-foreground text-sm">
              Progressive difficulty from basic gates to complex entanglement
            </p>
          </Card>

          <Card className="bg-card border-border shadow-sm p-6 hover:shadow-md transition-shadow">
            <Atom className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Visual Learning</h3>
            <p className="text-muted-foreground text-sm">
              Intuitive visualization of quantum states and operations
            </p>
          </Card>
        </div>

        {/* CTA */}
        <Button
          onClick={() => navigate('/levels')}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-xl font-bold rounded-lg shadow-md transition-all duration-300 hover:translate-y-[-2px]"
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
