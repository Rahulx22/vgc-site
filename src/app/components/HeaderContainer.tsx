"use client";
import useSWR from "swr";
import Header from "./Header";

const fetcher = (u: string) => fetch(u, { cache: "no-store" }).then(r => r.json());

export default function HeaderContainer({ initial }: { initial: any }) {
  const { data } = useSWR("/api/config", fetcher, {
    fallbackData: initial,
    revalidateOnFocus: true,
  });
  return <Header data={data?.data?.header ?? null} />;
}
