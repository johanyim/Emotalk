import cv2
from deepface import DeepFace

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def analyze_face(frame):

    # conver to greyscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # detect faces bounding box in the frame
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # if no faces are detected
    if len(faces) == 0:
        return 'no face detected'

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

    return dominant_emotion
    
    


def main():
    cap = cv2.VideoCapture(0)
    while True: 
        ret, frame = cap.read()
        analyze_face(frame)

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
