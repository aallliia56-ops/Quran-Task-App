from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3
from datetime import datetime 

# ... (بقية الكود)

app = Flask(__name__)
# مفتاح سري لحماية الجلسات (مهم جداً لأمان الويب)
app.secret_key = 'your_super_secret_key_here' 
DB_NAME = 'quran_hifz.db'

# --- 1. وظائف قاعدة البيانات ---

def get_db_connection():
    # دالة بسيطة للاتصال بقاعدة البيانات
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row # لجعل النتائج سهلة الوصول كقاموس (dictionary)
    return conn

# --- 2. دالة مساعدة: دمج المقاطع حسب المستوى ومنطق الحدود ---

def merge_segments(segments, level):
    """
    دمج المقاطع المتتالية بناءً على مستوى أداء الطالب (Level)، مع إضافة شرط:
    عدم دمج مقطع يمثل نهاية سورة مع مقطع يمثل بداية سورة تالية.
    """
    merged_segments = []
    i = 0
    segments_list = list(segments) 
    
    while i < len(segments_list):
        current_segment = segments_list[i]
        
        # عدد المقاطع المراد دمجها (لا يتجاوز نهاية المنهج)
        num_to_merge = min(level, len(segments_list) - i) 
        
        # 1. 🛑 فحص شرط الحدود (The Boundary Check)
        # هذا الشرط ينطبق فقط إذا كان مستوى الطالب > 1 ويوجد مقطع تالٍ للدمج
        if level > 1 and num_to_merge > 1:
            next_segment = segments_list[i + 1]
            
            # إذا كان رقم سورة نهاية المقطع الحالي لا يساوي رقم سورة بداية المقطع التالي
            if current_segment['sura_end'] != next_segment['sura_start']:
                num_to_merge = 1
                # هذا يضمن أن المقطع الحالي (نهاية السورة) يعامل كـ مهمة فردية.
        
        # 2. تطبيق الدمج/عدم الدمج بناءً على القيمة النهائية لـ num_to_merge
        
        if num_to_merge == 1:
            # المستوى 1، أو تم إلغاء الدمج بسبب شرط الحدود
            merged_segment = current_segment
        else:
            # المستويات 2 أو 3 (بدون حدود سور متقاطعة)
            last_segment = segments_list[i + num_to_merge - 1]
            
            # 💡 منطق بناء اسم المهمة 💡
            if current_segment['sura_start'] == last_segment['sura_end']:
                try:
                    sura_name_part = current_segment['name'].split(': ')[1].split(' (')[0]
                    new_name = f"{sura_name_part} ({current_segment['aya_start']}-{last_segment['aya_end']})"
                except IndexError:
                    new_name = f"{current_segment['name']} إلى {last_segment['name']}"
                
                final_name = f"المهمة المدمجة: {new_name}"
            
            else:
                final_name = f"المهمة المدمجة: {current_segment['name']} إلى {last_segment['name']}"
                
            # بناء المقطع المدمج
            merged_segment = {
                'id': current_segment['id'],
                'segment_order': current_segment['segment_order'],
                'name': final_name,
                'sura_start': current_segment['sura_start'],
                'aya_start': current_segment['aya_start'],
                'sura_end': last_segment['sura_end'],
                'aya_end': last_segment['aya_end'],
            }

        merged_segments.append(merged_segment)
        i += num_to_merge # القفز بعدد المقاطع المدمجة

    return merged_segments

# --- 3. مسار الدخول (Login) ---

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        auth_code = request.form['auth_code']
        
        print(f"DEBUG: الرمز المدخل هو: {auth_code}") 
        
        user = None 

        try:
            conn = get_db_connection()
            user = conn.execute('SELECT * FROM users WHERE auth_code = ?', (auth_code,)).fetchone()
        except sqlite3.Error as e:
            print(f"DATABASE ERROR: {e}")
            error = 'حدث خطأ في قاعدة البيانات.'
            return render_template('login.html', error=error)
        finally:
            if conn:
                conn.close()

        print(f"DEBUG: المستخدم المسترجع: {user}") 

        # ⬅️ منطق الدخول والتوجيه
        if user:
            # تخزين بيانات المستخدم في الجلسة
            session['user_id'] = user['id']
            session['user_role'] = user['role']
            session['user_name'] = user['name']
            
            if user['role'] == 'Teacher':
                return redirect(url_for('teacher_dashboard'))
            elif user['role'] == 'Student':
                return redirect(url_for('student_dashboard'))
            elif user['role'] == 'Parent':
                return redirect(url_for('parent_dashboard'))
        
        # إذا لم يتم العثور على المستخدم
        error = 'رمز الدخول غير صحيح'
        return render_template('login.html', error=error)
        
    return render_template('login.html')

# --- 4. مسارات لوحات التحكم (Dashboards) ---

@app.route('/teacher')
def teacher_dashboard():
    """لوحة تحكم المعلم (مركز الإشراف): عرض المهام المعلقة للمراجعة."""
    if 'user_role' not in session or session['user_role'] != 'Teacher':
        return redirect(url_for('login'))

    teacher_id = session['user_id']
    conn = get_db_connection()
    
    # استعلام معقد (JOIN) لجلب السجلات المعلقة مع أسماء الطلاب والمقاطع المرتبطة
    pending_records = conn.execute("""
        SELECT 
            p.id AS record_id, p.date_submitted, p.record_type,
            s.name AS student_name, 
            seg.name AS segment_name,
            s.id AS student_id,
            seg.id AS segment_id
        FROM progress_records p
        JOIN users s ON p.student_id = s.id
        JOIN segments seg ON p.segment_id = seg.id
        WHERE p.status = 'Pending'
    """).fetchall()
    
    conn.close()

    # الآن، سنعرض صفحة HTML بدلاً من نص الترحيب
    return render_template('teacher_dashboard.html', 
                           teacher_name=session.get('user_name'),
                           pending_records=pending_records)

@app.route('/evaluate', methods=['POST'])
def evaluate_record():
    """معالجة قبول أو رفض سجل تقدم من قبل المعلم."""
    if 'user_role' not in session or session['user_role'] != 'Teacher':
        return redirect(url_for('login'))

    record_id = request.form['record_id']
    action = request.form['action'] # 'accept' or 'reject'
    teacher_id = session['user_id']
    
    # تحديد الحالة الجديدة
    new_status = 'Accepted' if action == 'accept' else 'Rejected'
    
    conn = get_db_connection()
    try:
        # تحديث حالة السجل في قاعدة البيانات
        conn.execute("""
            UPDATE progress_records
            SET status = ?, teacher_id = ?
            WHERE id = ?
        """, (new_status, teacher_id, record_id))
        conn.commit()
    except sqlite3.Error as e:
        print(f"ERROR UPDATING RECORD: {e}")
    finally:
        conn.close()

    # بعد التحديث، قم بإعادة توجيه المعلم إلى لوحة التحكم المحدثة
    return redirect(url_for('teacher_dashboard'))


@app.route('/submit_progress', methods=['POST'])
def submit_progress():
    """
    تسجيل الإنجاز: مزامنة منطق الدمج والتتبع لتسجيل العدد الصحيح من المقاطع.
    """
    if 'user_role' not in session or session['user_role'] != 'Student':
        return redirect(url_for('login'))
        
    student_id = session['user_id']
    first_segment_id = request.form['segment_id'] 
    
    conn = get_db_connection()
    try:
        # 1. جلب بيانات المقطع الأول لتحديد المهمة وترتيبه
        first_segment = conn.execute("SELECT segment_order, sura_start, sura_end FROM segments WHERE id = ?", (first_segment_id,)).fetchone()
        if not first_segment:
            return "خطأ: المقطع غير موجود.", 400
        
        start_order = first_segment['segment_order']
        
        # 2. جلب مستوى أداء الطالب (Level)
        student_level_data = conn.execute("SELECT performance_level FROM users WHERE id = ?", (student_id,)).fetchone()
        level = student_level_data['performance_level'] if student_level_data and student_level_data['performance_level'] else 1
        
        # 3. 🛑 تحديد الحجم الفعلي للمهمة (إعادة تطبيق منطق الحدود)
        
        # أ. جلب جميع المقاطع التي تبدأ من ترتيب المقطع الحالي
        all_segments = conn.execute("""
            SELECT id, segment_order, sura_start, sura_end 
            FROM segments 
            WHERE segment_order >= ? 
            ORDER BY segment_order
        """, (start_order,)).fetchall()
        
        current_segment = all_segments[0]
        num_to_merge = level # الافتراض الأولي هو مستوى الطالب
        
        # ب. فحص الحدود لتقليل حجم الدمج إلى 1 إذا لزم الأمر
        if level > 1 and len(all_segments) > 1:
            next_segment = all_segments[1]
            if current_segment['sura_end'] != next_segment['sura_start']:
                num_to_merge = 1
        
        # ج. تعديل num_to_merge لنهاية المنهج
        num_to_merge = min(num_to_merge, len(all_segments))

        # د. تحديد الترتيب النهائي للمقاطع التي سيتم تسجيلها
        end_order = start_order + num_to_merge - 1 # الترتيب النهائي الصحيح

        # 4. جلب ID المقاطع الأساسية ضمن النطاق الصحيح
        segments_to_record = conn.execute("""
            SELECT id FROM segments 
            WHERE segment_order BETWEEN ? AND ?
            ORDER BY segment_order
        """, (start_order, end_order)).fetchall()
        
        date_submitted = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # 5. إنشاء سجل 'Pending' لكل مقطع أساسي ضمن المهمة المنجزة
        for segment in segments_to_record:
            segment_id_actual = segment['id']
            # التحقق من عدم وجود سجل معلق أو مقبول بالفعل لهذا المقطع
            existing_record = conn.execute("SELECT status FROM progress_records WHERE student_id = ? AND segment_id = ? AND status IN ('Pending', 'Accepted')",(student_id, segment_id_actual)).fetchone()
            
            if not existing_record:
                conn.execute("""
                    INSERT INTO progress_records (student_id, segment_id, record_type, date_submitted, status)
                    VALUES (?, ?, ?, ?, 'Pending')
                """, (student_id, segment_id_actual, 'Hifz', date_submitted))
        
        conn.commit()
    except sqlite3.Error as e:
        print(f"ERROR SUBMITTING PROGRESS: {e}")
    finally:
        conn.close()

    return redirect(url_for('student_dashboard'))


@app.route('/student')
def student_dashboard():
    """
    ✅✅ تعديل نهائي: لوحة تحكم الطالب:
    1. عرض المهمة الحالية الواحدة فقط.
    2. المهمة التالية لا تظهر حتى يتم قبول المهمة الحالية (حالة Accepted).
    """
    if 'user_role' not in session or session['user_role'] != 'Student':
        return redirect(url_for('login'))
    
    student_id = session['user_id']
    conn = get_db_connection()

    # 1. جلب مستوى أداء الطالب (Level)
    student_level = conn.execute("SELECT performance_level FROM users WHERE id = ?", (student_id,)).fetchone()
    level = student_level['performance_level'] if student_level and student_level['performance_level'] else 1
    
    # 2. جلب جميع مقاطع المنهج
    segments = conn.execute("SELECT * FROM segments ORDER BY segment_order").fetchall()
    
    # 3. جلب آخر حالة لكل مقطع أساسي
    progress_status = conn.execute("""
        SELECT 
            p.segment_id, 
            p.status, 
            MAX(p.date_submitted) 
        FROM progress_records p
        WHERE p.student_id = ?
        GROUP BY p.segment_id
    """, (student_id,)).fetchall()
    
    # تحويل سجلات التقدم إلى قاموس: {segment_id: status}
    status_map = {p['segment_id']: p['status'] for p in progress_status}

    # 4. دمج المقاطع بناءً على المستوى (للحصول على قائمة المهام المدمجة)
    all_merged_tasks = merge_segments(segments, level) 
    
    current_task = None
    
    # 5. تحديد المهمة الحالية (Current Task Logic)
    for task in all_merged_tasks:
        start_order = task['segment_order']
        
        # نستخدم نفس استراتيجية جلب المقاطع التي في submit_progress لتحديد الحجم الصحيح
        all_segments_from_start = conn.execute("""
            SELECT id, segment_order, sura_start, sura_end 
            FROM segments 
            WHERE segment_order >= ? 
            ORDER BY segment_order
        """, (start_order,)).fetchall()
        
        # تحديد عدد المقاطع الأساسية التي تشكل المهمة المعروضة فعلياً
        num_to_check = level
        if level > 1 and len(all_segments_from_start) > 1:
            current_segment_data = all_segments_from_start[0]
            next_segment_data = all_segments_from_start[1]
            
            if current_segment_data['sura_end'] != next_segment_data['sura_start']:
                 num_to_check = 1 # إلغاء الدمج عند الحدود
        
        num_to_check = min(num_to_check, len(all_segments_from_start))
        
        # المقاطع الأساسية التي يجب فحص حالتها لهذه المهمة
        actual_segments_in_task = all_segments_from_start[:num_to_check]
        
        is_task_complete = True
        
        for seg in actual_segments_in_task:
            segment_id_actual = seg['id']
            # 🛑 التعديل الأساسي: المهمة مكتملة فقط إذا كانت حالة جميع مقاطعها 'Accepted'
            if status_map.get(segment_id_actual) != 'Accepted':
                is_task_complete = False
                break
        
        # إذا كانت المهمة غير مكتملة، فهي المهمة الحالية، ونوقف البحث.
        if not is_task_complete:
            current_task = task
            break
    
    conn.close()
    
    # نرسل المهمة الحالية (أو قائمة فارغة إذا اكتمل كل شيء)
    current_segments = [current_task] if current_task else []

    # تمرير البيانات إلى الواجهة
    return render_template('student_dashboard.html',
                           student_name=session.get('user_name'),
                           segments=current_segments, # إرسال مهمة واحدة فقط
                           status_map=status_map)

@app.route('/parent')
def parent_dashboard():
    """لوحة تحكم ولي الأمر: عرض سجلات التقدم المقبولة للطالب المرتبط."""
    if 'user_role' not in session or session['user_role'] != 'Parent':
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    
    # 1. جلب ID الطالب المرتبط بولي الأمر الحالي
    parent_user = conn.execute("SELECT student_id, name FROM users WHERE id = ?", (session['user_id'],)).fetchone()
    
    if not parent_user or not parent_user['student_id']:
        conn.close()
        return "لا يوجد طالب مرتبط بهذا الحساب."

    student_id = parent_user['student_id']
    student_name = conn.execute("SELECT name FROM users WHERE id = ?", (student_id,)).fetchone()['name']

    # 2. جلب سجلات التقدم "المقبولة" للطالب
    accepted_records = conn.execute("""
        SELECT 
            p.record_type, p.date_submitted,
            seg.name AS segment_name,
            u.name AS teacher_name
        FROM progress_records p
        JOIN segments seg ON p.segment_id = seg.id
        JOIN users u ON p.teacher_id = u.id
        WHERE p.student_id = ? AND p.status = 'Accepted'
        ORDER BY p.date_submitted DESC
    """, (student_id,)).fetchall()
    
    conn.close()

    # تمرير البيانات إلى الواجهة
    return render_template('parent_dashboard.html',
                           parent_name=session.get('user_name'),
                           student_name=student_name,
                           accepted_records=accepted_records)


# --- 5. مسار تسجيل الخروج (Logout) ---

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


if __name__ == '__main__':
    # تأكد من إيقاف وتشغيل التطبيق مرة أخرى بعد اللصق
    app.run(debug=True)