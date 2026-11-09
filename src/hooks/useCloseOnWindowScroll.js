import { useEffect, useRef } from "react";

export function useCloseOnWindowScroll(enabled, onClose) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return undefined;
    }

    const handleWindowScroll = () => {
      onCloseRef.current?.();
    };

    const passiveOptions = { passive: true };

    window.addEventListener("wheel", handleWindowScroll, passiveOptions);
    window.addEventListener("touchmove", handleWindowScroll, passiveOptions);

    return () => {
      window.removeEventListener("wheel", handleWindowScroll);
      window.removeEventListener("touchmove", handleWindowScroll);
    };
  }, [enabled]);
}
