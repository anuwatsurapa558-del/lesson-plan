# สร้างแผนการสอน · Lesson Plan Studio

ระบบสร้างแผนการจัดการเรียนรู้อัตโนมัติตามหลักสูตรแกนกลาง
ใช้ Google Gemini 2.5 Flash (ฟรี ไม่ต้องผูกบัตรเครดิต)

## วิธี Deploy (ผ่านเว็บ 100%)

### ขั้น 1: ขอ Gemini API Key (ฟรี ไม่ใช้บัตรเครดิต)

1. เข้า https://aistudio.google.com/apikey
2. Login ด้วย Google Account
3. คลิก **Create API key** → เลือก **Create API key in new project**
4. คัดลอก key (ขึ้นต้น `AIza...`) เก็บไว้ใน Notes

### ขั้น 2: อัปโหลดโค้ดขึ้น GitHub

1. สมัครที่ github.com (ฟรี)
2. คลิก **+** มุมขวาบน → **New repository**
3. ชื่อ `lesson-plan` → Public → **Create repository**
4. คลิกลิงก์ **"uploading an existing file"**
5. แตก zip นี้ แล้วลากไฟล์ทั้งหมด*ภายในโฟลเดอร์* วางบนหน้าเว็บ GitHub
6. เลื่อนลง กด **Commit changes**

### ขั้น 3: Deploy ที่ Vercel

1. ไปที่ vercel.com → **Sign up with GitHub**
2. หน้า Dashboard → **Add New...** → **Project**
3. หา repo `lesson-plan` → **Import**
4. **ก่อนกด Deploy** ขยาย **Environment Variables**
   - Name: `GEMINI_API_KEY`
   - Value: paste key ที่ได้จากขั้น 1
   - กด **Add**
5. คลิก **Deploy** → รอ 1-2 นาที
6. เสร็จ! ได้ URL แบบ `lesson-plan-xxx.vercel.app`

## ขีดจำกัดฟรี (Gemini 2.5 Flash)

- 1,500 คำขอต่อวัน
- 15 คำขอต่อนาที
- 1,000,000 tokens ต่อนาที
- Reset ทุกเที่ยงคืน (Pacific Time = ~7 โมงเช้าไทย)

## ปรับโมเดล

ในไฟล์ `api/gemini.js` เปลี่ยนชื่อโมเดลได้:
- `gemini-2.5-flash` (default, สมดุลระหว่างเร็วและฉลาด)
- `gemini-2.5-flash-lite` (เร็วสุด, quota เยอะสุด: 1,000/วัน)
- `gemini-2.5-pro` (ฉลาดสุด แต่ quota เหลือแค่ 50-100/วัน)

## ข้อควรระวัง

Google อาจนำ prompt และคำตอบใน free tier ไปใช้ปรับปรุงโมเดล
สำหรับแผนการสอนทั่วไปไม่มีปัญหา แต่ห้ามใส่ข้อมูลส่วนตัวนักเรียน
