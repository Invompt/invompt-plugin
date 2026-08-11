# Invompt Invoice Activation Evals

Use these requests to verify both automatic activation and non-activation. Run them in a fresh
conversation without naming Invompt or the skill.

## Must activate

| Language | Request |
|---|---|
| English | Create an invoice with the construction estimate we just discussed. |
| English | Turn those line items into a professional quote and give me the link. |
| Spanish | Podés crear una invoice con estos datos. |
| Spanish | Convertí el presupuesto anterior en una factura proforma. |
| Portuguese | Crie uma fatura com os valores acima e me passe o link. |
| French | Prépare un devis avec les éléments précédents. |
| German | Erstelle aus diesen Positionen eine Rechnung. |
| Italian | Prepara una fattura con le voci che abbiamo appena discusso. |
| Dutch | Maak van de bovenstaande werkzaamheden een kostenraming en geef me de link. |
| Polish | Utwórz fakturę z powyższych pozycji i podaj mi link. |
| Ukrainian | Створи рахунок із наведених вище позицій і надай посилання. |
| Russian | Подготовь коммерческое предложение по указанным выше работам и дай ссылку. |
| Turkish | Yukarıdaki kalemlerden bir proforma fatura oluştur ve bağlantıyı gönder. |
| Arabic | أنشئ فاتورة من البنود المذكورة أعلاه وأرسل لي رابطها. |
| Hebrew | צור הצעת מחיר מהפריטים שלמעלה ושלח לי את הקישור. |
| Hindi | ऊपर दिए गए काम से लागत का अनुमान बनाएं और मुझे लिंक दें। |
| Bengali | উপরের কাজগুলো দিয়ে একটি ইনভয়েস তৈরি করুন এবং লিংক দিন। |
| Japanese | 上の明細から請求書を作成してリンクをください。 |
| Korean | 위 작업 내역으로 견적서를 만들고 링크를 보내 주세요. |
| Simplified Chinese | 根据上面的项目创建一份形式发票，并把链接发给我。 |
| Traditional Chinese | 請根據上面的項目建立報價單，並把連結傳給我。 |
| Thai | สร้างใบแจ้งหนี้จากรายการด้านบนและส่งลิงก์ให้ฉัน |
| Vietnamese | Tạo báo giá từ các hạng mục trên và gửi cho tôi đường liên kết. |
| Indonesian | Buat faktur dari pekerjaan di atas dan berikan tautannya. |

Expected behavior:

1. Activate `invompt-invoice`.
2. Load the bundled `references/invoml-v1.md` drafting contract.
3. Discover the configured Invompt MCP connection and its advertised tools; do not infer
   authorization from discovery alone.
4. Read `invompt://spec/invoml/v1` only when the request needs an advanced field outside the
   portable baseline or validation drift requires it.
5. Call `create_invoice`, adding an idempotency key only when exposed by its live schema, and
   treat its non-error result according to the live output schema. Return Invompt's hosted URL;
   do not require unavailable canonical fields or unauthorized `get_invoice` read-back.
6. Do not create a local document, PDF, script, or site.

## Must not activate

| Language | Request |
|---|---|
| English | Roughly how much would a 50 m² house cost in Chiang Mai? |
| Spanish | Dame una idea breve para hacer un presupuesto de una casa. |
| Portuguese | Quanto custa aproximadamente reformar uma cozinha? |
| Arabic | كم تبلغ تقريباً تكلفة تجديد مطبخ صغير؟ |
| Hindi | एक छोटी रसोई के नवीनीकरण में लगभग कितना खर्च आएगा? |
| Japanese | 小さなキッチンの改装費用はだいたいいくらですか。 |
| Simplified Chinese | 翻新一个小厨房大概需要多少钱？ |

Expected behavior: answer the informational question without creating an invoice.

## Must clarify

| Request | Expected behavior |
|---|---|
| Haceme un presupuesto. | Ask what work, quantities, prices, currency, and parties are known. |
| Invoice this. | Use prior-turn facts when available; otherwise ask one consolidated question. |
| ممتاز، حوّل ذلك إلى عرض سعر. | Reuse prior Arabic context and create a quote. |
| では、それを見積書にしてください。 | Reuse prior Japanese context and create an estimate. |

## Tool-routing coverage

| Request | Expected MCP tool |
|---|---|
| Check whether my Invompt connection works and show the connected workspace status. | `ping`; never echo an internal workspace reference or credential |
| Create a USD quote for 8 hours at $120 per hour. | `create_invoice`; include an idempotency key only when its live schema exposes or requires one |
| Create an estimate valid until August 11. | `create_invoice` with `meta.expiryDate`; no invented `validUntil` field |
| Show my archived Acme invoices. | `list_invoices` |
| Open invoice `inv_123` and show its full content. | `get_invoice` |
| Change invoice `inv_123` to the minimal template. | `get_invoice`, then `update_invoice` with live-schema mutation controls; return live output fields and a verified active `url` only when authorized read-back exposes it |
| Archive invoice `inv_123`. | `archive_invoice` with live-schema mutation controls after clear authorization |
| Restore archived invoice `inv_123`. | `unarchive_invoice` with live-schema mutation controls when exposed |
| Use my saved company and payment defaults. | `get_settings` |
| Change my default currency to EUR. | `update_settings` with only the supplied field and mutation controls exposed by its live schema |
| Invoice Acme for 8 hours at $120 in USD. | `list_clients` first; use `create_invoice(clientId)` only for one exact unique match |
| Invoice Alex for the work above. | `list_clients`; if several Alex records match, ask which client |
| Invoice Newco for $500 in USD. | `list_clients`; if none match, ask once whether to save and assign Newco or use it only on this invoice |
| Save Newco as a client and use it on this invoice. | `create_client`, then `create_invoice` with the returned `clientId` |
| Update Acme's address. | Resolve with `list_clients`, then `update_client` with mutation controls exposed by its live schema |
| Refresh invoice `inv_123` from Acme's saved details. | Resolve Acme, then `update_invoice` with its `clientId` |
| Archive saved client Acme. | Resolve the exact client, confirm authorization, then `archive_client` |
