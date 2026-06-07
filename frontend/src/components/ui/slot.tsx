"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal Slot: merges its props onto a single child element so components can
 * support an `asChild` pattern without pulling in @radix-ui/react-slot.
 */
export const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ children, className, ...props }, ref) => {
    if (!React.isValidElement(children)) return null;
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childProps = child.props;
    return React.cloneElement(child, {
      ...props,
      ...childProps,
      className: cn(className, childProps.className as string | undefined),
      ref,
    } as Record<string, unknown>);
  }
);
Slot.displayName = "Slot";
