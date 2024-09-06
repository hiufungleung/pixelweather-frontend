import React from 'react';
import PropTypes from 'prop-types';
import { LinearGradient } from 'expo-linear-gradient';

// GradientTheme component
const GradientTheme = ({ children }) => {
    return (
        <LinearGradient
          colors={['#363EFF', '#BCB2FE']} // Gradient effect
          style={{ flex: 1 }}>
          {children}
        </LinearGradient>
    );
};

GradientTheme.propTypes = {
    children: PropTypes.node.isRequired,
};

export default GradientTheme;