export const site = {
  origin: "https://neokuchnie.pl",
  title: "Neo Kuchnie | Kuchnie i Meble na Wymiar Warszawa",
  description:
    "Neo Kuchnie - producent kuchni na wymiar w Warszawie. Unikalny design, przystępne ceny, 2 lata gwarancji. Zadzwoń: 662 755 566",
  keywords: "kuchnie na wymiar, meble kuchenne Warszawa, kuchnie premium, kuchnie na zamówienie",
  ogImage:
    "https://cdn21.lpmtr.net/lpfile/4/e/1/4e14ec0b7cdb65255afa60aaafad9baf/-/resize/1500/f.jpg?60013990",
  pages: [
    { slug: "", file: "index", url: "/", heading: "Kuchnie i meble na wymiar" },
    { slug: "about", file: "about", url: "/about", heading: "Dlaczego my" },
    { slug: "oferta", file: "oferta", url: "/oferta", heading: "Oferta" },
    { slug: "faq", file: "faq", url: "/faq", heading: "FAQ" },
    { slug: "kontakty", file: "kontakty", url: "/kontakty", heading: "Kontakt" }
  ]
} as const;

export type OriginalPageKey = (typeof site.pages)[number]["file"];
