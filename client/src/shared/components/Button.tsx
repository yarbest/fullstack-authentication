interface ButtonProps {
  onClick: () => void
  text: string
  isLoading?: boolean
  className?: string
}

const Button = ({
  className,
  onClick,
  text,
  isLoading,
}: ButtonProps) => {
  return (
    <button className={className} onClick={onClick}>{isLoading ? 'Loading...' : text}</button>
  )
}

export default Button
