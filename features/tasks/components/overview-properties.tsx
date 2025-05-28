import React from "react";

interface OverviewPropertiesProps {
  label: string;
  children: React.ReactNode;
}

const OverviewProperties = ({ label, children }: OverviewPropertiesProps) => {
  return (
    <div className="flex flex-start gap-x-2">
      <div className="min-w-[100px]">
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <div className="flex items-center gap-x-2">{children}</div>
    </div>
  );
};

export default OverviewProperties;
