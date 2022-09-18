export default class NotesAPI {
  static notes = [
    {
      id: "882338",
      title: "Book",
      body: "Read the book.",
      category: "Random Thought",
      createdAt: 1663335828906,
      dates: "",
      isArchived: false,
    },
    {
      id: "882335",
      title: "Dentist",
      body: "I am gonna have a dentist appointment on the 3/5/2021, I moved it from 5/5/2021.",
      category: "Task",
      createdAt: 1663335828905,
      dates: "3/5/2021, 5/5/2021",
      isArchived: false,
    },
  ];

  static getNotes() {
    return NotesAPI.notes;
  }

  static saveNote(note) {
    const existNote = NotesAPI.notes.find((n) => n.id === note.id);

    if (existNote) {
      existNote.title = note.title;
      existNote.body = note.body;
      existNote.category = note.category;
      existNote.dates = note.dates;
    } else {
      NotesAPI.notes.unshift(note);
    }
  }

  static archiveNote(note) {
    const existNote = NotesAPI.notes.find((n) => n.id === note.id);

    if (existNote) {
      existNote.isArchived = note.isArchived;
    }
  }

  static deleteNote(id) {
    NotesAPI.notes = NotesAPI.notes.filter((note) => note.id !== id);
  }
}
