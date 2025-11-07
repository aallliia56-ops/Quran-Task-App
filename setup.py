# setup.py
import sys
from database import init_db, seed_db, get_db_connection # استيراد get_db_connection

conn = None # تعريف الاتصال في محيط واسع
try:
    print("--- 🛠️ بدء التهيئة من ملف setup.py ---")
    
    conn = get_db_connection() # 1. فتح الاتصال مرة واحدة
    
    init_db(conn)              # 2. تمريره لإنشاء الجداول
    seed_db(conn)              # 3. تمريره لتعبئة البيانات
    
    print("--- 🟢 تم إعداد قاعدة بيانات SQLite3 بالبيانات الأولية بنجاح ---")
    
except Exception as e:
    # سيتم عرض هذا الخطأ في سجلات Render
    print(f"ERROR: فشل في التهيئة في setup.py: {e}") 
    sys.exit(1)
finally:
    if conn:
        conn.close()           # 4. إغلاق الاتصال في النهاية (سواء نجح أم فشل)
