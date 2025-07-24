import React from 'react';
import { Paper, Box, Skeleton } from '@mui/material';

const PostSkeleton = () => (
    <Paper
        elevation={0}
        sx={{
            width: '100%',
            height: '100%',
            minHeight: '520px',
            maxHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px',
            background: 'rgba(20, 20, 30, 0.7)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
        }}
    >
        {/* Header Section - Creator Info */}
        <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Skeleton 
                    variant="circular" 
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
                    width={40} 
                    height={40} 
                />
                <Box sx={{ flexGrow: 1 }}>
                    <Skeleton 
                        variant="text" 
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', fontSize: '1rem' }} 
                        width={120} 
                        height={20}
                    />
                    <Skeleton 
                        variant="text" 
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', fontSize: '0.75rem' }} 
                        width={80} 
                        height={16}
                    />
                </Box>
            </Box>
        </Box>

        {/* Media Section */}
        <Box sx={{ backgroundColor: '#000', flexShrink: 0 }}>
            <Skeleton 
                variant="rectangular" 
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }} 
                width="100%" 
                height={220} 
            />
        </Box>

        {/* Content Section */}
        <Box sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            flexGrow: 1,
            overflow: 'hidden'
        }}>
            {/* Title Skeleton */}
            <Box sx={{ mb: 1 }}>
                <Skeleton 
                    variant="text" 
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', fontSize: '1.25rem' }} 
                    width="90%" 
                    height={28}
                />
                <Skeleton 
                    variant="text" 
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', fontSize: '1.25rem' }} 
                    width="70%" 
                    height={28}
                />
            </Box>

            {/* Description Skeleton */}
            <Box sx={{ mb: 2 }}>
                <Skeleton 
                    variant="text" 
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
                    width="100%" 
                    height={16}
                />
                <Skeleton 
                    variant="text" 
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
                    width="85%" 
                    height={16}
                />
                <Skeleton 
                    variant="text" 
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
                    width="60%" 
                    height={16}
                />
            </Box>

            {/* Tags Skeleton */}
            <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                <Skeleton 
                    variant="rounded" 
                    sx={{ bgcolor: 'rgba(0, 255, 255, 0.1)', borderRadius: '16px' }} 
                    width={60} 
                    height={24} 
                />
                <Skeleton 
                    variant="rounded" 
                    sx={{ bgcolor: 'rgba(0, 255, 255, 0.1)', borderRadius: '16px' }} 
                    width={80} 
                    height={24} 
                />
                <Skeleton 
                    variant="rounded" 
                    sx={{ bgcolor: 'rgba(0, 255, 255, 0.1)', borderRadius: '16px' }} 
                    width={70} 
                    height={24} 
                />
            </Box>
        </Box>

        {/* Actions Footer */}
        <Box sx={{ 
            p: 2, 
            pt: 1, 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            flexShrink: 0
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Like Button Skeleton */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Skeleton 
                        variant="circular" 
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
                        width={20} 
                        height={20} 
                    />
                    <Skeleton 
                        variant="text" 
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
                        width={30} 
                        height={20}
                    />
                </Box>
                
                {/* Action Buttons Skeleton */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Skeleton 
                        variant="circular" 
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} 
                        width={32} 
                        height={32} 
                    />
                    <Skeleton 
                        variant="circular" 
                        sx={{ bgcolor: 'rgba(248, 113, 113, 0.1)' }} 
                        width={32} 
                        height={32} 
                    />
                </Box>
            </Box>
        </Box>
    </Paper>
);

export default PostSkeleton;