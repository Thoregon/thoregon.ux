/*
 * Copyright (c) 2022.
 */

/*
 *
 * @author: Martin Neitz
 */
/**
 * Dialog module.
 * @module dialog.js
 * @version 1.0.0
 * @summary 02-01-2022
 * @author Mads Stoumann
 * @description Custom versions of `alert`, `confirm` and `prompt`, using `<dialog>`
 *
 * https://codepen.io/stoumann/pen/bGovmLa
 */

import AuroraButton from "/thoregon.aurora/lib/formcomponents/aurorabutton.mjs"

export default class Dialog {
    constructor(settings = {}) {
        this.settings = Object.assign(
            {
                accept: 'OK',
                bodyClass: 'dialog-open',
                cancel: 'Cancel',
                dialogClass: 'aurora-dialog',
                message: '',
                information: '',
                soundAccept: '',
                soundOpen: '',
                template: ''
            },
            settings
        )
        this.init()
    }

    setInformation(information) {
        this.settings.information = information;
    }

    collectFormData(formData) {
        const object = {};
        formData.forEach((value, key) => {
            if (!Reflect.has(object, key)) {
                object[key] = value
                return
            }
            if (!Array.isArray(object[key])) {
                object[key] = [object[key]]
            }
            object[key].push(value)
        })
        return object
    }

    getFocusable() {
        return [...this.dialog.querySelectorAll('aurora-button, button,[href],select,textarea,input:not([type="hidden"]),[tabindex]:not([tabindex="-1"])')];
    }

    init() {

        this.blueprint = universe.uirouter.getBlueprint();
  //      this.blueprint = document.body

        this.dialogID = ( Math.round( Date.now() ) ).toString(36);
        this.dialogSupported = typeof HTMLDialogElement === 'function'
        this.dialog = document.createElement('dialog')
        this.dialog.role = 'dialog'
        this.dialog.dataset.component = this.dialogSupported ? 'dialog' : 'no-dialog';
        this.dialog.innerHTML = `
    <div class="elevation level2"></div>
    <form method="dialog" data-ref="form">
      <fieldset data-ref="fieldset" role="document">
        <legend data-ref="message" id="${ this.dialogID }"></legend>
        <span class="information" data-ref="information"></span>
        <div data-ref="template"></div>
      </fieldset>
      <menu>

        <aurora-button mode="text" label="Cancel" data-ref="cancel" value="cancel" ></aurora-button>
        <aurora-button mode="text" label="OK"     data-ref="accept" value="default" autofocus></aurora-button>

<!--
        <button${this.dialogSupported ? '' : ` type="button"`} data-ref="cancel" value="cancel"></button>
        <button${this.dialogSupported ? '' : ` type="button"`} data-ref="accept" value="default"></button>
-->
      </menu>
      <audio data-ref="soundAccept"></audio>
      <audio data-ref="soundOpen"></audio>
    </form>`
        this.blueprint.container.appendChild(this.dialog)
        this.elements = {}
        this.focusable = []
        this.dialog.querySelectorAll('[data-ref]').forEach(el => this.elements[el.dataset.ref] = el)
        this.dialog.setAttribute('aria-labelledby', this.elements.message.id)
        this.dialog.setAttribute( 'id', 'dialog-' + this.dialogID )

        this.elements.cancel.addEventListener('click', () => { this.dialog.dispatchEvent(new Event('cancel')) })
        this.dialog.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                if (!this.dialogSupported) e.preventDefault()
                this.elements.accept.dispatchEvent(new Event('click'))
            }
            if (e.key === 'Escape') this.dialog.dispatchEvent(new Event('cancel'))
            if (e.key === 'Tab') {
                e.preventDefault()
                const len =  this.focusable.length - 1;
                let index = this.focusable.indexOf(e.target);
                index = e.shiftKey ? index - 1 : index + 1;
                if (index < 0) index = len;
                if (index > len) index = 0;
                this.focusable[index].focus();
            }
        })
        this.dialog.classList.add("aurora-dialog");
        this.toggle();
    }

    open(settings = {}) {
        const dialog = Object.assign({}, this.settings, settings)
        this.dialog.className = dialog.dialogClass || ''
        this.elements.accept.setAttribute('label', dialog.accept);
        this.elements.cancel.setAttribute('label', dialog.cancel);
        this.elements.cancel.hidden = dialog.cancel === ''
        this.elements.message.innerText = dialog.message
        this.elements.information.innerText = dialog.information
        this.elements.soundAccept.src = dialog.soundAccept || ''
        this.elements.soundOpen.src = dialog.soundOpen || ''
        this.elements.target = dialog.target || ''
        this.elements.template.innerHTML = dialog.template || ''

        this.focusable = this.getFocusable()
        this.hasFormData = this.elements.fieldset.elements.length > 0

        if (dialog.soundOpen) {
            this.elements.soundOpen.play()
        }

        this.toggle(true)
        if (this.hasFormData) {
            this.focusable[0].focus()
            this.focusable[0].select()
        }
        else {
            this.elements.accept.focus()
        }
    }

    toggle(open = false) {
        if (this.dialogSupported && open) this.dialog.showModal()
        if (!this.dialogSupported) {
            document.body.classList.toggle(this.settings.bodyClass, open)
            this.dialog.hidden = !open
            if (this.elements.target && !open) {
                this.elements.target.focus()
            }
        }
    }

    destroy() {
        let dialog = this.blueprint.container.querySelector('#dialog-' + this.dialogID );
        dialog.remove();
        delete this;
    }


    waitForUser() {
        return new Promise(resolve => {
            this.dialog.addEventListener('cancel', () => {
                this.toggle()
                resolve(false)
            }, { once: true })
            this.elements.accept.addEventListener('click', () => {
                let value = this.hasFormData ? this.collectFormData(new FormData(this.elements.form)) : true;
                if (this.elements.soundAccept.getAttribute('src').length > 0) this.elements.soundAccept.play()
                this.toggle()
                resolve(value)
            }, { once: true })
        })
    }

    alert(message, config = { target: event.target }) {
        const settings = Object.assign({}, config, { cancel: '', message, template: '' })
        this.open(settings)
        return this.waitForUser()
    }

    confirm(message, config = { target: event.target }) {
        const settings = Object.assign({}, config, { message, template: '' })
        this.open(settings)
        return this.waitForUser()
    }

    prompt(message, value, config = { target: event.target }) {
        const template = `<label aria-label="${message}"><input style="width: 100%; padding: 0.5em 1em; font-size: 1.2em; margin-bottom: .5em; border-radius: 4px;  border: 1px solid var(--md-sys-color-outline); outline: 1px solid var(--md-sys-color-primary);" type="text" name="prompt" value="${value}"></label>`
        const settings = Object.assign({}, config, { message, template })
        this.open(settings)
        return this.waitForUser()
    }

}
