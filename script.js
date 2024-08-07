function set_success(msg) {
    const scsMessage = document.getElementById('successMessage');
    scsMessage.textContent = msg;
    return
}


document.addEventListener('DOMContentLoaded', function () {
    const submissionForm = document.getElementById('submissionForm')
    // const playButton = document.getElementById('playButton');
    const pauseButton = document.getElementById('pauseButton');
    // const stopButton = document.getElementById('stopButton');
    const resetButton = document.getElementById('resetButton');
    const resumeButton = document.getElementById('resumeButton');

    submissionForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const text = document.getElementById('textInput').value.trim();
        const file = document.getElementById('fileInput').files[0];
        const errorMessage = document.getElementById('errorMessage');


        // Reset the error message
        errorMessage.textContent = '';


        if (!text && !file) {
            errorMessage.textContent = 'Please provide either text or a document.';
            return;
        }

        // Displaying the text and file name for demonstration purposes
        if (text && file) {
            errorMessage.textContent = "only enter a single text input ";

            return;
        }
        else if (text) {
            // console.log('Text:', text);
            let msg = "text is being processed"
            set_success(msg)
            sendDataToServer(text)
            set_success("")
            // msg = "text is being processed"
        }
        else if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const fileContent = e.target.result;
                let msg = "text is being processed"
                set_success(msg)
                // console.log('File content:', fileContent);
                sendDataToServer(fileContent)
                set_success("")
                // Add your logic to handle the file content here
            };
            reader.onerror = function (e) {
                errorMessage.textContent = 'Error reading file';
            };
            reader.readAsText(file);
            // console.log('File:', file.name);

        }

        async function sendDataToServer(content) {
            let data = await fetch('http://127.0.0.1:5000/play', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: content })
            });
        }
        // Add your form submission logic here
    });

    resetButton.addEventListener('click', function () {
        fetch('http://127.0.0.1:5000/music/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    });

    pauseButton.addEventListener('click', function () {
        fetch('http://127.0.0.1:5000/music/pause', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    });

    resumeButton.addEventListener('click', function () {
        fetch('http://127.0.0.1:5000/music/resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    });
});
