'use client'
import React, { useEffect, useState } from 'react';
import { SettingAPi, RefundPolicySettings } from '@/components/service/SettingService';
import { Container, Typography, Paper, Box, CircularProgress, Divider } from '@mui/material';
import { m } from 'framer-motion';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #1a237e, #283593)',
    }
}));

const HeaderSection = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(6),
    padding: theme.spacing(4),
    background: 'linear-gradient(135deg, #f5f7ff 0%, #e8eaf6 100%)',
    borderRadius: theme.spacing(2),
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(26, 35, 126, 0.2), transparent)',
    }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1a237e, #283593)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: theme.spacing(2),
    boxShadow: '0 4px 20px rgba(26, 35, 126, 0.2)',
    '& svg': {
        fontSize: 40,
        color: '#ffffff'
    }
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
    '& p': { 
        marginBottom: theme.spacing(2), 
        lineHeight: 1.8,
        color: '#37474f'
    },
    '& h2': { 
        color: '#1a237e',
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2),
        fontWeight: 600,
        fontSize: '1.5rem',
        position: 'relative',
        paddingLeft: theme.spacing(2),
        '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '70%',
            background: '#1a237e',
            borderRadius: '2px'
        }
    },
    '& ul': { 
        paddingLeft: theme.spacing(4),
        marginBottom: theme.spacing(2)
    },
    '& li': { 
        marginBottom: theme.spacing(1),
        lineHeight: 1.6,
        color: '#37474f'
    }
}));

const RefundAndCancellation: React.FC = () => {
    const [policy, setPolicy] = useState<RefundPolicySettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const response = await SettingAPi.getRefundPolicy();
                if (response.success) {
                    setPolicy(response.data);
                } else {
                    setError('Failed to load refund policy');
                }
            } catch (err) {
                setError('An error occurred while loading the refund policy');
            } finally {
                setLoading(false);
            }
        };

        fetchPolicy();
    }, []);

    if (loading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="60vh"
                sx={{
                    background: 'linear-gradient(135deg, #f5f7ff 0%, #e8eaf6 100%)',
                }}
            >
                <CircularProgress sx={{ color: '#1a237e' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography 
                    color="error" 
                    variant="h6" 
                    textAlign="center"
                    sx={{
                        padding: 3,
                        background: '#ffebee',
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(244, 67, 54, 0.1)'
                    }}
                >
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ 
            py: 6,
            background: 'linear-gradient(135deg, #f5f7ff 0%, #e8eaf6 100%)',
            minHeight: '100vh'
        }}>
            <Container maxWidth="lg">
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <StyledPaper>
                        <HeaderSection>
                            <IconWrapper>
                                <MoneyOffIcon />
                            </IconWrapper>
                            <Typography 
                                variant="h3" 
                                component="h1" 
                                sx={{ 
                                    color: '#1a237e',
                                    fontWeight: 700,
                                    mb: 2
                                }}
                            >
                                {policy?.title || 'Refund and Cancellation Policy'}
                            </Typography>
                            <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                    color: '#546e7a',
                                    maxWidth: '600px',
                                    margin: '0 auto'
                                }}
                            >
                                Understanding our refund and cancellation procedures helps ensure a smooth experience.
                            </Typography>
                        </HeaderSection>
                        
                        <Divider sx={{ my: 4, opacity: 0.1 }} />
                        
                        <ContentWrapper
                            dangerouslySetInnerHTML={{ __html: policy?.content || '' }}
                        />
                    </StyledPaper>
                </m.div>
            </Container>
        </Box>
    );
};

export default RefundAndCancellation;
