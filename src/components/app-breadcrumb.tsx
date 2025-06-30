import React from "react";
import { useLocation } from "react-router-dom";
import { capitalizeFirstLetterKebab } from "@/utils";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function AppBreadcrumb() {
  const location = useLocation();
  const currentPath = location.pathname.split("/").slice(1);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {currentPath.map((link) => (
            <React.Fragment key={link}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink>
                  <BreadcrumbPage>
                    {capitalizeFirstLetterKebab(link)}
                  </BreadcrumbPage>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
