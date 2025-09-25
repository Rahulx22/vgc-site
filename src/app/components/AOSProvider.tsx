"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-out",
    });
  }, []);

  useEffect(() => {
    // re-run on route change so newly mounted elements get animated
    AOS.refreshHard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return children as React.ReactElement;
}



