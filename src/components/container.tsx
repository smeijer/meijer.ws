import React, { ForwardedRef, forwardRef } from "react";
import clsx from 'clsx'

const OuterContainer = forwardRef<HTMLDivElement, JSX.IntrinsicElements['div']>(function OuterContainer(
  { className, children, ...props },
  ref
) {
  return (
    <div ref={ref} className={clsx('sm:px-8', className)} {...props}>
      <div className="mx-auto max-w-7xl lg:px-8">{children}</div>
    </div>
  )
})

const InnerContainer = forwardRef<HTMLDivElement, JSX.IntrinsicElements['div']>(function InnerContainer(
  { className, children, ...props },
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className={clsx('relative px-4 sm:px-8 lg:px-12', className)}
      {...props}
    >
      <div className="mx-auto max-w-2xl lg:max-w-5xl">{children}</div>
    </div>
  )
})

const ContainerComponent = forwardRef<HTMLDivElement, JSX.IntrinsicElements['div']>(function Container(
  { children, ...props },
  ref,
) {
  return (
    <OuterContainer ref={ref as any} {...props}>
      <InnerContainer>{children}</InnerContainer>
    </OuterContainer>
  )
});

export const Container = Object.assign(ContainerComponent, {
  Outer: OuterContainer,
  Inner: InnerContainer,
});
