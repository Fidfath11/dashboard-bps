// D:\BPS_Dashboard\ai-data-dashboard\theme\theme.js
import { extendTheme } from '@chakra-ui/react'; 

// Warna
const colors = {
  brand: {
    primary: '#002B6A', 
    primaryAccent: '#2D95C9',
  },
};

// Font 
const fonts = {
  heading: 'Inter, sans-serif',
  body: 'Inter, sans-serif',
};

// Radius Sudut 
const radii = {
  sm: '4px',
  md: '8px',
  lg: '12px',
};

// Bayangan (Shadows)
const shadows = {
  sm: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
  md: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
  lg: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
};

// Gunakan extendTheme seperti di Chakra UI v1/v2
const theme = extendTheme({ colors, fonts, radii, shadows });

export default theme;