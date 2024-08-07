from pygame import mixer
from flask import Flask, request, jsonify
from flask_cors import CORS
import pyttsx3
import threading

app = Flask(__name__)
CORS(app)
engine = pyttsx3.init()
mixer.init()
outfile = "temp.mp3"

def text_to_speech(text , callback):
    def on_end(name, completed):
        callback()  # Notify when the speech is finished

    newVoiceRate = 145
    engine.setProperty('rate',newVoiceRate)
    engine.setProperty('voice', engine.getProperty('voices')[0])
    engine.connect('finished-utterance', on_end)
    
    engine.save_to_file(text, outfile)
    engine.runAndWait()
    
@app.route('/play', methods=['POST'])
def play_text():
    content = request.json
    text = content.get("text", "")

    if text == "":
        return jsonify({"error": "No text to read"})
    
    conversion_complete = threading.Event()
    def conversion_callback():
        conversion_complete.set()
    threading.Thread(target=text_to_speech, args=(text, conversion_callback)).start()
    conversion_complete.wait()
    
    mixer.music.load(outfile)
    mixer.music.play()
    return jsonify({"status": "success"})
    

@app.route('/music/stop',methods=['POST'])
def stop():
    mixer.music.stop()
    # print("stop => ",mixer.music.get_busy())
    return jsonify({"status": "success"})
    
@app.route('/music/pause',methods=['POST'])
def pause():
    mixer.music.pause()
    # print("pause => ",mixer.music.get_busy())
    return jsonify({"status": "success"})
    
@app.route('/music/resume',methods=['POST'])    
def unpause():
    mixer.music.unpause()        
    return jsonify({"status": "success"})
    
@app.route('/music/play',methods=['POST'])
def reset():
    mixer.music.play()
    return jsonify({"status": "success"})
    
if __name__ == '__main__':
    app.run(debug=True)
