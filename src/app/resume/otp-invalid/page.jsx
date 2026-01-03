export default function OtpInvalidPage() {
  return (
    <main className="min-h-[100dvh] bg-[#07070b] px-4 py-14">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-white shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-2xl text-red-300">
          !
        </div>

        <h1 className="mt-4 text-2xl font-semibold">OTP not correct</h1>
        <p className="mt-2 text-sm text-white/70">
          Please go back and enter the correct OTP. If OTP expired, request a
          new one.
        </p>

        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black"
        >
          Go Back
        </a>
      </div>
    </main>
  );
}
