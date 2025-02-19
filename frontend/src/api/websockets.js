let socket;

export function startWebSocket(setImage) {
    socket = new WebSocket("http://localhost:8000/ws/start_bicep_curls");

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.event === "update_frame") {
            setImage(`data:image/jpeg;base64,${data.image}`);
        }
    };

    socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
    };
}

export function closeWebSocket() {
    if (socket) {
        socket.close();
    }
}