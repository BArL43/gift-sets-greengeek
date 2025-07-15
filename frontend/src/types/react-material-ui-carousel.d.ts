declare module 'react-material-ui-carousel' {
  import { ReactNode } from 'react';
  import { SxProps, Theme } from '@mui/material';

  interface CarouselProps {
    animation?: 'fade' | 'slide';
    autoPlay?: boolean;
    interval?: number;
    indicators?: boolean;
    navButtonsAlwaysVisible?: boolean;
    navButtonsAlwaysInvisible?: boolean;
    cycleNavigation?: boolean;
    fullHeightHover?: boolean;
    swipe?: boolean;
    sx?: SxProps<Theme>;
    children: ReactNode;
  }

  const Carousel: React.FC<CarouselProps>;
  export default Carousel;
} 