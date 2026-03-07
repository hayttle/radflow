import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Nav */}
      <nav className="w-full border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-16">
          <span className="font-semibold text-primary text-lg tracking-tight">
            🚀 Boilerplate
          </span>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Link
              href="/auth/login"
              className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
            >
              Entrar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center gap-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-2">
          Next.js + Supabase Boilerplate
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight max-w-2xl leading-tight">
          Comece seu SaaS em{" "}
          <span className="text-primary">minutos</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl">
          Stack moderna com autenticação, banco de dados e design system prontos.
          Siga os passos abaixo para configurar o projeto.
        </p>
        <Link
          href="/auth/sign-up"
          className="mt-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          Criar conta gratuita →
        </Link>
      </section>

      {/* Setup Steps */}
      <section className="max-w-3xl mx-auto w-full px-6 pb-20">
        <h2 className="text-xl font-bold mb-6 text-center">
          ⚙️ Configuração inicial
        </h2>
        <div className="flex flex-col gap-4">
          {/* Step 1 */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                1
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1">Crie um projeto no Supabase</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Acesse{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    supabase.com
                  </a>{" "}
                  e crie um novo projeto. Em seguida, vá em{" "}
                  <strong>Project Settings → API</strong> para obter suas credenciais.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                2
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1">Configure as variáveis de ambiente</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Renomeie o arquivo <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">.env.example</code> para{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">.env.local</code> e preencha com suas credenciais do Supabase:
                </p>
                <pre className="bg-muted rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed border border-border">
                  <span className="text-muted-foreground"># Renomeie .env.example → .env.local{"\n"}</span>
                  <span className="text-muted-foreground"># e preencha os valores abaixo:{"\n\n"}</span>
                  <span className="text-primary">NEXT_PUBLIC_SUPABASE_URL</span>
                  {"="}
                  <span className="text-amber-500">https://&lt;seu-projeto&gt;.supabase.co{"\n"}</span>
                  <span className="text-primary">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</span>
                  {"="}
                  <span className="text-amber-500">eyJ...{"\n"}</span>
                </pre>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                3
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1">Inicie o servidor de desenvolvimento</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Execute o comando abaixo e acesse{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">http://localhost:3000</code>:
                </p>
                <pre className="bg-muted rounded-xl p-4 text-xs font-mono overflow-x-auto border border-border">
                  npm run dev
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
        Boilerplate Next.js + Supabase
      </footer>
    </main>
  );
}
