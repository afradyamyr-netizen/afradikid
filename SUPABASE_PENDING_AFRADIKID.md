# کارهای معوقِ Supabase — پروژه «فرزند من» (afradikid)

> **این فایل برای هر دستیار بعدی است.** در تاریخ **۲۰۲۶-۰۹-۱۳** مشخص شد که
> کلید Management سوپابیسِ پروژهٔ «فرزند من» (`sbp_…` قدیمی) **منقضی/بی‌اعتبار** است و
> کلید جدیدی هم که در اختیار بود (`sbp_fce49cde…`) فقط به پروژهٔ **زینالیکید**
> دسترسی دارد و برای `doikoqzarsuprcwkghsq` پاسخ `403` می‌دهد.
> در نتیجه **تغییرهای سمت Supabase فرزند من اعمال نشد** و در این فایل ثبت شد تا با اولین
> کلید معتبر، دقیقاً و بدون حدس انجام شوند.

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

## ۱) آیتم معوق شمارهٔ ۱ — جدول `phone_tracking_codes` وجود ندارد 🔴 بحرانی

**شناسهٔ migration:** `supabase/migrations/20260912130000_one_tracking_code_per_phone.sql`
**وضعیت:** ❌ **در دیتابیس فرزند من اعمال نشده است.**
**کشف‌شده در:** ۲۰۲۶-۰۹-۱۳، با مقایسهٔ فقط-خواندنیِ دو دیتابیس

| پروژه | جدول `phone_tracking_codes` |
|---|---|
| 🟢 زینالیکید (`kkdrvexwzuuumjezipnd`) | ✅ موجود |
| 🔵 فرزند من (`doikoqzarsuprcwkghsq`) | ❌ **موجود نیست** |

### چرا مهم است (اثر واقعی روی کاربر)

کدِ پروژهٔ فرزند من **همین حالا** به این جدول وابسته است — یعنی migration در ریپو هست ولی
در دیتابیس نه، پس سایت در این بخش عملاً روی مسیر پشتیبان/خطا می‌رود:

- `supabase/functions/_shared/trackingCode.ts` (سطرهای ۴۳، ۶۸، ۷۳)
  → خواندن و نوشتنِ نگاشتِ «شماره ← کد پیگیری»
- `supabase/functions/user-portal/index.ts` (حوالی سطر ۵۸۱)
  → منبعِ حقیقتِ کد پیگیریِ کاربر

بدون جدول: «یک کد پیگیری برای هر شماره برای همیشه» روی فرزند من برقرار نیست و
پیام/رفتارِ «ساخت کد پیگیری انجام نشد» یا کدهای تکراری می‌تواند دیده شود.

### چه کاری باید انجام شود (دقیق، مرحله‌به‌مرحله)

**گام ۰ — پشتیبان و بررسیِ پیش از اجرا (فقط خواندن):**

```sql
-- در SQL Editor سوپابیسِ فرزند من، یا:
-- supabase db execute --project-ref $REF --file /tmp/precheck.sql
select to_regclass('public.phone_tracking_codes') is not null        as table_exists;
select indexname from pg_indexes
 where schemaname='public' and tablename='submissions'
   and indexname like '%tracking%';
select count(*) as submissions_count from public.submissions;
```

خروجیِ مورد انتظارِ «قبل از اصلاح»: `table_exists = false` و ایندکس
`submissions_tracking_code_unique_idx` (ایندکس قدیمی و ناسازگار) هنوز موجود است.

**گام ۱ — اعمال migration:**

```bash
cd /home/user/projects/afradikid
export SUPABASE_ACCESS_TOKEN="<PAT_معتبر_فرزند_من>"
supabase link --project-ref doikoqzarsuprcwkghsq      # بار اول
supabase db push --project-ref doikoqzarsuprcwkghsq   # فقط migrationهای اعمال‌نشده را اجرا می‌کند
```

> اگر فقط همین یک فایل را می‌خواهی اعمال کنی:
> `supabase db execute --project-ref $REF --file supabase/migrations/20260912130000_one_tracking_code_per_phone.sql`
> (فایل شامل `create table if not exists` و `drop index if exists` است، پس دوباره اجرا شدنش امن است.)

**گام ۲ — بررسیِ پس از اجرا (فقط خواندن):**

```sql
select to_regclass('public.phone_tracking_codes') is not null        as table_exists;  -- باید true
select count(*) from public.phone_tracking_codes;                                       -- تعداد شماره‌های دارای کد
select indexname from pg_indexes
 where schemaname='public' and tablename='submissions' and indexname like '%tracking%';
-- انتظار: submissions_tracking_code_unique_idx حذف شده
--         submissions_tracking_code_lookup_idx ساخته شده
```

**گام ۳ — انتشار دوبارهٔ تابع لبهٔ وابسته (احتیاطی اما لازم):**

```bash
supabase functions deploy user-portal --no-verify-jwt --project-ref doikoqzarsuprcwkghsq
```

> چون بدون Management API نمی‌شد فهمید آخرین نسخهٔ `user-portal` روی فرزند من منتشر شده یا نه،
> یک‌بار انتشار دوباره کن تا مطمئن شوی همان کدی اجرا می‌شود که به این جدول وابسته است.

**گام ۴ — تأیید نهاییِ کاربر-محور (بدون تغییر داده):**

1. در سایت `https://farzandman.vercel.app` یک فرمِ تست با یک شمارهٔ آزمایشی ثبت کن و
   کد پیگیری بگیر.
2. همان شماره را برای فرمِ **دوم** دوباره ثبت کن — باید **همان کد قبلی** را بگیرد
   (و خطای یکتایی `23505` ندهد).
3. در `/desk` پنل ادمین، بخش «فرم‌ها و داده‌ها» بررسی کن ردیف ثبت شده باشد.

**معیار پایان:** `table_exists = true` + ایندکس قدیمی حذف شده + تستِ دو فرم با یک شماره، یک کد بدهد.

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
