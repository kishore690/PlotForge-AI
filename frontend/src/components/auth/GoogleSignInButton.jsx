import { useEffect, useRef, useState } from "react";

let googleIdentityScript;

function loadGoogleIdentity() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleIdentityScript) return googleIdentityScript;

  googleIdentityScript = new Promise((resolve, reject) => {
    let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
    }
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", () => reject(new Error("Google sign-in could not load. Check your internet connection and retry.")), { once: true });
    if (!script.isConnected) document.head.appendChild(script);
  }).catch((error) => {
    googleIdentityScript = null;
    throw error;
  });

  return googleIdentityScript;
}

export default function GoogleSignInButton({ register, disabled, onCredential, onError }) {
  const container = useRef(null);
  const credentialHandler = useRef(onCredential);
  const errorHandler = useRef(onError);
  const [loadError, setLoadError] = useState("");
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

  useEffect(() => { credentialHandler.current = onCredential; }, [onCredential]);
  useEffect(() => { errorHandler.current = onError; }, [onError]);

  useEffect(() => {
    let mounted = true;
    if (!clientId) return undefined;

    loadGoogleIdentity().then(() => {
      if (!mounted || !container.current) return;
      const google = window.google;
      if (!google?.accounts?.id) throw new Error("Google sign-in did not initialize correctly.");
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (!response.credential) {
            errorHandler.current?.("Google did not return a sign-in credential. Please try again.");
            return;
          }
          credentialHandler.current?.(response.credential);
        },
        ux_mode: "popup",
      });
      container.current.replaceChildren();
      google.accounts.id.renderButton(container.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: register ? "signup_with" : "signin_with",
        width: Math.min(360, Math.max(240, container.current.clientWidth || 320)),
      });
    }).catch((error) => {
      if (mounted) setLoadError(error.message || "Google sign-in could not load.");
    });

    return () => { mounted = false; };
  }, [clientId, register]);

  if (!clientId) return null;

  return <div>
    <div ref={container} className={`flex min-h-10 justify-center overflow-hidden ${disabled ? "pointer-events-none opacity-50" : ""}`} />
    {loadError && <p role="alert" className="mt-2 text-center text-xs text-red-400">{loadError}</p>}
  </div>;
}
