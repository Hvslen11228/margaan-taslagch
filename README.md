# Маргаан таслагч

Билльярд, покер, муушиг, 13 покерийн маргааныг олон улсын дүрмээр шийдэх статик вэб.

## Vercel дээр байршуулах

```bash
cd margaan-taslagch
npx vercel --prod --name margaan-taslagch
```

Анх удаа асуухад: scope → `hvslencoder's projects`, project name → `margaan-taslagch`, бусдыг Enter.

## Analytics идэвхжүүлэх

1. Vercel → margaan-taslagch → **Analytics** → Enable (Web Analytics)
2. **Speed Insights** → Enable
3. Google Analytics 4: analytics.google.com дээр property үүсгээд `G-XXXXXXXXXX` ID-г `index.html` доторх `window.GA_ID=""` хэсэгт бичээд дахин deploy хийнэ.

Хянагддаг үйл явдлууд: `search` (хайлт), `game_filter` (тоглоом сонголт), `ad_click` (зар дарах).

## Зар засах

`index.html` доторх `const ADS=[...]` жагсаалт. `type`: `banner` (дээд), `board` (баруун самбар), `inline` (6 карт тутамд).

## Домэйн

Өөр домэйн ашиглавал `index.html` (canonical, og:url), `robots.txt`, `sitemap.xml` дахь `margaan-taslagch.vercel.app`-г солино.
