import { useCallback } from "react";
import { usePage, Link } from "@inertiajs/react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import {
  appsAccountsRoutesLogout,
  type CustomUserSchema,
} from "../../generated/client";

const queryClient = new QueryClient();

function NavBar() {
  const { url, props } = usePage();
  const current_user = props.current_user as unknown as CustomUserSchema;

  const logoutMutation = useMutation({
    mutationFn: () => appsAccountsRoutesLogout(),
    onSuccess: (data) => {
      console.log(data);
      if (data.error) {
        alert("Unable to log out");
      } else {
        window.location.href = "/";
      }
    },
  });

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  // function to underline(show active) the link for current route
  const pageClasses = useCallback(
    (checkUrl: string) => {
      return `text-white text-base ${checkUrl === url ? "underline" : ""}`;
    },
    [url],
  );

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <div className="text-gray-100 text-lg font-semibold">
          Log Book Keeper
        </div>
        <Link href="/logbooks" className="text-gray-200">
          Logbooks
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-white">
          {current_user.username ?? "Anonymous"}
        </span>
        <button
          type="button"
          onClick={logout}
          className="bg-gray-200 hover:bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default function Layout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="h-screen overflow-scroll bg-gray-200">
        <NavBar />
        <article>{children}</article>
      </main>
    </QueryClientProvider>
  );
}
