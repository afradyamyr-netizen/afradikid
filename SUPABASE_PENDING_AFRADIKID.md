# کارهای معوقِ Supabase — پروژه «فرزند من» (afradikid)

> **این فایل برای هر دستیار بعدی است.** در تاریخ **۲۰۲۶-۰۹-۱۳** مشخص شد که
> کلید Management سوپابیسِ پروژهٔ «فرزند من» (کلید Management قدیمی) **منقضی/بی‌اعتبار** است و
> کلید جدیدی هم که در اختیار بود (کلید Management فعلی) فقط به پروژهٔ **زینالیکید**
> دسترسی دارد و برای `doikoqzarsuprcwkghsq` پاسخ `403` می‌دهد.
> در نتیجه **تغییرهای سمت Supabase فرزند من اعمال نشد** و در این فایل ثبت شد تا با اولین
> کلید معتبر، دقیقاً و بدون حدس انجام شوند.
کلید معتبر، دقیقاً و بدون حدس انجام شوند.

## فهرستِ وضعیت (آخرین به‌روزرسانی: ۲۰۲۶-۰۹-۱۷)

| # | مورد | وضعیت | پیش‌نیاز |
|---|---|---|---|
| ۱ | جدول `phone_tracking_codes` (یک کد پیگیری برای هر شماره) | ❌ **معوق** — اولویت بالا | کلید Management یا دسترسی SQL |
| ۲ | انتشارِ دوباره‌ی همه‌ی Edge Functionها (نسخه‌ی زنده نامعلوم است) | ❌ **معوق** | کلید Management |
| ۳ | بررسی/تکمیلِ Secrets توابع لبه (مانند کلیدهای Mistral) | ⬜ بررسی‌نشده | کلید Management یا داشبورد |
| ۴ | مقایسه‌ی شِما با زینالیکید (باید هیچ تفاوتی نماند) | ⬜ وابسته به گام ۱ | — |
| ۵ | آزمونِ واقعیِ «یک کد برای هر شماره» | ⬜ وابسته به گام ۱ | — |

> **همه‌ی مواردِ بالا با اجرایِ «دستورِ اجرایِ کامل» در پایینِ همین صفحه انجام می‌شوند.**
> مواردِ سمتِ کد (محافظتِ صفحات، منوی والد، سیاستِ هوش مصنوعی، noindexِ مدیریت)
> روی سایت زنده‌اند و به سوپابیس ربطی ندارند — نیازی به کار ندارند.

> **یادداشتِ ۲۰۲۶-۰۹-۱۷:** کلید Management با مقدار کلید Management فعلی **دوباره آزمایش شد**؛
> روی زینالیکید کامل کار می‌کند (حتی اجرای مستقیمِ SQL)، اما برای پروژهٔ فرزند من
> همچنان **۴۰۳** می‌دهد. آیتم ۱ روی زینالیکید در همان روز **بررسی و تأیید کامل** شد و
> نتیجهٔ دقیقش به‌عنوان «مرجعِ طلایی» در بخش‌های «چ» و «ح» همین فایل ثبت شده است —
> یعنی دستیارِ بعدی لازم نیست از صفر کشف کند؛ فقط اجرا و مقایسه کند.

---

## 🚀 دستورِ اجرایِ کامل با کلیدِ جدید (نقطه‌ی شروعِ دستیارِ بعدی)

> **اگر کلیدِ معتبرِ Managementِ پروژه‌ی «فرزند من» را در اختیار داری، از همین‌جا شروع کن
> و تا انتها برو.** نیازی نیست مالک چیزی را توضیح بدهد؛ همه‌ی دستورها، خروجی‌هایِ مورد
> انتظار و معیارهایِ پایان در همین فایل هست.

### گام ۰ — آماده‌سازی

```bash
export SUPABASE_ACCESS_TOKEN="<PAT_معتبر_مخصوص_فرزند_من>"
REF=doikoqzarsuprcwkghsq
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
```

**الف) کلید را بیازما (حتماً باید ۲۰۰ بدهد):**

```bash
curl -s -o /dev/null -w "%{http_code}\n" -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
     -H "User-Agent: $UA" "https://api.supabase.com/v1/projects/$REF"
```

اگر `۴۰۱` یا `۴۰۳` داد، **همین‌جا متوقف شو** و کلیدِ جدید بگیر؛ هیچ‌کدام از گام‌هایِ بعد
بدونِ دسترسی اجرا نمی‌شود (تجربه: کلیدهایِ معرفی‌شده در فایل‌هایِ هندآف قبلی یکی `۴۰۱`
و دیگری برایِ این پروژه `۴۰۳` می‌داد).

**ب) پشتیبان بگیر (اجباری):**

```bash
SR="<SERVICE_ROLE_فرزند_من>"     # از داشبورد → Project Settings → API
curl -s -H "apikey: $SR" -H "Authorization: Bearer $SR" \
  "https://$REF.supabase.co/rest/v1/submissions?select=*" \
  -o /home/user/backups/fm-submissions-$(date +%Y%m%d-%H%M%S).json
curl -s -H "apikey: $SR" -H "Authorization: Bearer $SR" \
  "https://$REF.supabase.co/rest/v1/settings?select=*" \
  -o /home/user/backups/fm-settings-$(date +%Y%m%d-%H%M%S).json
```

> وضعیتِ اندازه‌گیری‌شده در ۲۰۲۶-۰۹-۱۷ برای مقایسه: تعداد فرم‌ها **۷**، `entryMode = user`،
> جدول `phone_tracking_codes` **وجود ندارد** (`PGRST205`).

### گام ۱ — ساختِ جدولِ «یک کد پیگیری برای هر شماره»

فایلِ مهاجرت در ریپو هست و کاملاً ایمن و تکرارپذیر است:

```bash
cd /home/user/projects/afradikid
npx --yes supabase db push --project-ref $REF
# یا فقط همین یک فایل:
npx --yes supabase db execute --project-ref $REF \
  --file supabase/migrations/20260912130000_one_tracking_code_per_phone.sql
```

متنِ کاملِ SQL و بررسی‌هایِ پیش/پس از اجرا: **بخش ۱** همین فایل (همه‌چیز آن‌جا مو‌به‌مو هست).

**معیارِ پایانِ گام ۱:** جدول وجود داشته باشد، دو قیدِ `PRIMARY KEY (full_phone)` و
`UNIQUE (tracking_code)` برقرار باشند، ایندکسِ قدیمی حذف شده باشد و تعدادِ فرم‌ها
تغییر نکرده باشد.

### گام ۲ — انتشارِ دوباره‌ی Edge Functionها

چون بدون دسترسی نمی‌شد فهمید کدام نسخه روی فرزند من منتشر است، **همه‌ی توابعِ اصلی را
یک‌بار منتشر کن** تا نسخه‌ی زنده با کدِ ریپو یکی شود:

```bash
cd /home/user/projects/afradikid
for fn in create-submission user-portal checkout-session track-submission \
          update-submission-public public-settings public-questions \
          admin-api admin-session admin-credentials log-error admin-error-logs \
          sitemap content-api; do
  npx --yes supabase functions deploy "$fn" --project-ref "$REF" || echo "رد شد: $fn"
done
```

> اگر تابعی وجود نداشت، CLI خطا می‌دهد؛ آن را رد کن و ادامه بده (فهرستِ دقیق را با
> `npx supabase functions list --project-ref $REF` ببین و با همان پیش برو).

**معیارِ پایانِ گام ۲:** خروجیِ CLI برایِ هر تابعِ موجود «Deployed» را نشان دهد.

### گام ۳ — بررسیِ Secrets توابع لبه

در داشبورد: Project Settings → Edge Functions → Secrets. بررسی کن این‌ها ست باشند
(در زینالیکید ست‌اند): `MISTRAL_PUBLIC_API_KEY`، `MISTRAL_ADMIN_API_KEY` و هر کلیدِ
دیگری که توابعِ ریپو می‌خوانند. چیزی را حذف یا تغییر نده؛ فقط مواردِ نبوده را اضافه کن.

### گام ۴ — مقایسه‌ی نهاییِ شِما با زینالیکید

```bash
# فهرست جدول‌های هر دو پروژه را بگیر و مقایسه کن؛ باید هیچ تفاوتی نماند
npx --yes supabase db execute --project-ref $REF \
  --command "select table_name from information_schema.tables where table_schema='public' order by 1;"
```

**معیارِ پایانِ گام ۴:** فهرستِ جدول‌ها با زینالیکید یکی باشد (تا ۲۰۲۶-۰۹-۱۷ تنها تفاوت
همین `phone_tracking_codes` بود که در گام ۱ ساخته می‌شود).

### گام ۵ — آزمونِ واقعیِ «یک کد برای هر شماره»

دستورِ کامل با خروجیِ نمونه در **بخش ۱-ح** هست. خلاصه: سه فرم با سه قالبِ متفاوتِ یک
شماره‌ی آزمایشی بفرست؛ هر سه باید **یک کدِ یکسان** بگیرند و هیچ نشستی ساخته نشود.
سپس ردیف‌های آزمایشی را پاک کن.

### گام ۶ — گزارش

- گزارشِ کوتاهِ فارسی بنویس (چه شد، خروجیِ هر گام، عددها).
- وضعیتِ آیتم‌هایِ این فایل را از «معوق» به «انجام‌شده (تاریخ — توسط چه کسی)» تغییر بده.
- این فایل را کامیت و پوش کن.

### چیزهایی که نیازی به کار ندارند (قبلاً انجام شده)

- محافظت از صفحاتِ مجوزها و تجربه والدین، بازگرداندنِ گزینه‌ی «ورود والد/پنل والد»
  به منو، سیاستِ ماشین‌خوانِ هوش مصنوعی، و هدرهایِ `noindex` برای بخش مدیریت —
  **همگی روی سایت زنده‌اند** و فقط به کد مربوط بودند، نه به سوپابیس.
- ثبت در گوگل/بینگ/IndexNow فقط برای زینالیکید انجام شده (طبقِ درخواست مالک).
  اگر روزی برای فرزند من هم بخواهی: همان روندِ زینالیکید است (فایلِ وریفای، ثبتِ
  نقشه‌ی سایت در Search Console، تأیید در Bing Webmaster، ارسال به IndexNow با کلیدِ
  مخصوصِ فرزند من).

---

## ۰) قانون طلایی (قبل از هر اقدامی بخوان)

1. **هیچ محتوا، تصویر، بلاگ، دوره، فرم یا داده‌ای که مالک آپلود یا اضافه کرده حذف یا تغییر نده.**
   «هیچ چیز از فرزند من کم یا عوض نشود» یک قانون ثابت است.
2. همهٔ migrationهای این فایل **idempotent** هستند (`if not exists`، `on conflict do nothing`)
   و اجرای دوباره‌شان خطری ندارد — اما **هیچ `drop table` / `delete` ای اجرا نکن.**
3. قبل از اعمال هر تغییر، از جدول‌های `submissions` و `settings` یک خروجی پشتیبان بگیر.
4. دو پروژه مستقل‌اند: هیچ داده، توکن، دامنه یا CORS ای بین زینالیکید و فرزند من جابه‌جا نشود.
5. بعد از اعمال، **گزارش کوتاه فارسی** بنویس و این فایل را به‌روزرسانی کن
   (وضعیت هر آیتم را از «معوق» به «انجام‌شده» تغییر بده + تاریخ و شناسهٔ انتشار).

### متغیرهای مورد نیاز

```bash
export SUPABASE_ACCESS_TOKEN="<PAT_معتبر_فرزند_من>"      # از Supabase → Account → Access Tokens
REF=doikoqzarsuprcwkghsq                                  # project-ref فرزند من
```

### بررسی سلامت کلید (قبل از شروع)

```bash
curl -s -o /dev/null -w "%{http_code}\n" -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  "https://api.supabase.com/v1/projects/$REF"      # انتظار: 200 (در غیر این صورت کلید را عوض کن)
```

---

## ۱) آیتم معوق شمارهٔ ۱ — جدول `phone_tracking_codes` وجود ندارد 🔶 اولویت بالا

**شناسهٔ migration:** `supabase/migrations/20260912130000_one_tracking_code_per_phone.sql`
**وضعیت:** ❌ **در دیتابیس فرزند من اعمال نشده است.**
**کشف‌شده در:** ۲۰۲۶-۰۹-۱۳ · **آخرین بازبینی:** ۲۰۲۶-۰۹-۱۷ (با کلیدِ جدید هم همچنان بی‌دسترسی)

| پروژه | وضعیتِ جدول | توضیح |
|---|---|---|
| 🟢 زینالیکید (`kkdrvexwzuuumjezipnd`) | ✅ **اعمال‌شده** (۲۰۲۶-۰۹-۱۲) | مرجعِ طلایی برای مقایسه؛ خروجیِ دقیق در پایین آمده |
| 🔵 فرزند من (`doikoqzarsuprcwkghsq`) | ❌ **موجود نیست** | با کلید سرویس: `PGRST205` (یعنی واقعاً نیست، نه خطای دسترسی) |

> **این تنها تفاوتِ باقیماندهٔ دو دیتابیس است.** در بررسیِ ۲۰۲۶-۰۹-۱۳، بقیهٔ جدول‌های
> دو پروژه یکی بود و فقط همین جدول کم بود. بعد از انجامِ این آیتم، دوباره مقایسه کن.

---

### الف) آخرین وضعیتِ دسترسی (اندازه‌گیری‌شده در ۲۰۲۶-۰۹-۱۷)

| آزمون | نتیجه |
|---|---|
| `GET /v1/projects/doikoqzarsuprcwkghsq` با کلید کلید Management فعلی | **HTTP ۴۰۳** — «account does not have the necessary privileges» |
| `GET /v1/projects/…/api-keys?reveal=true` | **HTTP ۴۰۳** |
| خواندنِ جدول با SERVICE_ROLE از طریق PostgREST | **`PGRST205`** — «Could not find the table … in the schema cache» |
| همان کلید روی زینالیکید | ✅ کار می‌کند |

> **یادداشتِ تکمیلی (۲۰۲۶-۰۹-۱۷، بررسیِ دوباره):** کلیدهایِ Managementِ سوپابیس که در
> فایلِ هندآفِ جدیدتر (`HANDOFF_MASTER_FINAL-فرزندمن-زینالیکید-2.md`) آمده‌اند —
> یعنی کلیدِ معرفی‌شده برای زینالیکید و کلیدِ معرفی‌شده برای فرزند من — هر دو هنگامِ اجرا
> **`401 Unauthorized`** می‌دهند (حتی برایِ ساده‌ترین درخواست: فهرستِ پروژه‌ها).
> یعنی این دو کلید در حال حاضر معتبر نیستند و با آن‌ها هم نمی‌توان آیتم ۱ را اجرا کرد.
> تنها کلیدی که برایِ مدیریتِ سوپابیس کار می‌کند، همان کلید Management فعلی است که
> **فقط** به زینالیکید دسترسی دارد و برای فرزند من `403` می‌دهد.
> بنابراین برای انجامِ این آیتم باید کلیدِ معتبرِ **مخصوصِ پروژهٔ فرزند من** از
> مسیرِ Supabase → Account → Access Tokens ساخته شود.

**تفسیرِ `PGRST205`:** چون با همین کلید، جدولِ `settings` روی فرزند من درست خوانده می‌شود،
این خطا یعنی **جدول واقعاً وجود ندارد** — نه اینکه کلید خراب باشد. پس نبودِ جدول قطعی است.

> **تصحیحِ یک یادداشتِ قدیمیِ این فایل:** قبلاً نوشته شده بود اندپوینت
> `POST /v1/projects/<ref>/database/query` با این کلیدها «۴۰۱» می‌دهد. در ۲۰۲۶-۰۹-۱۷
> روی زینالیکید با همین کلید **با موفقیت اجرا شد** (پاسخ: PostgreSQL ۱۷٫۶).
> بنابراین «مسیر ۱» پایین، سریع‌ترین راهِ اجراست — فقط هدرِ `User-Agent` مرورگرگونه
> بگذار تا Cloudflare با خطای ۱۰۱۰ بلاک نکند.

---

### ب) چرا لازم است (شواهد واقعی، نه تئوری)

قولِ سیستم این است: **هر شمارهٔ تماس فقط و فقط یک کد پیگیری داشته باشد، برای همیشه.**
بدون این جدول، آن قول فقط به‌صورت نرم‌افزاری و با حدس اجرا می‌شود (تابع
`_shared/trackingCode.ts` یک مسیرِ سازگار دارد که از روی سوابق، کد را پیدا/تولید می‌کند).

**شاهدِ واقعی از زینالیکید (۲۰۲۶-۰۹-۱۷):** در سوابقِ قدیمی، شمارهٔ `+989198305774`
**دو کدِ متفاوت** داشت: `ZK13171` (۱۴۰۵/۰۵/۲۰) و `ZK-50ny4em` (۱۴۰۵/۰۶/۰۹).
یعنی «چند کد برای یک شماره» یک احتمالِ تئوریک نیست — **اتفاق افتاده است.**
جدولِ نگاشت این را با دو قیدِ دیتابیسی غیرممکن می‌کند:
`PRIMARY KEY (full_phone)` و `UNIQUE (tracking_code)`.

سه دلیلِ دیگر:

1. **مسیرِ سازگار محدود است.** فقط حداکثر ۵۰۰۰ + ۳۰۰۰ ردیف را بررسی می‌کند؛
   با زیاد شدنِ فرم‌ها، احتمالِ برخوردِ کدها بالا می‌رود.
2. **ایندکسِ قدیمی و ناسازگار هنوز سر جایش است.** این migration ایندکس
   `submissions_tracking_code_unique_idx` را **حذف** می‌کند (یکتاییِ سراسریِ کد که با
   سیاست «یک کد برای هر شماره» ناسازگار است و باعث خطای `23505` و پیام
   «ساخت کد پیگیری انجام نشد» می‌شد — و در آن حالت **هیچ ردیفی در پنل ثبت نمی‌شد**).
   تا وقتی این migration اعمال نشود، آن ایندکس روی فرزند من فعال است.
3. **انحرافِ دو پروژه.** کدِ دو ریپو یکسان است، پس دیتابیس هم باید یکسان باشد.

**وابستگی‌های کدی:** `supabase/functions/_shared/trackingCode.ts`،
`supabase/functions/create-submission/index.ts`، `supabase/functions/user-portal/index.ts`.

---

### پ) دستورِ دقیقِ اعمال — سه مسیر (هر کدام در دسترس بود، همان را برو)

**مسیر ۱ — Management API (آزموده‌شده روی زینالیکید؛ بدون نیاز به نصب):**

```bash
PAT="<PAT_معتبر_فرزند_من>"
REF=doikoqzarsuprcwkghsq
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

# سلامتِ کلید
curl -s -H "Authorization: Bearer $PAT" -H "User-Agent: $UA" \
  "https://api.supabase.com/v1/projects/$REF" | head -c 200        # انتظار: ۲۰۰ با مشخصات پروژه

# اجرایِ کلِ فایل (اسکریپتِ آمادهٔ پایین در بخش «ت» همین کار را می‌کند)
curl -s -X POST "https://api.supabase.com/v1/projects/$REF/database/query" \
  -H "Authorization: Bearer $PAT" -H "User-Agent: $UA" -H "Content-Type: application/json" \
  --data-binary @/tmp/mig.json
```

> `/tmp/mig.json` باید به‌شکل `{"query": "...متنِ کاملِ SQL..."}` باشد.
> بهترین کار: از اسکریپتِ کوچکِ بخش «ت» استفاده کن که فایلِ SQL را دستور‌به‌دستور می‌فرستد.

**مسیر ۲ — Supabase CLI (اگر نصب است):**

```bash
cd /home/user/projects/afradikid
export SUPABASE_ACCESS_TOKEN="<PAT_معتبر_فرزند_من>"
npx --yes supabase link --project-ref doikoqzarsuprcwkghsq
npx --yes supabase db push --project-ref doikoqzarsuprcwkghsq
# یا فقط همین یک فایل:
npx --yes supabase db execute --project-ref doikoqzarsuprcwkghsq \
  --file supabase/migrations/20260912130000_one_tracking_code_per_phone.sql
```

**مسیر ۳ — SQL Editorِ داشبورد (ساده‌ترین، اگر دسترسیِ وب داری):**
Supabase Dashboard → پروژهٔ فرزند من → **SQL Editor** → متنِ کاملِ بخش «ت» را Paste و Run کن.

> فایل کاملاً **idempotent** است (`create table if not exists`، `drop index if exists`،
> `on conflict do nothing`)؛ اجرای دوباره‌اش خطری ندارد. ولی **هیچ `drop table` یا
> `delete` ای اجرا نکن.**

---

### ت) اسکریپتِ آمادهٔ اجرا (همانی که روی زینالیکید با موفقیت اجرا شد)

مسیرِ فرضی: `/home/user/projects/.secrets/dbquery.py` — یا دوباره بساز؛ منطقش ساده است:
کلید را از فایل/متغیر می‌خواند، فایلِ SQL را به دستورها تقسیم می‌کند (`;` در سطحِ بالا،
با حفظ رشته‌های `'...'` و حذف توضیحاتِ `--`) و هر دستور را جداگانه با
`POST /v1/projects/<ref>/database/query` می‌فرستد و نتیجه را چاپ می‌کند.
**تقسیم به دستورهای جدا مهم است** چون در صورت خطا، دقیقاً می‌فهمی کدام دستور مشکل داشت.

خروجیِ موفق برای هر دستورِ DDL یک آرایهٔ خالی `[]` است.

---

### ث) متنِ کاملِ SQL (عیناً همان فایلِ مهاجرتِ ریپو)

```sql
-- ── ۱) جدول نگاشت با دو قیدِ یکتایی ──
create table if not exists public.phone_tracking_codes (
  full_phone     text primary key,
  tracking_code  text not null,
  created_at     timestamptz not null default now(),
  constraint phone_tracking_codes_code_unique unique (tracking_code)
);

comment on table public.phone_tracking_codes is
  'نگاشت رسمی شمارهٔ تماس به کد پیگیری؛ یک کد برای هر شماره برای همیشه';

-- فقط Edge Functionها با service_role حق دسترسی دارند
alter table public.phone_tracking_codes enable row level security;
revoke all on table public.phone_tracking_codes from public;
revoke all on table public.phone_tracking_codes from anon;
revoke all on table public.phone_tracking_codes from authenticated;
grant select, insert, update, delete on table public.phone_tracking_codes to service_role;

-- ── ۲) جایگزینی ایندکسِ ناسازگار ──
drop index if exists public.submissions_tracking_code_unique_idx;

create index if not exists submissions_tracking_code_lookup_idx
  on public.submissions ((payload ->> 'trackingCode'));

-- ── ۳) بک‌فیل: کد رسمیِ هر شماره از قدیمی‌ترین سابقه (ردیف‌های حذف‌نرم هم حساب می‌شوند) ──
with candidates as (
  select
    s.full_phone,
    coalesce(nullif(s.payload ->> 'code', ''), nullif(s.payload ->> 'trackingCode', '')) as code,
    row_number() over (partition by s.full_phone order by s.created_at asc, s.id asc) as rn
  from public.submissions s
  where s.full_phone is not null
    and s.full_phone <> ''
    and coalesce(nullif(s.payload ->> 'code', ''), nullif(s.payload ->> 'trackingCode', '')) is not null
),
first_code as (
  select full_phone, code from candidates where rn = 1
),
deduped as (
  select full_phone, code,
         row_number() over (partition by code order by full_phone) as code_rn
  from first_code
)
insert into public.phone_tracking_codes (full_phone, tracking_code)
select full_phone, code
from deduped
where code_rn = 1
on conflict (full_phone) do nothing;

-- ── ۴) پر کردنِ کدِ خالیِ ردیف‌های قدیمی (ردیف‌های نوع user دست‌نخورده می‌مانند) ──
update public.submissions s
set payload = jsonb_set(s.payload, '{trackingCode}', to_jsonb(m.tracking_code)),
    updated_at = now()
from public.phone_tracking_codes m
where m.full_phone = s.full_phone
  and coalesce(nullif(s.payload ->> 'trackingCode', ''), '') = ''
  and s.payload ->> 'type' is distinct from 'user';
```

---

### ج) بررسیِ پیش از اجرا (فقط خواندن) + خروجیِ مورد انتظار

```sql
select to_regclass('public.phone_tracking_codes') is not null as table_exists;
-- انتظارِ «قبل از اصلاح»: false

select indexname from pg_indexes
 where schemaname='public' and tablename='submissions' and indexname like '%tracking%';
-- انتظارِ «قبل از اصلاح»: submissions_tracking_code_unique_idx  (ایندکسِ قدیمی هنوز هست)

select count(*) as submissions_count from public.submissions;
-- فقط برای اطلاع؛ عدد را یادداشت کن تا بعد از اجرا تغییر نکرده باشد
```

**پشتیبان (اجباری):** قبل از اجرا یک خروجی از `submissions` و `settings` بگیر:

```bash
curl -s -H "apikey: $SERVICE_ROLE" -H "Authorization: Bearer $SERVICE_ROLE" \
  "https://doikoqzarsuprcwkghsq.supabase.co/rest/v1/submissions?select=*" \
  -o /home/user/backups/fm-submissions-$(date +%Y%m%d-%H%M%S).json
```

---

### چ) بررسیِ پس از اجرا + خروجیِ مورد انتظار (مرجع: زینالیکید)

```sql
select to_regclass('public.phone_tracking_codes') is not null as table_exists;   -- باید true

select conname, pg_get_constraintdef(oid) as def
  from pg_constraint where conrelid='public.phone_tracking_codes'::regclass;
-- انتظار دقیقاً دو قید:
--   phone_tracking_codes_pkey        → PRIMARY KEY (full_phone)
--   phone_tracking_codes_code_unique → UNIQUE (tracking_code)

select relrowsecurity from pg_class where oid='public.phone_tracking_codes'::regclass;  -- true

select grantee, string_agg(privilege_type, ', ' order by privilege_type)
  from information_schema.role_table_grants
 where table_schema='public' and table_name='phone_tracking_codes' group by grantee;
-- باید service_role دست‌کم SELECT, INSERT, UPDATE, DELETE داشته باشد

select indexname from pg_indexes
 where schemaname='public' and tablename='submissions' and indexname like '%tracking%';
-- انتظار: فقط submissions_tracking_code_lookup_idx
--         (submissions_tracking_code_unique_idx باید حذف شده باشد)

select count(*) from public.phone_tracking_codes;                      -- تعداد شماره‌های دارای کد
select count(*) from (select tracking_code from public.phone_tracking_codes
                      group by tracking_code having count(*)>1) t;     -- باید ۰ باشد
select count(*) from public.submissions;                                -- باید با عددِ «پیش از اجرا» برابر باشد
```

---

### ح) آزمونِ سراسریِ واقعی (دقیقاً همان که روی زینالیکید اجرا شد و جواب داد)

سه فرم با **سه قالبِ متفاوتِ یک شمارهٔ آزمایشی** بفرست. انتظار: هر سه، **یک کدِ یکسان**
بگیرند و هیچ «نشست/توکن ورودی» برنگردانند (یعنی ورودِ خودکار اتفاق نیفتاده است).

```bash
REF=doikoqzarsuprcwkghsq
EP="https://$REF.supabase.co/functions/v1/create-submission"
ANON="<کلید anon فرزند من>"

for PHONE in "09199990011" "+989199990011" "989199990011"; do
  curl -s -X POST "$EP" \
    -H "apikey: $ANON" -H "Authorization: Bearer $ANON" -H "Content-Type: application/json" \
    -H "Origin: https://farzandman.vercel.app" \
    -d "{\"submission\":{\"type\":\"consultation\",\"fullPhone\":\"$PHONE\",
         \"pName\":\"تست خودکار\",\"childName\":\"کودک تست\",
         \"testMarker\":\"auto-check-2026-09-17\"}}"
  echo
done
```

**خروجیِ واقعیِ زینالیکید (مرجع):**

```
شمارهٔ ذخیره‌شده: +989199990011 | کد: ZK-9j2umfd | کلیدهای نشست: هیچ
شمارهٔ ذخیره‌شده: +989199990011 | کد: ZK-9j2umfd | کلیدهای نشست: هیچ
شمارهٔ ذخیره‌شده: +989199990011 | کد: ZK-9j2umfd | کلیدهای نشست: هیچ
```

سپس در دیتابیس تأیید کن و **ردیف‌های آزمونی را پاک کن** (فقط همان‌هایی که خودت ساختی):

```sql
select full_phone, payload->>'trackingCode' as کد, payload->>'type' as نوع
  from public.submissions where full_phone='+989199990011' order by id;
-- انتظار: سه ردیف، همه با یک کد

delete from public.submissions where full_phone='+989199990011'
  and payload->>'testMarker'='auto-check-2026-09-17';
delete from public.phone_tracking_codes where full_phone='+989199990011';
```

---

### خ) چک‌لیستِ پذیرش (همه باید تیک بخورند)

- [ ] `table_exists = true`
- [ ] دو قیدِ `PRIMARY KEY (full_phone)` و `UNIQUE (tracking_code)` برقرار
- [ ] RLS فعال + دسترسیِ کامل فقط برای `service_role`
- [ ] ایندکسِ قدیمی حذف شده و ایندکسِ جست‌وجو ساخته شده
- [ ] تعدادِ `submissions` تغییر نکرده (چیزی حذف/اضافه نشده)
- [ ] تعدادِ کدهای تکراری = ۰
- [ ] آزمونِ سه فرم با یک شماره → یک کدِ یکسان، بدون نشست
- [ ] ردیف‌های آزمونی پاک شده باشند
- [ ] این فایل به‌روزرسانی شده باشد (وضعیت بشود ✅ + تاریخ + نامِ اجراکننده)

### د) اگر چیزی خراب شد (بازگشت)

مهاجرت چیزی را حذف نمی‌کند (فقط یک ایندکسِ فرعی را عوض می‌کند و جدول می‌سازد)،
پس بازگشت فقط در صورت نیازِ مطلق:

```sql
-- فقط اگر واقعاً لازم شد (داده‌ای از بین نمی‌رود):
drop index if exists public.submissions_tracking_code_lookup_idx;
drop table if exists public.phone_tracking_codes;
```

و بازیابیِ داده از فایل پشتیبان در `/home/user/backups/`.

### ذ) یادداشتِ تجربی (از زینالیکید) — ردیف‌های حذف‌نرم را دست نزن

در زینالیکید بعد از اعمالِ مهاجرت دیده شد که یک شماره دو کد دارد. بررسی نشان داد
**هر سه ردیفِ آن شماره «حذف‌نرم» شده بودند** (خودِ مالک حذف کرده بود) و هیچ ردیفِ فعالی
با کدِ متفاوت وجود نداشت. یعنی **هیچ تغییرِ داده‌ای لازم نشد**: جدولِ نگاشت، یکتایی را
برای همهٔ ثبت‌های **آینده** تضمین می‌کند و ردیف‌های قدیمیِ حذف‌شده اثری ندارند.
اگر در فرزند من هم چنین موردی دیدی، اول وضعیتِ «فعال/حذف‌نرم» را ببین و
**بی‌دلیل داده‌ای را تغییر نده.**

---

## ۱/۵) آیتم معوق شمارهٔ ۲ — انتشار دوبارهٔ Edge Function «پرداخت» (کپچا حذف شد) 🔶

**وضعیت:** ❌ کد در ریپو به‌روز شده ولی روی سوپابیس منتشر نشده (کلید Management نداشتیم).
**تاریخ:** ۲۰۲۶-۰۹-۱۷ (هم‌زمان با حذف حالت «پیگیری دوره»)

در تغییرات این commit، بررسی امنیتی (کپچا) از صفحهٔ پرداخت حذف شد — هم در کلاینت و هم در
Edge Function `checkout-session`. نسخهٔ **منتشرشده** روی پروژهٔ فرزند من هنوز قدیمی است.

**آیا همین الان مشکلی ایجاد می‌کند؟** خیر. تابع فقط وقتی کپچا می‌خواست که
`settings.entryMode !== 'user'` باشد؛ مقدار فعلیِ دیتابیس برابر `user` است
(بررسی‌شده در ۲۰۲۶-۰۹-۱۷)، پس رفتارِ زنده درست است. این فقط یک عقب‌ماندگیِ نسخه است.

**چه باید کرد (با اولین کلید معتبر):**

```bash
cd /home/user/projects/afradikid
export SUPABASE_ACCESS_TOKEN="<PAT_معتبر_فرزند_من>"
npx --yes supabase functions deploy checkout-session --project-ref doikoqzarsuprcwkghsq
```

**معیار پایان:** خروجیِ CLI «Deployed Functions …: checkout-session» را نشان دهد.

---

## ۲) مواردی که باید **بررسی** شوند (تأیید نشده — اولویت دوم)

این‌ها را نمی‌شد بدون PAT تأیید کرد. با اولین کلید معتبر چک کن:

- [ ] **وضعیت انتشارِ همهٔ Edge Functions فرزند من** در برابر زینالیکید
      (`supabase functions list --project-ref $REF`) — مخصوصاً
      `user-portal`، `create-submission`، `public-settings`، `track-submission`، `content-api`.
      کدِ هر دو ریپو یکی است، باید نسخهٔ منتشرشده هم یکی باشد.
- [ ] **Secrets توابع لبه** (مثل `MISTRAL_PUBLIC_API_KEY`، `MISTRAL_ADMIN_API_KEY`) روی فرزند من ست باشند.
- [ ] **یکسان بودن شِمای بقیهٔ جدول‌ها** با زینالیکید: در بررسیِ ۲۰۲۶-۰۹-۱۳،
      ۲۷ جدولِ فرزند من با ۲۸ جدولِ زینالیکید یکی بود و **تنها** همین `phone_tracking_codes` کم بود.
      بعد از اعمال آیتم ۱، دوباره مقایسه کن که تفاوتی نمانده باشد.
- [ ] **باکت‌های Storage** (بررسیِ ۲۰۲۶-۰۹-۱۳ سالم و یکسان بود):
      `images`(عمومی)، `media`(عمومی)، `files`، `voice-notes`، `tongue-photos`، `receipts`(خصوصی).

---

## ۳) پیشینه و مستندات مرتبط

- آخرین commit هر دو پروژه (۲۰۲۶-۰۹-۱۲):
  «یک کد پیگیری برای هر شماره + نرمال‌سازی چندکشوری شماره + حذف ورود خودکار»
  - زینالیکید: `321a82d` · فرزند من: `8865464`
- فایل migration در هر دو ریپو **کاملاً یکسان** است (`diff` خالی بود).
  پس نیازی به تغییر کد نیست؛ فقط دیتابیس عقب مانده است.
- دامنهٔ production: `https://farzandman.vercel.app`
  (پروژه در ورسل `prj_aupOntJRZSr5lhhSnLJPcE7zHdrY` و نامش `farzandman` است؛
  آلیاس قدیمی `afradikid.vercel.app` هم به همان دیپلوی اشاره می‌کند —
  **بعد از هر دیپلوی تازه، حتماً بررسی کن آلیاس `farzandman.vercel.app` به جدیدترین دیپلوی اشاره کند.**)

---

## ۴) الگوی ثبت آیتمِ معوقِ بعدی

هر بار که تغییری سمت Supabase زینالیکید انجام می‌دهی و روی فرزند من نمی‌توانی،
یک بلوک مثل زیر به این فایل اضافه کن و کامیت کن:

```markdown
## N) عنوان آیتم — وضعیت: ❌ معوق (تاریخ)
**شناسه/فایل:** ...
**چرا لازم است:** ...
**دستور دقیق اعمال:** ...
**بررسیِ پیش/پس از اجرا (فقط خواندن):** ...
**معیار پایان:** ...
```

و در پایان کار، وضعیت را به `✅ انجام‌شده (تاریخ — توسط چه کسی)` تغییر بده.
---

## ۵) مواردِ «سئو/ثبت» که برای فرزند من انجام نشد (بلاکلِه دسترسی)

> این بخش **جدای از آیتم‌های سوپابیس** است و با همان کلید حل نمی‌شود؛ برای انجامش
> باید دسترسیِ مربوطه را مالک فراهم کند. دستیار بعدی از همین‌جا شروع کند.

| # | مورد | چرا انجام نشد | برای انجام شدن چه لازم است |
|---|---|---|---|
| ۱ | ثبتِ نقشه‌ی سایت در **Google Search Console** | کلیدِ سرویس‌اکانتِ گوگل فقط به پروژه‌ی زینالیکید دسترسی دارد | مالک در Search Console، پروژه‌ی فرزند من را اضافه و کاربرِ سرویس را به‌عنوان مالک/کاربر دعوت کند؛ یا فایلِ وریفای را تحویل دهد |
| ۲ | بررسیِ وضعیتِ ایندکس در گوگل | همان بالا | همان بالا |
| ۳ | ارسال به **Bing Webmaster API** | کلیدِ Webmaster فقط برای زینالیکید است | کلیدِ Webmaster مخصوصِ فرزند من از پنلِ بینگ |
| ۴ | درخواستِ دستیِ ایندکس از گوگل | گوگل اجازه‌ی درخواستِ برنامه‌ای برای صفحات عادی نمی‌دهد (محدود به JobPosting/BroadcastEvent) | از رابطِ Search Console به‌صورت دستی «درخواست ایندکس» زده شود |

**آنچه برای فرزند من انجام شده (نیازی به کار ندارد):**
- ارسالِ همه‌ی نشانی‌ها به **IndexNow** (۴۸ نشانی، پذیرفته شد) — این همان چیزی است
  که بینگ و دیگر موتورهای همکار را باخبر می‌کند.
- نقشه‌ی سایتِ فرزند من پویا و در دسترس است و از طریق `robots.txt` معرفی شده،
  پس گوگل و بینگ آن را به‌صورت طبیعی می‌خوانند.
- لینک‌سازیِ داخلی (فوتر + مطالب مرتبطِ مقالات) و صفحه‌بندیِ فهرست آموزش‌ها.

**نکته:** محدودیتِ ارسال به وب‌مسترِ بینگ **۱۰۰ نشانی در روز و ۱٬۳۰۰ در ماه** است؛
برای پروژه‌ی زینالیکید همه‌ی ۶۲ نشانی با موفقیت ارسال شد.

---

## ۶) انتشارِ تابعِ «نقشه سایت» (sitemap) — نیازمند کلید (آخرین به‌روزرسانی: ۲۰۲۶-۰۹-۱۹)

تغییر در **کد** انجام شده و در مخزن ثبت است، اما **روی سرور منتشر نشده**، چون کلیدِ
مدیریتِ این پروژه در دسترس نبود.

| مورد | وضعیت |
|---|---|
| حذفِ `/track` از نقشه سایت (این صفحه حذف شده و ۴۰۴ می‌دهد) | ✅ کد اصلاح شد — ❌ منتشر نشد |

**برای انتشار، با اولین کلیدِ معتبر این دستور را اجرا کن:**

```bash
export SUPABASE_ACCESS_TOKEN="<کلید_معتبر_مخصوص_فرزند_من>"
cd /home/user/projects/afradikid
npx --yes supabase functions deploy sitemap --project-ref doikoqzarsuprcwkghsq
```

**بررسیِ پیش از اجرا:** کلید باید برای این پروژه **HTTP ۲۰۰** بدهد:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
     -H "User-Agent: Mozilla/5.0" "https://api.supabase.com/v1/projects/doikoqzarsuprcwkghsq"
```

**بررسیِ پس از اجرا (باید صفر باشد):**

```bash
curl -s https://farzandman.vercel.app/sitemap.xml | grep -c "/track"
```

**نکتهٔ مهم:** کلیدی که در هندآف آمده (`sbp_fce49…`) برای این پروژه **۴۰۳** می‌دهد و فقط
به زینالیکید دسترسی دارد؛ با آن این کار انجام نمی‌شود.

---

## ۷) تفکیکِ حساب‌های گوگل و بینگ (تأیید شده: ۲۰۲۶-۰۹-۱۹)

طبقِ خواستهٔ مالک، پروژهٔ فرزند من **نباید** در حساب‌هایِ پروژهٔ اول ثبت شود.
این مورد بررسی و **تأیید شد که هیچ تداخلی وجود ندارد**:

- حسابِ Google Search Console (پروژهٔ اول): فقط `zeynalikid.vercel.app` — **بدون** فرزند من ✅
- حسابِ Bing Webmaster (پروژهٔ اول): فقط `zeynalikid.vercel.app` — **بدون** فرزند من ✅

بنابراین مالک می‌تواند با حسابِ جداگانه، پروژهٔ فرزند من را ثبت کند؛ هیچ هم‌پوشانی‌ای نیست.

**کارهایی که برای فرزند من انجام شده و نیازی به تکرار ندارد:**
- ارسالِ همهٔ نشانی‌ها به IndexNow (انجام شد).
- اصلاحاتِ رابط: هدرِ چسبندهٔ پنل، بازطراحیِ موضوع‌های مشاوره، دکمهٔ مشاوره با
  متنِ سفید، اصلاحِ گاردِ فرم تکراری — همه روی سایت زنده‌اند.
- نقشهٔ سایت پویا و معرفی‌شده در robots.txt.
