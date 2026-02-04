import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

/**
 * ParallaxWrapper provides a mouse-reactive depth effect.
 * It uses framer-motion to tilt the content based on cursor position.
 */
const ParallaxWrapper = ({ children, amount = 15 }) => {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth springs for high-end feel
  const rotateX = useSpring(useTransform(y, [0, 1], [amount, -amount]), { stiffness: 60, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-amount, amount]), { stiffness: 60, damping: 20 });

  // Mobile detection
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (event) => {
    if (isMobile) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
  };

  const handleMouseLeave = () => {
    // Reset to center on leave
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div
      className="perspective-container w-full h-full relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full relative"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxWrapper;
