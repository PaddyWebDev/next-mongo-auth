import { HomeIcon } from "@/components/icons";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function useRoutes() {
  const pathName = usePathname();

  const routes = useMemo(
    () => [
      {
        label: "Dashboard",
        href: "/auth/Dashboard",
        icon: HomeIcon,
        active: pathName === "/auth/Dashboard",
      },
    ],
    [pathName]
  );

  return routes;
}
