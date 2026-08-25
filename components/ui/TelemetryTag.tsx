import type { ReactNode } from 'react';

interface TelemetryTagProps {
  children: ReactNode;
  pulse?: boolean;
}

export default function TelemetryTag({ children, pulse = false }: TelemetryTagProps) {
  return (
    <span className="ui-tag">
      {pulse && <span className="ui-tag-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
