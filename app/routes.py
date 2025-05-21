from flask import render_template, request, redirect, url_for
from app import app

emotion_data = []

@app.route('/fingerprint', methods=['GET', 'POST'])
def fingerprint():
    if request.method == 'POST':
        emotion = request.form.get('emotion')
        if emotion:
            emotion_data.append(emotion)
        return redirect(url_for('fingerprint'))  # ✅ This line prevents re-submitting the form
    return render_template('fingerprint.html', emotions=emotion_data)

@app.route('/')
def home():
    return render_template('index.html')

