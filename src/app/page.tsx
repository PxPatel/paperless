import Hero from "@/components/hero";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Home() {
  return (
    <div className="text-8xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-b from-blue-400 to-blue-200">
      Paperless
    </div>
  );
}
