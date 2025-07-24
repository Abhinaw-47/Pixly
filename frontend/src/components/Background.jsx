import React from 'react';
import { Box } from '@mui/material';
import LightRays from './LightRays';

const Background = () => (
  <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', zIndex: 0, backgroundColor: '#000000' }}>
    <LightRays
      raysOrigin="top-center"
      raysColor="#FFFFFF"
      raysSpeed={0.5}
      lightSpread={3.2}     // More Spread
      rayLength={8.0}       // Fuller Length
      saturation={0.9}      // Softer white, not harsh
      followMouse={true}
      mouseInfluence={0.04}
      noiseAmount={0.08}
      distortion={0.03}
    />
  </Box>
);

export default Background;