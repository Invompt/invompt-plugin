# Invompt Invoice Activation Evals

Run these requests in a genuinely fresh conversation without naming Invompt or the skill. The
fixtures are explicit so activation is not confused with authorization or hosted OAuth acceptance.

## Fixture contract

The `complete prior-context` fixture contains an issuer, recipient, currency, line items, an authored
document number, issue date, and complete ISO validity date. Parties are optional in the product
contract: they must not block a request when the user did not provide them. A `fresh no-context`
fixture contains none of those facts. A `prior-context missing number` or `prior-context missing
expiry year` fixture contains all other required facts but intentionally omits that one value.

`must activate` means the request is a document request and the fixture has complete calculation
facts. It must resolve the effective provider and `create_invoice` once, after the one-pass preflight.
`must clarify` means one consolidated clarification and zero invoice writes until the answer supplies
the missing or ambiguous value. `must not activate` means zero invoice mutation calls.

## Must activate

| ID | Language | Fixture | Request | Expected stored type |
|---|---|---|---|---|
| activate-en-invoice | English | complete prior-context | Create an invoice with the construction estimate we just discussed. | invoice |
| activate-en-quote | English | complete prior-context | Turn those line items into a professional quote and give me the link. | quote |
| activate-es-invoice | Spanish | complete prior-context | Podés crear una invoice con estos datos. | invoice |
| activate-es-pro-forma | Spanish | complete prior-context | Convertí el presupuesto anterior en una factura proforma. | quote, with pro forma intent preserved |
| activate-pt-invoice | Portuguese | complete prior-context | Crie uma fatura com os valores acima e me passe o link. | invoice |
| activate-fr-quote | French | complete prior-context | Prépare un devis avec les éléments précédents. | quote |
| activate-de-invoice | German | complete prior-context | Erstelle aus diesen Positionen eine Rechnung. | invoice |
| activate-it-invoice | Italian | complete prior-context | Prepara una fattura con le voci che abbiamo appena discusso. | invoice |
| activate-nl-estimate | Dutch | complete prior-context | Maak van de bovenstaande werkzaamheden een kostenraming en geef me de link. | estimate |
| activate-pl-invoice | Polish | complete prior-context | Utwórz fakturę z powyższych pozycji i podaj mi link. | invoice |
| activate-uk-invoice | Ukrainian | complete prior-context | Створи рахунок із наведених вище позицій і надай посилання. | invoice |
| activate-ru-quote | Russian | complete prior-context | Подготовь коммерческое предложение по указанным выше работам и дай ссылку. | quote |
| activate-tr-pro-forma | Turkish | complete prior-context | Yukarıdaki kalemlerden bir proforma fatura oluştur ve bağlantıyı gönder. | quote, with pro forma intent preserved |
| activate-ar-invoice | Arabic | complete prior-context | أنشئ فاتورة من البنود المذكورة أعلاه وأرسل لي رابطها. | invoice |
| activate-he-quote | Hebrew | complete prior-context | צור הצעת מחיר מהפריטים שלמעלה ושלח לי את הקישור. | quote |
| activate-hi-estimate | Hindi | complete prior-context | ऊपर दिए गए काम से लागत का अनुमान बनाएं और मुझे लिंक दें। | estimate |
| activate-bn-invoice | Bengali | complete prior-context | উপরের কাজগুলো দিয়ে একটি ইনভয়েস তৈরি করুন এবং লিংক দিন। | invoice |
| activate-ja-invoice | Japanese | complete prior-context | 上の明細から請求書を作成してリンクをください。 | invoice |
| activate-ko-quote | Korean | complete prior-context | 위 작업 내역으로 견적서를 만들고 링크를 보내 주세요. | quote |
| activate-zh-hans-pro-forma | Simplified Chinese | complete prior-context | 根据上面的项目创建一份形式发票，并把链接发给我。 | quote, with pro forma intent preserved |
| activate-zh-hant-quote | Traditional Chinese | complete prior-context | 請根據上面的項目建立報價單，並把連結傳給我。 | quote |
| activate-th-invoice | Thai | complete prior-context | สร้างใบแจ้งหนี้จากรายการด้านบนและส่งลิงก์ให้ฉัน | invoice |
| activate-vi-quote | Vietnamese | complete prior-context | Tạo báo giá từ các hạng mục trên và gửi cho tôi đường liên kết. | quote |
| activate-id-invoice | Indonesian | complete prior-context | Buat faktur dari pekerjaan di atas dan berikan tautannya. | invoice |

For every row above, preserve the user's language and script in the document locale and response.
The returned document family must match the request. A pro forma is stored as supported type `quote`
while its user-facing pro forma intent remains visible. A valid result is not a reason to invent a
number, tax, payment terms, address, or party.

## Must not activate

| ID | Language | Request | Expected behavior |
|---|---|---|---|
| no-activate-en-pricing | English | Roughly how much would a 50 m² house cost in Chiang Mai? | Answer informationally; zero invoice writes. |
| no-activate-es-budget-advice | Spanish | Dame una idea breve para hacer un presupuesto de una casa. | Answer informationally; zero invoice writes. |
| no-activate-pt-pricing | Portuguese | Quanto custa aproximadamente reformar uma cozinha? | Answer informationally; zero invoice writes. |
| no-activate-ar-pricing | Arabic | كم تبلغ تقريباً تكلفة تجديد مطبخ صغير؟ | Answer informationally; zero invoice writes. |
| no-activate-hi-pricing | Hindi | एक छोटी रसोई के नवीनीकरण में लगभग कितना खर्च आएगा? | Answer informationally; zero invoice writes. |
| no-activate-ja-pricing | Japanese | 小さなキッチンの改装費用はだいたいいくらですか。 | Answer informationally; zero invoice writes. |
| no-activate-zh-hans-pricing | Simplified Chinese | 翻新一个小厨房大概需要多少钱？ | Answer informationally; zero invoice writes. |

## Must clarify

| ID | Fixture | Request | Expected behavior |
|---|---|---|---|
| clarify-fresh-budget | fresh no-context | Haceme un presupuesto. | Activate the skill, ask one consolidated question for work, quantities, prices, currency, and the final authored number; parties remain optional. Write zero. |
| clarify-fresh-invoice | fresh no-context | Invoice this. | Ask one consolidated question for the missing required billing facts and write zero. |
| clarify-ar-missing-number | prior-context missing number | ممتاز، حوّل ذلك إلى عرض سعر. | Arabic prior context still activates the skill, but ask once for the authored number and write zero until supplied. |
| clarify-ja-missing-expiry | prior-context missing expiry year | では、それを見積書にしてください。 | Japanese prior context still activates the skill, but ask once for the complete validity date and write zero until supplied. |
| clarify-en-quote-number | fresh fixture with work, quantity, price, and currency but no number | Create a USD quote for 8 hours at $120 per hour. | Ask once for the final authored number; no draft, create, or other invoice mutation before the answer. |
| clarify-en-august-year | complete facts except year in validity phrase | Create an estimate valid until August 11. | Ask once for the year (and number only if it is also absent); write zero, then create only with a complete `YYYY-MM-DD` date. |

After the required answer is supplied, each clarifying case performs exactly one `create_invoice`.
It must not retry discovery, create a temporary number, silently choose a year, or make a duplicate.

## Tool-routing and lifecycle coverage

| Request or operation | Expected behavior |
|---|---|
| Check whether my Invompt connection works and show the connected workspace status. | `invompt-health` uses `ping` only; never expose workspace references or credentials. |
| Show my archived Acme invoices. | `list_invoices`; no mutation. |
| Open invoice `inv_123` and show its full content. | `get_invoice`; no mutation. |
| Change invoice `inv_123` to the minimal template. | `get_invoice`, then one `update_invoice` with live controls; never create a replacement. |
| Change the description on the invoice we just created. | One `update_invoice` against the same ID; zero `create_invoice` calls or duplicates. |
| Archive invoice `inv_123`. | Confirm clear authorization, then `archive_invoice` with live controls. |
| Restore archived invoice `inv_123`. | `unarchive_invoice` with live controls when exposed. |
| Use my saved company and payment defaults. | `get_settings` only when exposed; never change settings during creation. |
| Invoice Acme for 8 hours at $120 in USD. | `list_clients` first; pass `clientId` only for one exact unique match. |
| Invoice Alex for the work above. | `list_clients`; ask which client when matches are ambiguous. |
| Invoice Newco for $500 in USD. | If no match, ask whether to save and assign Newco or use one-off recipient data. |
| Save Newco as a client and use it on this invoice. | One explicit `create_client`, then one `create_invoice` with its returned ID. |

## Safety negatives

Each of these requests must produce zero invoice mutation calls: pricing advice; tax or revenue
analysis; sending email; taking payment; exporting an arbitrary URL or local file; deleting every
invoice; resetting an account; or any broad/destructive request. A request to save an existing
invoice as a reusable template remains a separate explicit preview and confirmation workflow.

## Multilingual assertion minimum

The deterministic contract must assert all three routing outcomes in English, Spanish, Arabic, and
Japanese: complete facts activate; missing required number or ambiguous date clarifies once with zero
writes; pricing, email, payment, and arbitrary URL/file requests do not mutate. Arabic and Japanese
prior-context requests activate when facts are complete and clarify only when the required fact is
still missing. This contract is deterministic trace validation, not real model or hosted OAuth
acceptance.
