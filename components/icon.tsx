"use client";

import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

// Type for icon names - extract all icon names from lucide-react
export type IconName = keyof typeof LucideIcons;

interface IconProps extends Omit<LucideProps, "name"> {
  name: IconName;
}

const Icon = ({ name, ...props }: IconProps) => {
  // Get the icon component from lucide-react
  const IconComponent = LucideIcons[
    name as keyof typeof LucideIcons
  ] as React.ComponentType<LucideProps>;

  if (!IconComponent) {
    return null;
  }

  return <IconComponent {...props} />;
};

export default Icon;
