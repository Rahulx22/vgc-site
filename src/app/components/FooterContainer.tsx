"use client";
import useSWR from "swr";
import Footer from "./Footer";

const fetcher = (u: string) => fetch(u, { cache: "no-store" }).then(r => r.json());

export default function FooterContainer({ initial }: { initial: any }) {
  const { data } = useSWR("/api/config", fetcher, {
    fallbackData: initial,
    revalidateOnFocus: true,
  });
  return <Footer data={data?.data?.footer ?? null} />;
}
