export default class DialogService {
  openDialog({
    dialogName,
    imageElement = null,
    titleContent = null,
    messageContent = null,
    autoCloseMs = 6500,
  }: {
    dialogName: string
    imageElement: string | null
    titleContent: string | null
    messageContent: string | null
    autoCloseMs?: number
  }) {
    const dialog: HTMLDialogElement | null = document.querySelector(`.${dialogName}`)
    const title: HTMLElement | null = document.querySelector(`.dialog-title`)
    const message: HTMLElement | null = document.querySelector(`.dialog-message`)
    const image: HTMLImageElement | null = document.querySelector(`.dialog-icon`)
    if (dialog) {
      if (image)
        if (typeof imageElement === 'string') {
          image.src = imageElement
        }
      if (message) message.textContent = messageContent
      if (title) title.textContent = titleContent

      const dialogCopy = `${titleContent ?? ''} ${imageElement ?? ''}`.toLowerCase()
      dialog.dataset.variant = /error|تعذر|فشل|لم يتم/.test(dialogCopy)
        ? 'error'
        : 'success'

      if (image) {
        image.alt = dialog.dataset.variant === 'error'
          ? 'تعذر إتمام العملية'
          : 'تمت العملية بنجاح'
      }

      if (dialog.open) dialog.close()
      dialog.showModal()
      dialog.dispatchEvent(new CustomEvent('base-dialog-opened', {
        detail: { autoCloseMs },
      }))
    }
  }

  closeDialog(dialogName: string) {
    const dialog: HTMLDialogElement | null = document.querySelector(`.${dialogName}`)
    if (dialog) dialog.close()
  }
}
