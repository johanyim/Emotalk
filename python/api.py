from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

import cv2
from deepface import DeepFace


# @app.route('/api/emotion')
@app.route('/read_emotion', methods=['POST'])
def read_emotion():

    # Read the image using OpenCV
    image_file = request.files['selectedImage']
    # decoding to cv2-compliant format
    frame = cv2.imdecode(image_file.read(), cv2.IMREAD_COLOR)

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # conver to greyscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # detect faces bounding box in the frame
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Extract the face region
    (x, y, w, h) = faces[0]
    face = frame[y:y + h, x:x + w]

    # Analyze facial features using DeepFace
    result = DeepFace.analyze(face, actions=['emotion'], enforce_detection=False)

    # Get the emotion prediction
    emotion = result[0].get('emotion')

    dominant_emotion = max(emotion, key=emotion.get)

    # print(emotion)
    # print(dominant_emotion)

    # return{'emotion': dominant_emotion}
    return jsonify({'emotion': dominant_emotion})

@app.route('/test', methods=['GET'])
def test():
    image_file = request.files['selectedImage']
    return  jsonify({'emotion': 'test'})

def main():
    app.run()

if __name__ == "__main__":
    main()
