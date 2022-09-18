import Modal from "../common/modal";
import { getDate, getDateFromText } from "../utils/getDate";

import pencilImg from "../assets/pencil.svg";
import archiveImg from "../assets/archive.svg";
import unarchiveImg from "../assets/unarchive.svg";
import trashImg from "../assets/trash.svg";

export default class NotesView {
  constructor({
    onNoteSelect,
    onNoteAdd,
    onNoteEdit,
    onNoteDelete,
    onChangeTableView,
  }) {
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;
    this.onChangeTableView = onChangeTableView;

    this.activeNote = null;
    this.isActiveTable = true;
    this.errors = false;
    this.modal = new Modal();

    document.addEventListener("click", this.action.bind(this));
  }

  setActiveNote(note) {
    this.activeNote = note;
  }

  action(event) {
    const { target } = event;

    // get active note

    const activeNoteHTML = target.closest(".list-table__item");

    if (activeNoteHTML) {
      const activeNoteId = activeNoteHTML.dataset.noteId;
      this.onNoteSelect(activeNoteId);
    }

    // open modal for new note

    if (target.closest(".notes__add")) {
      this.modal.show();
    }

    // open modal for edit note

    if (target.closest(".list-table__edit")) {
      this.modal.show(this.activeNote);
    }

    // delete note

    if (target.closest(".list-table__delete")) {
      this.onNoteDelete(this.activeNote.id);
      this.activeNote = null;
    }

    // archive note

    if (target.closest(".list-table__archive")) {
      if (this.isActiveTable) {
        this.onNoteEdit({
          ...this.activeNote,
          isArchived: true,
        });
      } else {
        this.onNoteEdit({
          ...this.activeNote,
          isArchived: false,
        });
      }

      this.activeNote = null;
    }

    // show archive/active instead of active/archive notes

    if (target.closest(".notes__archive")) {
      this.isActiveTable = !this.isActiveTable;

      this.onChangeTableView(this.isActiveTable);

      const archiveBtn = document.querySelector(".notes__archive");
      archiveBtn.textContent = `${this.isActiveTable ? "Archive" : "Active"}`;
    }

    // add or edit note

    if (target.closest(".form__save")) {
      const inputTitle = document.querySelector(".form__title");
      const inputBody = document.querySelector(".form__body");
      const selectedCategory = document.querySelector(".form__options");

      const titleValue = inputTitle.value.trim();
      const bodyValue = inputBody.value.trim();
      const categoryValue = selectedCategory.value.trim();

      const datesArr = getDateFromText(bodyValue) || [];
      const dates = datesArr.join(", ");

      // basic validation

      if (titleValue === "" || bodyValue === "") {
        this.errors = true;
        const error = this.createErrorHTML("All fields are required");
        inputTitle.insertAdjacentElement("beforebegin", error);
      } else {
        this.errors = false;
      }

      // saving changes

      if (!this.errors) {
        if (this.activeNote) {
          this.onNoteEdit({
            id: this.activeNote.id,
            title: titleValue,
            body: bodyValue,
            category: categoryValue,
            dates,
            isArchived: this.activeNote.isArchived,
          });
        } else {
          this.onNoteAdd(titleValue, bodyValue, categoryValue, dates);
        }

        this.modal.hide();
        this.activeNote = null;
      }
    }

    // hide modal

    if (target.closest(".form__cancel")) {
      this.modal.hide();
    }
  }

  updateNotes(notes, stats) {
    // send data to display notes

    const notesList = document.querySelector(".list-table__body");
    notesList.innerHTML = "";

    notes.forEach((note) => {
      const noteItemHTML = this.createNotesHTML(note);
      notesList.append(noteItemHTML);
    });

    // send data to display statistics

    const totalList = document.querySelector(".total-table__body");
    totalList.innerHTML = "";

    Object.keys(stats).forEach((item) => {
      const totalItemHTML = this.createCategoryHTML(
        item,
        stats[item].active,
        stats[item].archive
      );
      totalList.append(totalItemHTML);
    });
  }

  // display methods

  createNotesHTML(note) {
    const { id, title, body, category, createdAt, dates } = note;

    const tableBodyRow = document.createElement("tr");
    tableBodyRow.className = "list-table__item";
    tableBodyRow.dataset.noteId = id;
    tableBodyRow.innerHTML = `
      <td>${title}</td>
      <td class="list-table__content">${body}</td>
      <td>${category}</td>
      <td>${getDate(createdAt, "full")}</td>
      <td>${dates}</td>
      <td class="list-table__actions">
        <div>
          ${
            this.isActiveTable
              ? `<button type="button" class="list-table__edit"><img src=${pencilImg} alt="Pencil" /></button>`
              : ""
          }
          <button type="button" class="list-table__archive">${
            this.isActiveTable
              ? `<img src=${archiveImg} alt="Archive" />`
              : `<img src=${unarchiveImg} alt="Unarchive" />`
          }</button>
          <button type="button" class="list-table__delete"><img src=${trashImg} alt="Trash" /></button>
        </div>
      </td>
    `;

    return tableBodyRow;
  }

  createCategoryHTML(category, active, archive) {
    const tableBodyRow = document.createElement("tr");
    tableBodyRow.className = "total-table__item";
    tableBodyRow.innerHTML = `
      <td>${category}</td>
      <td>${active}</td>
      <td>${archive}</td>
    `;

    return tableBodyRow;
  }

  createErrorHTML(message) {
    const isErrorBlock = document.querySelector(".form__error");

    if (isErrorBlock) {
      isErrorBlock.remove();
    }

    const errorBlock = document.createElement("span");
    errorBlock.className = "form__error";
    errorBlock.textContent = `${message}`;

    return errorBlock;
  }
}
