
class DataPacket {
    constructor(type, message, severity) {
        this.id = Math.random().toString(36).substring(2, 11); 
        this.timestamp = new Date().toLocaleTimeString();      
        this.type = type;          
        this.message = message;   
        this.severity = severity; 
    }
}

// Room 1 : Generator
class EventStream {
    constructor() {
        this.isRunning = false;
        this.intervalId = null;
        this.subscriber = [];
    }

    subscribe(callback) {
        this.subscriber.push(callback);
    }

    start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            const types = ["SYSTEM", "NETWORK", "AUTH", "DATABASE"];
            const messages = ["CPU threshold reached", "API payload delivered", "User handshake secured", "Query execution optimized"];
            const severities = ["info", "warning", "critical"];

            let randomType = types[Math.floor(Math.random() * types.length)];
            let randomMessage = messages[Math.floor(Math.random() * messages.length)];
            let randomSeverity = severities[Math.floor(Math.random() * severities.length)];

            const testPacket = new DataPacket(randomType, randomMessage, randomSeverity);
            
            this.subscriber.forEach(element => {
                element(testPacket);
            });
        }, 500);
    }

    stop() {
        clearInterval(this.intervalId);
        this.isRunning = false;
    }
}

// Room 2: Analytics Engine (Storage engine)
class AnalyticsEngine {
    constructor() {
        if (AnalyticsEngine.instance) {
            return AnalyticsEngine.instance;
        }
        AnalyticsEngine.instance = this;

        this.memory = []; 
        this.totalCount = 0;
        this.warningCount = 0;
        this.criticalCount = 0;
    }

    processPacket(packet) {
        this.totalCount++;
        if (packet.severity === "warning") {
            this.warningCount++;
        } else if (packet.severity === "critical") {
            this.criticalCount++;
        }
        this.memory.push(packet);
        if (this.memory.length > 100) {
            this.memory.shift();
        }
    }
}


// ROOM 3: THE DOM INTERACTION LAYER (UiRenderer)
class UiRenderer {
    constructor(stream, analytics) {
        this.stream = stream;
        this.analytics = analytics;
        this.stream.subscribe((packet) => this.render(packet));
    }

    searchInput(packet){
        const searchInput = document.querySelector("#search-input");
        if (!searchInput) return true; 

        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) return true; 
        
        const packetMessage = packet.message.toLowerCase();
        const packetType = packet.type.toLowerCase();

        return packetMessage.includes(searchTerm) || packetType.includes(searchTerm);
    }

    searchSeverity(packet){
        const severityFilter = document.querySelector("#severity-filter");
        if (!severityFilter) return true; 

        const filterValue = severityFilter.value;
        if (filterValue === "all") return true; 

        return packet.severity === filterValue;
    }

    pruneDomList() {
        const currentLogs = document.querySelectorAll("#log-stream-list li");
        if (currentLogs.length > 100) {
            currentLogs[currentLogs.length - 1].remove(); 
        }
    }

    render(packet) {
        document.querySelector("#metric-total").innerHTML = this.analytics.totalCount;
        document.querySelector("#metric-warning").innerHTML = this.analytics.warningCount;
        document.querySelector("#metric-critical").innerHTML = this.analytics.criticalCount;
        if (!this.searchInput(packet) || !this.searchSeverity(packet)) {
            return; 
        }
        let li = document.createElement("li");
        li.innerHTML = `<span>[${packet.timestamp}] [${packet.type}]</span> <span>${packet.message}</span>`;
        li.classList.add('log-' + packet.severity);
        document.querySelector("#log-stream-list").prepend(li);
        this.pruneDomList();
    }
}

// application initialization
const stream = new EventStream();
const analytics = new AnalyticsEngine();
stream.subscribe(analytics.processPacket.bind(analytics)); 
const ui = new UiRenderer(stream, analytics);
stream.start();



// interaction-control
const toggleBtn = document.querySelector("#stream-toggle-btn");
toggleBtn.addEventListener("click", () => {
    if (stream.isRunning) {
        stream.stop();
        toggleBtn.textContent = "Resume Stream";
        toggleBtn.style.background = "#1e7d41"; 
    } else {
        stream.start();
        toggleBtn.textContent = "Pause Stream";
        toggleBtn.style.background = "#164e2b"; 
    }
});