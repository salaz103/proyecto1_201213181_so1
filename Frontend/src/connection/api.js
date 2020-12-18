var socket = new WebSocket("ws://localhost:8081/prueba");
var socket_cpu= new WebSocket("ws://localhost:8081/cpu"); 
var socket_procesos= new WebSocket("ws://localhost:8081/procesos"); 


let connect = (cb) => {
    console.log("Attempting Connection...");

    socket.onopen = () => {
        console.log("Successfully Connected");
    };

    socket.onmessage = msg => {
        //console.log(msg);
        cb(msg);
    };

    socket.onclose = event => {
        console.log("Socket Closed Connection: ", event);
    };

    socket.onerror = error => {
        console.log("Socket Error: ", error);
    };
};

let connect_cpu = (cb) => {
    console.log("Attempting Connection for CPU...");

    socket_cpu.onopen = () => {
        console.log("Successfully Connected for CPU");
    };

    socket_cpu.onmessage = msg => {
        //console.log(msg);
        cb(msg);
    };

    socket_cpu.onclose = event => {
        console.log("Socket Closed Connection for CPU: ", event);
    };

    socket_cpu.onerror = error => {
        console.log("Socket Error in CPU: ", error);
    };
};

let connect_procesos = (cb) => {
    console.log("Attempting Connection for PROCESOS...");

    socket_procesos.onopen = () => {
        console.log("Successfully Connected for PROCESOS");
    };

    socket_procesos.onmessage = msg => {
        //console.log(msg);
        cb(msg);
    };

    socket_procesos.onclose = event => {
        console.log("Socket Closed Connection for PROCESOS: ", event);
    };

    socket_procesos.onerror = error => {
        console.log("Socket Error in PROCESOS: ", error);
    };
};


let sendMsg = msg => {
    console.log("sending msg: ", msg);
    socket_procesos.send(msg);
};

export { connect, sendMsg, connect_cpu,connect_procesos };