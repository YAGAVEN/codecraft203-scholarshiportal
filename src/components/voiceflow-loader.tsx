"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    voiceflow?: any
  }
}

export default function VoiceflowLoader() {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "module"
    script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"
    script.onload = () => {
      try {
        if (window.voiceflow?.chat?.load) {
          window.voiceflow.chat.load({
            verify: { projectID: "68ece578ff97cf74d0874b25" },
            url: "https://general-runtime.voiceflow.com",
            versionID: "production",
            voice: {
              url: "https://runtime-api.voiceflow.com",
            },
          })
        }
      } catch (e) {
        // ignore errors from voiceflow loader
        console.error("Voiceflow load error", e)
      }
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script)
    }
  }, [])

  return null
}
