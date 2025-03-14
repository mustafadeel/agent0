export const Auth0ConfigError = () => (
  <div style={{ padding: "20px", textAlign: "center" }}>
    <h1>Auth0 Configuration Error</h1>
    <p>
      Auth0 provider is not properly configured. Please check your environment
      variables.
    </p>
    <p>
      <a
        href="https://auth0.com/ai/docs#user-authentication"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Auth0 Configuration Guide
      </a>
    </p>
  </div>
);
