import { classNames } from '@/utils'
import React, { ComponentPropsWithRef, ElementType, forwardRef } from 'react'
import { ButtonProps } from './Button.types'

type PolymorphicRef<T extends ElementType> = ComponentPropsWithRef<T>['ref']

type PolymorphicButtonComponent = <T extends ElementType = 'button'>(
  props: ButtonProps<T> & { ref?: PolymorphicRef<T> }
) => React.ReactElement | null

/**
 * KRDS Button Component
 * @param variant button variant ('primary' | 'secondary' | 'tertiary' | 'text' | 'icon')
 * @param size button size ('xsmall' | 'small' | 'medium' | 'large' | 'xlarge')
 * @param className custom class name
 */
const ButtonImplementation = <T extends ElementType = 'button'>(
  { as, children, variant = 'primary', size = 'large', className = '', role = 'button', disabled = false, ...restProps }: ButtonProps<T>,
  ref: PolymorphicRef<T>
) => {
  const Component = as || 'button'
  const typeProp = restProps.type || (Component === 'button' ? 'button' : undefined)

  const buttonClasses = classNames('krds-btn', variant, size, disabled && 'disabled', className)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!disabled) {
        ;(event.currentTarget as HTMLButtonElement).click()
      }
    }
  }

  return (
    <Component
      ref={ref}
      className={buttonClasses}
      disabled={disabled}
      aria-disabled={Component !== 'button' ? disabled : undefined}
      onKeyDown={handleKeyDown}
      role={role}
      type={typeProp}
      {...restProps}
    >
      {children}
    </Component>
  )
}

const ButtonComponent = forwardRef(ButtonImplementation as any)
ButtonComponent.displayName = 'Button'
const Button = ButtonComponent as PolymorphicButtonComponent

export default Button
