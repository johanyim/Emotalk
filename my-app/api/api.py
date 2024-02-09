from flask import Flask
app = Flask(__name__)

import cv2
from deepface import DeepFace

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

@app.route('/api/emotion')
def analyze_face(frame):

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
    print(dominant_emotion)

    return{'emotion': dominant_emotion}


def main():
    app.run()

if __name__ == "__main__":
    main()
