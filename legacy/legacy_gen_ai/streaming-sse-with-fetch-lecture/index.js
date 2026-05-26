// console.log('Sanity check!');
const form = document.querySelector('form');
const resultsContainer = document.querySelector('#results');
const messages = [
    {
        id: crypto.randomUUID(),
        role: 'system',
        content:
            'You are a software developer student that only speaks in rhymes', // This is the system message, it will control the behavior of the chatbot
    },
];

form.addEventListener('submit', async (e) => {
    try {
        e.preventDefault();

        const {
            prompt: { value: promptValue },
            stream: { checked: streamValue },
            submit,
        } = form.elements;

        if (!promptValue) return alert('Please enter a prompt');
        resultsContainer.innerHTML = '';
        // Disable the submit button
        submit.disabled = true;
        submit.classList.add(
            'bg-gray-500',
            'hover:bg-gray-500',
            'cursor-not-allowed'
        );
        stream.disabled = true;

        // console.log('form element values: ', promptValue, streamValue);

        const userMsg = {
            id: crypto.randomUUID(),
            role: 'user',
            content: promptValue, // This is the user message, it will be the prompt for the chatbot
        };
        messages.push(userMsg);
        console.log('messages in request: ', messages);

        const response = await fetch(
            'http://localhost:5050/api/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    mode: 'development', // Set the mode to development to not send the request to Open AI for now
                    provider: 'open-ai',
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    stream: streamValue,
                    messages,
                }),
            }
        );
        if (!response.ok) {
            // If the response is not ok, throw an error by parsing the JSON response
            const { error } = await response.json();
            throw new Error(error);
        }
        if (streamValue) {
            // console.log(response);
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let dataResult = '';
            const asstMsg = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: '',
            };
            const p = document.createElement('p');
            resultsContainer.appendChild(p);

            let isDone = false;

            while (!isDone) {
                const result = await reader.read();
                // console.log('result: ', result);

                if (result.done) {
                    isDone = true;
                    break;
                }
                const chunk = decoder.decode(result.value, { stream: true });
                // console.log('chunk: ', chunk);

                const lines = chunk.split('\n');
                // console.log('lines: ', lines);

                lines.forEach((line) => {
                    // Check if the line starts with data:, that's how Open AI sends the data
                    if (line.startsWith('data:')) {
                        // Get the JSON string without the data: prefix
                        const jsonStr = line.replace('data:', '');
                        const data = JSON.parse(jsonStr);
                        // console.log('data :', data);

                        const content = data.choices[0]?.delta?.content;
                        // console.log('content: ', content);
                        if (content) {
                            dataResult += content;
                            asstMsg.content += content;
                            const msgExists = messages.some(
                                (msg) => msg.id === asstMsg.id
                            );

                            if (!msgExists) {
                                messages.push(asstMsg);
                            }
                            // else {
                            //     messages.forEach((msg) => {
                            //         if (msg.id === asstMsg.id) msg = asstMsg;
                            //     });
                            // }

                            // p.innerHTML = dataResult;
                            console.log(dataResult);
                            const md = marked.parse(dataResult);
                            // Add the content to the paragraph element;
                            p.innerHTML = md;
                            Prism.highlightAll();
                        }
                    }
                });
                // console.log('streaming messages: ', messages);
            }
        } else {
            const data = await response.json();
            // Log the response to the console
            // console.log('data: ', data);
            const asstMsg = { ...data.message, id: crypto.randomUUID() };
            messages.push(asstMsg);
            // console.log('messages after response: ', messages);

            // resultsContainer.innerHTML = data.message?.content;
            resultsContainer.innerHTML = `<p>${marked.parse(
                data.message?.content
            )}</p>`;
            Prism.highlightAll();
        }
    } catch (error) {
        console.error(error);
    } finally {
        console.log('messages after response: ', messages);
        // Enable the submit button
        submit.disabled = false;
        submit.classList.remove(
            'bg-gray-500',
            'hover:bg-gray-500',
            'cursor-not-allowed'
        );
        stream.disabled = false;
    }
});
