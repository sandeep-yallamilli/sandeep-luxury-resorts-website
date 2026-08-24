import { useEffect, useRef, useCallback } from "react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

interface GoogleCredentialResponse {
  credential: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, string>
          ) => void;
        };
      };
    };
  }
}

export default function GoogleLoginButton() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleCredentialResponse = useCallback(
    async (response: GoogleCredentialResponse) => {
      try {
        const data = await apiClient.googleLogin(response.credential);
        login(data.token);
        alert("Signed in with Google successfully!");
        navigate("/");
      } catch (error) {
        console.error("Google login error:", error);
        alert("Google authentication failed.");
      }
    },
    [login, navigate]
  );

  useEffect(() => {
    let script = document.getElementById(
      "google-gis-script"
    ) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "google-gis-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const initGoogleGis = () => {
      if (typeof window !== "undefined" && window.google) {
        const client_id =
          import.meta.env.VITE_GOOGLE_CLIENT_ID ||
          "565011709405-c1e13o1c3cr80351rsh2cqq096m9d28s.apps.googleusercontent.com";
        window.google.accounts.id.initialize({
          client_id,
          callback: handleCredentialResponse,
        });

        if (buttonRef.current) {
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
            logo_alignment: "left",
          });
        }
      }
    };

    script.addEventListener("load", initGoogleGis);

    // Try initializing in case script is already loaded
    if (typeof window !== "undefined" && window.google) {
      initGoogleGis();
    }

    return () => {
      script?.removeEventListener("load", initGoogleGis);
    };
  }, [handleCredentialResponse]);

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-3 mt-4">
      <div className="w-full flex items-center justify-center gap-4 text-[10px] text-foreground/40 my-2">
        <div className="h-px bg-gold/25 flex-1" />
        <span className="tracking-widest uppercase font-semibold">Or continue with</span>
        <div className="h-px bg-gold/25 flex-1" />
      </div>
      <div ref={buttonRef} className="w-full flex justify-center" id="google-signin-button" />
    </div>
  );
}
