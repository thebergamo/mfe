import hero from '../assets/hero.png'

export function Hero() {
  return (
    <div className="p-2 bg-brandViolet-100">
      <section className="container grid items-center justify-center gap-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:pt-16 lg:pb-24">
        <div className="w-full justify-center flex">
          <img src={hero} width={250} alt="Hero image" />
        </div>
        <div className="mx-auto flex flex-col items-center gap-4 lg:w-[52rem] text-center">
          <h1 className="text-3xl font-bold leading-[1.1] tracking-tighter sm:text-5xl md:text-6xl">
            What's going on here?
          </h1>
          <p className="max-w-[42rem] leading-normal text-slate-700 sm:text-xl sm:leading-8">
            I'm building a web app with Next.js 13 and open sourcing everything.
            Follow along as we figure this out together.
          </p>
        </div>
        <div className="flex gap-4"></div>
      </section>
    </div>
  )
}
