export default class ShowLoader {
  private static instance: ShowLoader
  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowLoader()
    }
    return this.instance
  }

  private dialog: HTMLDialogElement | null = document.querySelector('.loader-dialog')
  public showLoader() {
    this.dialog?.showModal()
  }

  public hideLoader() {
    this.dialog?.close()
  }
}
