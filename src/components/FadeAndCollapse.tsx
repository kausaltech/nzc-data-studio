import type { ReactNode } from 'react';
import type {
  FadeProps as FadePropsT,
  CollapseProps as CollapsePropsT} from '@mui/material';
import {
  Fade,
  Collapse,
} from '@mui/material';

type Props = {
  in: boolean;
  FadeProps?: FadePropsT;
  CollapseProps?: CollapsePropsT;
  children: ReactNode;
};

export function FadeAndCollapse({
  in: isIn,
  FadeProps,
  CollapseProps,
  children,
}: Props) {
  return (
    <Fade in={isIn} timeout={{ enter: 1000, exit: 250 }} {...FadeProps}>
      <div>
        <Collapse in={isIn} {...CollapseProps}>
          <div>{children}</div>
        </Collapse>
      </div>
    </Fade>
  );
}
