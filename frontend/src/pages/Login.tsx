import AuthForm from "@/components/ui/auth-form";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Login() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-24 flex justify-center items-center px-4">
        <div className="w-full max-w-md">
          <AuthForm type="login" />
        </div>
      </main>
      <Footer />
    </>
  );
}
