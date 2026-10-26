# Distributed Group Communication Simulator

An interactive browser-based educational project that demonstrates **causal ordering** and **total ordering** among distributed processes.

## Features

- Simulates three processes: P1, P2 and P3.
- Displays vector clocks for each process.
- Sends messages and records causal delivery events.
- Broadcasts messages with a shared total-order sequence number.
- Includes one-click demos and a reset button.
- Responsive interface for desktop and mobile.
- Built using plain HTML, CSS and JavaScript—no dependencies or server required.

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a web browser.
3. Select a sender, enter a message, and choose an ordering method.
4. Try **Run causal demo** and **Run total-order demo** to see example sequences.

## Concepts demonstrated

### Causal ordering

Vector clocks track the causal history known to each process. If event B depends on event A, a correct causal multicast protocol must not deliver B before A. Concurrent, unrelated messages do not necessarily need a fixed relative order.

### Total ordering

All processes deliver broadcast messages in the same global sequence. This demo uses a **single simulated sequencer** to assign sequence numbers. It illustrates the ordering property, but does not implement fault-tolerant consensus, network delays, process crashes, or real multi-machine communication.

## Project structure

```text
distributed-group-communication-simulator/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Deploy with GitHub Pages

1. Create a GitHub repository named `distributed-group-communication-simulator`.
2. Upload `index.html`, `style.css`, `script.js` and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)`, then click **Save**.
6. Wait for the deployment and open the published Pages URL shown in Settings → Pages.

## Future improvements

- Add simulated network latency and message queues.
- Animate message movement between process nodes.
- Add a configurable number of processes.
- Implement Lamport logical clocks as a comparison.
- Add a real networking backend using WebSockets.
- Add a fault-tolerant total-order broadcast protocol using consensus.

## License

This project is provided for educational use. You may adapt it for coursework and learning.
