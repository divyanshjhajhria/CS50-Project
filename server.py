from flask import Flask, request, jsonify, send_from_directory
import sqlite3

app = Flask(__name__, static_url_path='', static_folder='.')

def init_db():
    conn = sqlite3.connect('scores.db')
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS scores (high_score INTEGER)')
    c.execute('INSERT OR IGNORE INTO scores (high_score) VALUES (0)')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/update_score', methods=['POST'])
def update_score():
    data = request.get_json()
    score = data['score']
    conn = sqlite3.connect('scores.db')
    c = conn.cursor()
    c.execute('UPDATE scores SET high_score = ? WHERE high_score < ?', (score, score))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})

@app.route('/get_score', methods=['GET'])
def get_score():
    conn = sqlite3.connect('scores.db')
    c = conn.cursor()
    c.execute('SELECT high_score FROM scores')
    high_score = c.fetchone()[0]
    conn.close()
    return render_template('index.html', high_score=high_score)

@app.route('/game_over', methods=['GET'])
def game_over():
    score = request.args.get('score', type=int)
    if score > current_high_score:
        update_high_score(score)
    return redirect('/')

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=8080)