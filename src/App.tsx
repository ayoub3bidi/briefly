function App() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold tracking-wide text-indigo-700">
          BRIEFLY <span className="text-slate-400">/ PROJECT INTAKE</span>
        </p>
        <h1 className="mt-10 text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl">
          A clear project starts with the right questions.
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          A short, guided brief to help turn your idea into a plan.
        </p>
        <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-5 text-sm text-slate-500">
          <span>English · Français · العربية</span>
          <span className="font-medium text-indigo-700">About 10 minutes</span>
        </div>
      </section>
    </main>
  )
}

export default App
