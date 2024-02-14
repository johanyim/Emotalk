export function getRandomIndex<T>(array: T[]): number {
  if (array.length === 0) {
    throw new Error('Array is empty');
  }
  return Math.floor(Math.random() * array.length);
}

const random_names = [
  "Jasmine", "Xavier", "Emily", "Blake", "Mia", "Ethan", "Sophia", "Jackson", "Olivia", "Liam",
  "Ava", "Noah", "Isabella", "Lucas", "Harper", "Aiden", "Emma", "Elijah", "Charlotte", "Mason",
  "Amelia", "Logan", "Evelyn", "Carter", "Abigail", "Benjamin", "Grace", "Alexander", "Riley",
  "Scarlett", "James", "Lily", "Jacob", "Zoe", "Michael", "Avery", "William", "Evelyn", "Henry",
  "Mia", "Samuel", "Chloe", "Ethan", "Madison", "Elijah", "Addison", "Alexander", "Eleanor",
  "Daniel", "Victoria", "David", "Aria", "Joseph", "Penelope", "Matthew", "Harper", "Gabriel",
  "Layla", "Christopher", "Aubrey", "Joshua", "Natalie", "Oliver", "Brooklyn", "Sebastian", "Hannah",
  "Andrew", "Savannah", "Dylan", "Stella", "Nathan", "Zoey", "Jonathan", "Paisley", "Isaac", "Leah",
  "Owen", "Audrey", "Julian", "Grace", "Lincoln", "Sofia", "Isaac", "Ruby", "Zachary", "Eleanor",
  "Levi", "Claire", "Aaron", "Jasmine", "Jack", "Bella", "Evan", "Lucy", "Grayson"
]

export function getRandomName() {
  return random_names[getRandomIndex(random_names)]
}