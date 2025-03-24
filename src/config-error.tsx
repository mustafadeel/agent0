export const Auth0ConfigError = () => (
  <div className="container mx-auto flex h-screen flex-col items-center justify-center p-4">
    <div className="bg-card rounded-lg p-8 shadow-lg">
      <h1 className="text-foreground mb-4 text-2xl font-bold">
        Auth0 Configuration Error
      </h1>
      <p className="text-muted-foreground mb-4">
        Auth0 provider is not properly configured. Please check your environment
        variables.
      </p>
      <a
        href="https://auth0.com/docs/quickstart/spa/react/01-login#configure-auth0"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        View Auth0 Configuration Guide
      </a>
    </div>
  </div>
)
