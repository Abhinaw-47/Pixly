import React from 'react';
import { Box } from '@mui/material';
import { FaUserNinja, FaUserAstronaut, FaRobot, FaDragon, FaCat } from 'react-icons/fa';
import { keyframes } from '@mui/system';

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const CartoonAvatar = ({ name, size = 120 }) => {
  const avatars = [
    { icon: FaUserNinja, bg: 'linear-gradient(135deg, #a78bfa, #7c3aed)' },
    { icon: FaUserAstronaut, bg: 'linear-gradient(135deg, #7dd3fc, #0ea5e9)' },
    { icon: FaRobot, bg: 'linear-gradient(135deg, #6ee7b7, #10b981)' },
    { icon: FaDragon, bg: 'linear-gradient(135deg, #fb923c, #f97316)' },
    { icon: FaCat, bg: 'linear-gradient(135deg, #f472b6, #ec4899)' },
  ];

  const getAvatarForName = (name) => {
    if (!name) return avatars[0];
    const index = name.charCodeAt(0) % avatars.length;
    return avatars[index];
  };

  const avatar = getAvatarForName(name);
  const IconComponent = avatar.icon;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        p: '4px',
        background: 'linear-gradient(45deg, #00FFFF, #2E73E8)',
        boxShadow: '0 10px 30px rgba(0, 255, 255, 0.3)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: avatar.bg,
          backgroundSize: '200% 200%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: `${gradientShift} 5s ease-in-out infinite`,
        }}
      >
        <IconComponent 
          size={size * 0.55} 
          color="white" 
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }} 
        />
      </Box>
    </Box>
  );
};

export default CartoonAvatar;