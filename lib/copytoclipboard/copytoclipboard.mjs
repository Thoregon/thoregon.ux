/*
 * Copyright (c) 2024.
 */

import FlashMessage  from "/thoregon.ux/lib/flashmessage/flashmessage.mjs";

export default class CopyToClipboard {
    constructor(settings = {}) {
        this.settings = Object.assign(
            {
                message : 'In die Zwischenablage kopiert!',
                type    : 'info',   // info | error | warning
                duration: 3000,
                position: 'top',    // top | bottom
                margin:   '300px'
            },
            settings
        )
    }

    copy(textToCopy) {

        let copyToClipboardElement = document.getElementById("copyToClipboard");
        if (!copyToClipboardElement) {
            copyToClipboardElement = document.createElement("textarea");
            copyToClipboardElement.id = "copyToClipboard";
            document.body.appendChild(copyToClipboardElement);

            copyToClipboardElement.style.position = "absolute";
            copyToClipboardElement.style.left = "-9999px";
        }

        // Set the value of the copyToClipboard element to the text to copy
        copyToClipboardElement.value = textToCopy;
        // Select the text inside the copyToClipboard element
        copyToClipboardElement.select();
        // Execute the copy command
        document.execCommand("copy");

        const message = new FlashMessage( { message: this.settings.message } );
        message.show();
    }
}