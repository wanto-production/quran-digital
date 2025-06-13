// components/Switch.tsx
import React from 'react';

export function Switch({ children }: { children: React.ReactNode }) {
  let match: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    //@ts-ignore
    if (child.type === Match && child.props.when && match === null) {
      match = child;
    }
  });

  return <>{match}</>;
}

export function Match({
  when,
  children,
}: {
  when: boolean;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

