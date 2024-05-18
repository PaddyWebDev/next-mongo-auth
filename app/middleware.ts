import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/guest/Login",
    verifyRequest: "/verify-user",
  },
});
export const config = {
  matcher: ["/auth/Dashboard/:path*"],
};
