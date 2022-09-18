import NotesAPI from "./api/notesApi";
import NotesView from "./view/notesView";
import generateId from "./utils/generateId";

export default class App {
  constructor() {
    this.notes = [];
    this.isActiveTable = true;
    this.view = new NotesView(this.handlers());

    this.refreshNotes();
  }

  refreshNotes() {
    const notes = NotesAPI.getNotes();

    const activeNotes = [];
    const archivedNotes = [];
    const stats = {};

    // get statistics

    notes.forEach((note) => {
      if (!stats[note.category]) {
        stats[note.category] = {
          active: note.isArchived === false ? 1 : 0,
          archive: note.isArchived === false ? 0 : 1,
        };
      } else {
        stats[note.category].active += note.isArchived === false ? 1 : 0;
        stats[note.category].archive += note.isArchived === false ? 0 : 1;
      }
    });

    // divide notes into active and archived

    notes.forEach((note) => {
      if (note.isArchived === true) {
        archivedNotes.push(note);
      } else {
        activeNotes.push(note);
      }
    });

    if (this.isActiveTable) {
      this.setNotes(activeNotes, stats);
    } else {
      this.setNotes(archivedNotes, stats);
    }
  }

  setNotes(notes, stats) {
    this.notes = notes;

    // send notes to display

    this.view.updateNotes(notes, stats);
  }

  handlers() {
    return {
      onNoteSelect: (id) => {
        const selectedNote = this.notes.find((note) => note.id === id);
        this.view.setActiveNote(selectedNote);

        this.refreshNotes();
      },

      onNoteAdd: (title, body, category, dates) => {
        const newNote = {
          id: generateId(),
          title,
          body,
          category,
          createdAt: Date.now(),
          dates,
          isArchived: false,
        };

        NotesAPI.saveNote(newNote);
        this.refreshNotes();
      },

      onNoteEdit: (note) => {
        NotesAPI.saveNote(note);

        this.refreshNotes();
      },

      onNoteDelete: (id) => {
        NotesAPI.deleteNote(id);

        this.refreshNotes();
      },

      onChangeTableView: (status) => {
        this.isActiveTable = status;

        this.refreshNotes();
      },
    };
  }
}
