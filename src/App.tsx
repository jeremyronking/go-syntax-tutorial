function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <span className="text-[var(--color-gopher-cyan)]">Go</span>Tour
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Interactive Go Tutorial
        </p>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Learn Go by{" "}
          <span className="text-[var(--color-gopher-cyan)]">running</span> it
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Hello GoTour — project scaffold is working!
        </p>
        <div className="inline-block rounded-lg bg-[var(--color-gopher-cyan)]/10 border border-[var(--color-gopher-cyan)]/30 px-6 py-3 font-mono text-[var(--color-gopher-cyan)]">
          fmt.Println("GoTour is running")
        </div>
      </main>
    </div>
  );
}

export default App;