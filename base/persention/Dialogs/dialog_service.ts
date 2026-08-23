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
    const title: HTMLElement | null = dialog?.querySelector(`.dialog-title`) ?? null
    const message: HTMLElement | null = dialog?.querySelector(`.dialog-message`) ?? null
    const image: HTMLImageElement | null = dialog?.querySelector(`.dialog-icon`) ?? null
    const visual: HTMLElement | null = dialog?.querySelector(`.dialog-visual`) ?? null
    if (dialog) {
      const hasImage = typeof imageElement === 'string' && imageElement.trim().length > 0
      if (image && hasImage) image.src = imageElement
      if (image && !hasImage) image.removeAttribute('src')
      if (visual) visual.hidden = !hasImage
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
