// The phone frame the whole experience lives in. Floats on desktop; fills on mobile.
export default function AppShell({ children }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#ededeb] sm:p-6">
      <div className="relative h-[100dvh] w-full overflow-hidden bg-paper sm:h-[880px] sm:max-h-[92vh] sm:w-[420px] sm:rounded-[2.4rem] sm:border sm:border-line-subtle sm:shadow-shell">
        <div className="device relative z-10">{children}</div>
      </div>
    </div>
  )
}
