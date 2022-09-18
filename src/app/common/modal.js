export default class Modal {
  constructor() {
    this.modalOverlay = document.createElement("div");
    this.modalOverlay.className = "modal-overlay";
  }

  show(content) {
    this.toHTML(content);
    document.body.append(this.modalOverlay);
  }

  hide() {
    this.modalOverlay.remove();
  }

  toHTML(content) {
    this.modalOverlay.innerHTML = `
      <div class="modal-overlay__modal modal">
        <h2 class="modal__header">Note</h2>
        <form class="modal__form form">
          <input
            class="form__title"
            name="noteTitle"
            type="text"
            placeholder="Name your plan"
            value="${content?.title || ""}"
          />
          <input
            class="form__body"
            name="noteBody"
            type="text"
            placeholder="Describe your plan"
            value="${content?.body || ""}"
          />
          <select class="form__options">
            <option value="Task" ${
              content?.category === "Task" ? "selected" : ""
            }>Task</option>
            <option value="Random Thought" ${
              content?.category === "Random Thought" ? "selected" : ""
            }>Random Thought</option>
            <option value="Idea" ${
              content?.category === "Idea" ? "selected" : ""
            }>Idea</option>
          </select>
          <div class="form__actions">
            <button type="button" class="form__save">Save</button>
            <button type="button" class="form__cancel">Cancel</button>
          </div>
        </form>
      </div>
    `;
  }
}
