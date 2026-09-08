<template>
  <section class="welcome-shell min-h-screen px-4 py-10 sm:px-6 lg:px-8">
    <div class="container mx-auto">
      <div class="welcome-hero-grid">
        <div
          class="welcome-card rounded-[2rem] p-6 sm:p-8 lg:p-10 bg-dominant-alt"
        >
          <div
            class="mb-6 inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-accent"
          >
            Easy to explore product
          </div>

          <h1
            class="max-w-2xl text-4xl font-black tracking-tight text-[color:var(--text)] sm:text-5xl lg:text-6xl"
          >
            Discover a calmer, sharper way to shop.
          </h1>

          <p
            class="mt-5 max-w-xl text-lg leading-8 text-[color:var(--text-muted)] bg-secondary"
          >
            A warm, modern storefront built around clarity, comfort, and
            confidence. This welcome section follows a simple 60/30/10 balance
            so the message feels focused and effortless.
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <button class="bg-accent">Start shopping</button>
            <button class="btn-secondary">Explore collection</button>
          </div>

          <!-- <div class="mt-10 grid gap-4 sm:grid-cols-3">
            <div class="rounded-2xl bg-white/70 p-4 shadow-sm">
              <p class="text-2xl font-bold text-[color:var(--text)]">60%</p>
              <p class="mt-1 text-sm text-[color:var(--text-muted)]">
                Story & value
              </p>
            </div>
            <div class="rounded-2xl bg-white/70 p-4 shadow-sm">
              <p class="text-2xl font-bold text-[color:var(--text)]">30%</p>
              <p class="mt-1 text-sm text-[color:var(--text-muted)]">
                Product focus
              </p>
            </div>
            <div class="rounded-2xl bg-white/70 p-4 shadow-sm">
              <p class="text-2xl font-bold text-[color:var(--text)]">10%</p>
              <p class="mt-1 text-sm text-[color:var(--text-muted)]">Action</p>
            </div>
          </div> -->
        </div>

        <div class="welcome-card rounded-[2rem] p-6 sm:p-8">
          <div class="flex h-full flex-col justify-between">
            <div>
              <p
                class="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--text-muted)]"
              >
                Featured look
              </p>
              <h2 class="mt-3 text-2xl font-bold text-[color:var(--text)]">
                Curated for modern living
              </h2>
            </div>

            <div class="welcome-image-slot mt-6 rounded-[1.5rem]">
              <img
                src="https://res.cloudinary.com/dp8iza2d9/image/upload/v1785306607/intro-1_wiodtv.png"
                alt=""
              />
            </div>

            <p class="mt-5 text-sm leading-7 text-[color:var(--text-muted)]">
              The picture area is intentionally left empty so you can drop in a
              hero image later.
            </p>
          </div>
        </div>

        <!-- <div class="welcome-card rounded-[2rem] p-6 sm:p-8 lg:p-6">
          <div class="flex h-full flex-col justify-between gap-6">
            <div>
              <p
                class="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--text-muted)]"
              >
                Quick note
              </p>
              <p class="mt-3 text-base leading-7 text-[color:var(--text)]">
                Keep the experience warm, balanced, and easy to scan.
              </p>
            </div>

            <div
              class="rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm text-[color:var(--text-muted)]"
            >
              Use this space for a promo, badge, or a short CTA.
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </section>
</template>
