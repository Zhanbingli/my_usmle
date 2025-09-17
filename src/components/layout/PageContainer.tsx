import React from 'react';
import clsx from 'clsx';
import './PageContainer.css';

type PageVariant = 'surface' | 'glass' | 'gradient';
type PageWidth = 'default' | 'narrow' | 'wide' | 'full';

type PageContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: PageVariant;
  width?: PageWidth;
  padded?: boolean;
};

const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  (
    {
      variant = 'surface',
      width = 'default',
      padded = true,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={clsx(
          'page-container',
          `page-container--${variant}`,
          `page-container--${width}`,
          padded && 'page-container--padded',
          className
        )}
        {...rest}
      >
        {children}
      </section>
    );
  }
);

PageContainer.displayName = 'PageContainer';

export default PageContainer;
