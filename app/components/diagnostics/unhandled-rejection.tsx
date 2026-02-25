"use client";

import { useEffect } from "react";

export default function UnhandledRejectionLogger() {
  useEffect(() => {
    function formatReason(r: any) {
      if (r instanceof Error) return { message: r.message, stack: r.stack };
      try {
        return JSON.parse(JSON.stringify(r));
      } catch (_) {
        return String(r);
      }
    }

    function onUnhandledRejection(ev: PromiseRejectionEvent) {
      try {
        const reason = ev?.reason;
        console.error(
          "[Diagnostics] unhandledrejection reason:",
          reason,
          "(type:",
          typeof reason,
          ")"
        );
        console.error("[Diagnostics] formatted reason:", formatReason(reason));
        // show a stack for where this handler was invoked
        console.error("[Diagnostics] handler stack:", new Error().stack);
      } catch (e) {
        console.error("[Diagnostics] error logging unhandledrejection", e);
      }
    }

    function onError(ev: ErrorEvent) {
      try {
        console.error(
          "[Diagnostics] window.error:",
          ev.error ?? ev.message,
          "(at ",
          ev.filename,
          ":",
          ev.lineno,
          ")"
        );
      } catch (e) {
        console.error("[Diagnostics] error logging window.error", e);
      }
    }

    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("error", onError);

    return () => {
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("error", onError);
    };
  }, []);

  return null;
}