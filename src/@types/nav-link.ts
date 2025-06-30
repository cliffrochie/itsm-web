import React from "react";

export interface INavLink {
  title: string;
  url: string;
  icon: React.FC;
  isActive: boolean;
}
