import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export type ButtonVariant =
  | 'primary'
  | 'donate'
  | 'instagram'
  | 'secondary'
  | 'onDark'
  | 'success'
  | 'danger'
  | 'dangerSoft'
  | 'ghost'

export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonShape = 'pill' | 'rounded'

const BASE =
  'inline-flex items-center justify-center gap-2 text-center font-semibold ' +
  'transition-colors disabled:cursor-not-allowed'

// Les couleurs d'action viennent des jetons declares dans globals.css
// (bg-brand, bg-donate, bg-success, bg-danger), pas de la palette Tailwind
// brute : changer l'identite du site se fait dans ce seul fichier CSS.
const DISABLED_SOLID =
  'disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    `bg-brand text-white shadow-sm hover:bg-brand-hover active:bg-brand-active ${DISABLED_SOLID}`,
  donate:
    `bg-donate text-white shadow-sm hover:bg-donate-hover active:bg-donate-active ${DISABLED_SOLID}`,
  // Degrade Instagram (violet > rose > orange). Les paliers 700 et non 500/600 :
  // le blanc doit rester lisible sur TOUS les arrets, or pink-500 tombe a 3.58:1
  // et orange-500 a 2.89:1. Le survol assombrit, comme les autres variantes.
  instagram:
    'bg-gradient-to-r from-purple-700 via-pink-700 to-orange-700 text-white shadow-sm ' +
    'hover:brightness-90 active:brightness-80',
  secondary:
    'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 active:bg-gray-100 ' +
    'disabled:text-gray-400 disabled:hover:bg-white',
  onDark:
    'border-2 border-white text-white hover:bg-white hover:text-gray-900 active:bg-gray-100 ' +
    'disabled:border-white/40 disabled:text-white/40 disabled:hover:bg-transparent',
  success:
    `bg-success text-white shadow-sm hover:bg-success-hover active:bg-success-active ${DISABLED_SOLID}`,
  danger:
    `bg-danger text-white shadow-sm hover:bg-danger-hover active:bg-danger-active ${DISABLED_SOLID}`,
  // text-red-700 et non text-danger : sur bg-red-50 le rouge 600 tombe a 4.46:1.
  dangerSoft:
    'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200 ' +
    'disabled:text-red-300 disabled:hover:bg-red-50',
  ghost:
    'text-gray-700 hover:bg-gray-100 active:bg-gray-200 ' +
    'disabled:text-gray-400 disabled:hover:bg-transparent',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-4 py-2 text-sm',
  md: 'min-h-11 px-6 py-3 text-base',
  lg: 'min-h-12 px-8 py-4 text-lg',
}

const SHAPES: Record<ButtonShape, string> = {
  pill: 'rounded-full',
  rounded: 'rounded-xl',
}

type StyleProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  fullWidth?: boolean
  className?: string
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  fullWidth = false,
  className = '',
}: StyleProps = {}): string {
  return [
    BASE,
    VARIANTS[variant],
    SIZES[size],
    SHAPES[shape],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

type CommonProps = StyleProps & { children: ReactNode }

type NativeButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof CommonProps> & { href?: never }

type LinkButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof CommonProps> & { href: string }

export type ButtonProps = NativeButtonProps | LinkButtonProps

function isExternal(href: string): boolean {
  return /^(https?:|mailto:|tel:|#)/.test(href)
}

export function Button(props: ButtonProps) {
  const { variant, size, shape, fullWidth, className, children, ...rest } = props
  const classes = buttonClasses({ variant, size, shape, fullWidth, className })

  if (typeof rest.href === 'string') {
    const { href, ...anchorProps } = rest as ComponentPropsWithoutRef<'a'> & { href: string }

    if (isExternal(href)) {
      return (
        <a href={href} className={classes} {...anchorProps}>
          {children}
        </a>
      )
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    )
  }

  const buttonProps = rest as ComponentPropsWithoutRef<'button'>

  return (
    <button type={buttonProps.type ?? 'button'} className={classes} {...buttonProps}>
      {children}
    </button>
  )
}

export default Button
