/*
 * Copyright (c) 2024.
 */

/*
 * @author: Martin Neitz
 */

export default class FlashMessage {
    constructor(settings = {}) {
        this.settings = Object.assign(
            {
                message: '',
                type:    'info',   // info | error | warning
                duration: 3000,
                position: 'top',   // top | bottom
            },
            settings
        )
        this.init()
    }

    init() {

        this.blueprint = universe.uirouter.getBlueprint();
        this.messageId = ( Math.round( Date.now() ) ).toString(36);

        this.flashmessage    = document.createElement('div');
        this.flashmessage.id = this.messageId;
        this.flashmessage.classList.add('flashmessage');
        this.flashmessage.classList.add(this.settings.type);

        const style =`
            <style>
                #${this.messageId} {
                    position: fixed;
                    bottom: -100px;
                    width: fit-content;
                    background-color: #8FBC8FFF;
                    color: #fff;
                    border-radius: 5px;
                    margin: auto;
                    text-align: center;
                    z-index: 10000;
                    right: 0;
                    left: 0;
                    font-size: 17px;
                    white-space: nowrap;
                }
                #${this.messageId} div {
                    padding: .7em 2em;
                }
                
                #${this.messageId}.show {
                    bottom: 100px;
                }
                
            </style>
        `;

        const message = `${style}
                         <div>${this.settings.message}</div>`;

        this.flashmessage.innerHTML = message;
        this.blueprint.container.appendChild(this.flashmessage);
    }

    show() {
        const element = this.blueprint = universe.uirouter.getBlueprint().container.querySelector("#" + this.messageId);
        element.classList.add("show");

        setTimeout(function() {
            // Remove the class from the element
            element.classList.remove("show");
            element.remove();
        }, this.settings.duration); // 4000 milliseconds = 4 seconds
    }
}