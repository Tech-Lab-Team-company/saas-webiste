import DialogService from '~/base/persention/Dialogs/dialog_service'


export default class ShowErrorDialog extends DialogService {

    private static _instance: ShowErrorDialog
    constructor() {
        super()
    }

    static get Instance() {
        if (!this._instance) {
            this._instance = new ShowErrorDialog()
        }
        return this._instance
    }
}