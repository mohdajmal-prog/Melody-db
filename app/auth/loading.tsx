export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Loading authentication...</p>
      </div>
    </div>
  )
}
