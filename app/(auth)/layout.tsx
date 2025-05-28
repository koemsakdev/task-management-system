interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({children}: AuthLayoutProps) => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted antialiased">
      {children}
    </div>
  )
}

export default AuthLayout