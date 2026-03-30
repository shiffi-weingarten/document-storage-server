# שרת אחסון מסמכים

שרת RESTful שנבנה עם Node.js, Express ו-TypeScript לניהול מסמכים ומעקב אחר היסטוריית פעולות. הנתונים נשמרים ב-MongoDB.

---

## טכנולוגיות

- **סביבת ריצה:** Node.js
- **שפה:** TypeScript
- **פריימוורק:** Express
- **מסד נתונים:** MongoDB
- **יצירת PDF:** PDFKit

---

## התחלה מהירה

### דרישות מקדימות

- Node.js מותקן
- חשבון MongoDB Atlas או MongoDB מקומי

### התקנה

```bash
npm install
```

### הגדרת חיבור למסד הנתונים

בקובץ `utils/db-conn.ts`, הגדר את כתובת החיבור ושם מסד הנתונים:

```ts
const DB_URL = "your-mongodb-connection-string";
const DB_NAME = "your-database-name";
```

### הרצה

```bash
npx ts-node main.ts
```

השרת יעלה בכתובת `http://127.0.0.1:5000`.

---

## אימות זהות

כל בקשה חייבת לכלול את הכותרת הבאה:

| כותרת | תיאור |
|--------|-------------|
| `X-User-Id` | מזהה המשתמש שמבצע את הבקשה |

בקשה ללא כותרת זו תידחה עם שגיאה `401 Unauthorized`.

---

## תיעוד API

### מסמכים

נתיב בסיס: `/documents`

#### יצירת מסמך
```
POST /documents
```
**כותרות:** `X-User-Id`

**גוף הבקשה:**
```json
{
  "path": "/projects/myapp",
  "title": "המסמך שלי",
  "content": "תוכן המסמך כאן"
}
```
**מחזיר:** `201` — פרטי המסמך (ללא תוכן)

---

#### קבלת כל המסמכים
```
GET /documents
```
**כותרות:** `X-User-Id`

**פרמטרי query (כולם אופציונליים):**

| פרמטר | תיאור |
|-----------|-------------|
| `pathPrefix` | סינון לפי קידומת נתיב |
| `sortBy` | מיון לפי שם שדה. הוסף `-` לסדר יורד (לדוגמה: `-lastUpdatedAt`) |
| `author` | סינון לפי מזהה מחבר |

**מחזיר:** `200` — מערך של פרטי מסמכים

---

#### קבלת מסמך לפי ID
```
GET /documents/:id
```
**כותרות:** `X-User-Id`

**מחזיר:** `200` — פרטי המסמך

---

#### עדכון מסמך
```
PUT /documents
```
**כותרות:** `X-User-Id`

**גוף הבקשה:** אובייקט מסמך מלא כולל `id`

**מחזיר:** `200` — פרטי המסמך המעודכן

---

#### מחיקת מסמך
```
DELETE /documents/:id
```
**כותרות:** `X-User-Id`

**מחזיר:** `200` — פרטי המסמך שנמחק

---

#### הורדת מסמך כ-PDF
```
POST /documents/:id/create-pdf
```
**כותרות:** `X-User-Id`

**מחזיר:** `200` — קובץ PDF להורדה הכולל את כותרת ותוכן המסמך

---

### היסטוריה

נתיב בסיס: `/history`

#### קבלת היסטוריית פעולות
```
GET /history
```
**כותרות:** `X-User-Id`

מחזיר רשימה מדורגת של פעולות, ממוינת לפי זמן בסדר יורד.

**פרמטרי query (כולם אופציונליים):**

| פרמטר | תיאור |
|-----------|-------------|
| `pathPrefix` | סינון לפי קידומת נתיב |
| `user` | סינון לפי מזהה משתמש |
| `documentId` | סינון לפי מזהה מסמך |
| `documentAuthor` | סינון לפי מחבר המסמך |
| `operationType` | סינון לפי סוג פעולה (`CREATE`, `UPDATE`, `DELETE`) |
| `page` | מספר עמוד (ברירת מחדל: `1`) |
| `limit` | תוצאות לעמוד (ברירת מחדל: `10`) |

**דוגמה:**
```
GET /history?user=123&operationType=DELETE
```

**מחזיר:** `200` — מערך מדורג של פעולות

---

#### מחיקת היסטוריה
```
DELETE /history
```
**כותרות:** `X-User-Id`

**מחזיר:** `200` — תגובה ריקה

---

## מודלי נתונים

### מסמך
```ts
{
  id: string;
  author: string;
  path: string;
  title: string;
  content: string;
  createdAt: Date;
  lastUpdateAt: Date;
  lastUpdateBy: string;
}
```

### פרטי מסמך
```ts
{
  id: string;
  author: string;
  path: string;
  title: string;
}
```

### פעולת היסטוריה
```ts
{
  user: string;
  documentId: string;
  documentPath: string;
  documentAuthor: string;
  timestamp: Date;
  operationType: "CREATE" | "UPDATE" | "DELETE";
}
```

---

## מבנה הפרויקט

```
server/
├── documents/
│   ├── models.ts
│   ├── document-dal.ts
│   ├── document-service.ts
│   └── documents-api.ts
├── history/
│   ├── models.ts
│   ├── history-dal.ts
│   ├── history-service.ts
│   └── history-api.ts
├── utils/
│   ├── db-conn.ts
│   ├── auth-middleware.ts
│   ├── error-middleware.ts
│   └── validator-middleware.ts
├── app.ts
└── main.ts
```
