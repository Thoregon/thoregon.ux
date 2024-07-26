/*
 * Copyright (c) 2024.
 */

/*
 *
 * @author: Martin Neitz
 */

export default class DownloadService {

    download(csvContent, filename) {
        // Create a Blob with the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element
        const link = document.createElement("a");

        // Set the href and download attributes
        link.href = url;
        link.setAttribute("download", filename);

        // Append the anchor to the body (required for Firefox)
        document.body.appendChild(link);

        // Programmatically click the anchor to trigger the download
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}
 