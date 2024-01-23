import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export const useAuthHook = () => {
  const [bearerToken, setBearerToken] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("Checking tokens");
    const isNewToken = searchParams.get("new_token") === "true";

    if (isNewToken) {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2)
          return parts.pop()?.split(";").shift()?.replaceAll('"', "");
      };

      const token = getCookie("Authorization");

      if (token) {
        sessionStorage.setItem("BearerToken", token);
        setBearerToken(token);
        // Update the search parameters to remove new_token
        router.push(pathname);
      }
    }
  }, [searchParams]);

  return bearerToken;
};
