export default class DialogService {
  openDialog({
    dialogName,
    imageElement = null,
    titleContent = null,
    messageContent = null,
    autoCloseMs = 6500,
    action = null,
  }: {
    dialogName: string
    imageElement: string | null
    titleContent: string | null
    messageContent: string | null
    autoCloseMs?: number
    action?: {
      label: string
      callback: () => void | Promise<void>
    } | null
  }) {
    const dialog: HTMLDialogElement | null =
      document.querySelector(`.${dialogName}`)

    if (!dialog) return

    const title =
      dialog.querySelector<HTMLElement>('.dialog-title')

    const message =
      dialog.querySelector<HTMLElement>('.dialog-message')

    const image =
      dialog.querySelector<HTMLImageElement>('.dialog-icon')

    const visual =
      dialog.querySelector<HTMLElement>('.dialog-visual')

    const errorActionButton =
      dialog.querySelector<HTMLButtonElement>(
        '.dialog-error-action',
      )

    const hasImage =
      typeof imageElement === 'string' &&
      imageElement.trim().length > 0

    if (image && hasImage) {
      image.src = imageElement
    }

    if (image && !hasImage) {
      image.removeAttribute('src')
    }

    if (visual) {
      visual.hidden = !hasImage
    }

    if (message) {
      message.textContent = messageContent ?? ''
    }

    if (title) {
      title.textContent = titleContent ?? ''
    }

    const dialogCopy =
      `${titleContent ?? ''} ${imageElement ?? ''}`.toLowerCase()

    dialog.dataset.variant =
      /error|تعذر|فشل|لم يتم/.test(dialogCopy)
        ? 'error'
        : 'success'

    if (image) {
      image.alt =
        dialog.dataset.variant === 'error'
          ? 'تعذر إتمام العملية'
          : 'تمت العملية بنجاح'
    }

    if (errorActionButton) {
      if (action) {
        errorActionButton.textContent = action.label
        errorActionButton.hidden = false

        errorActionButton.onclick = async () => {
          await action.callback()
        }
      } else {
        errorActionButton.hidden = true
        errorActionButton.onclick = null
      }
    }

    if (dialog.open) {
      dialog.close()
    }

    dialog.showModal()

    dialog.dispatchEvent(
      new CustomEvent('base-dialog-opened', {
        detail: {
          autoCloseMs,
        },
      }),
    )
  }

  closeDialog(dialogName: string) {
    const dialog =
      document.querySelector<HTMLDialogElement>(
        `.${dialogName}`,
      )

    if (dialog) {
      dialog.close()
    }
  }
}