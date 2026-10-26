/* Distributed Group Communication Simulator
   Educational model: three processes, vector clocks, causal delivery,
   and coordinator-assigned total-order sequence numbers. */
(() => {
  "use strict";
  const N = 3;
  let clocks, causalLogs, causalEvents, totalLog, messages, nextId, totalSequence;

  const $ = (id) => document.getElementById(id);
  const processName = (i) => `P${i + 1}`;
  const cleanText = (text) => String(text).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  function resetState() {
    clocks = Array.from({ length: N }, () => [0, 0, 0]);
    causalLogs = Array.from({ length: N }, () => []);
    causalEvents = [];
    totalLog = [];
    messages = [];
    nextId = 1;
    totalSequence = 1;
    render();
  }

  function createMessage(sender, text, mode) {
    const msg = { id: nextId++, sender, text: text.trim() || "(empty message)", mode, vector: null, totalSeq: null };
    messages.push(msg);
    return msg;
  }

  // Vector-clock send event: increment the sender's own component.
  function sendCausal(sender, text) {
    clocks[sender][sender] += 1;
    const msg = createMessage(sender, text, "causal");
    msg.vector = [...clocks[sender]];
    causalEvents.unshift({
      title: `${processName(sender)} sent M${msg.id}`,
      detail: `Vector timestamp: [${msg.vector.join(", ")}]`
    });

    // Deliver to every other process. The delivery check below enforces
    // the standard vector-clock causal readiness condition.
    for (let receiver = 0; receiver < N; receiver++) {
      if (receiver === sender) {
        causalLogs[receiver].push({ id: msg.id, sender, text: msg.text, vector: msg.vector, note: "Local send" });
      } else {
        receiveCausal(receiver, msg);
      }
    }
    render();
  }

  function receiveCausal(receiver, msg) {
    const sender = msg.sender;
    const expected = clocks[receiver][sender] + 1;
    const otherComponentsReady = msg.vector.every((value, index) =>
      index === sender || value <= clocks[receiver][index]
    );

    if (msg.vector[sender] === expected && otherComponentsReady) {
      clocks[receiver] = clocks[receiver].map((value, index) => Math.max(value, msg.vector[index]));
      causalLogs[receiver].push({ id: msg.id, sender, text: msg.text, vector: msg.vector, note: "Delivered in causal order" });
      causalEvents.unshift({
        title: `${processName(receiver)} delivered M${msg.id}`,
        detail: `From ${processName(sender)} · timestamp [${msg.vector.join(", ")}]`
      });
    } else {
      // This model delivers messages synchronously in send order, so this
      // branch is a safety net for future asynchronous extensions.
      causalEvents.unshift({
        title: `${processName(receiver)} queued M${msg.id}`,
        detail: "Waiting for causal predecessors before delivery."
      });
    }
  }

  // Total order uses one simulated sequencer to assign a common sequence.
  function broadcastTotal(sender, text) {
    const msg = createMessage(sender, text, "total");
    msg.totalSeq = totalSequence++;
    totalLog.push(msg);
    render();
  }

  function runCausalDemo() {
    resetState();
    sendCausal(0, "A: P1 announces an update");
    // P2 receives A before sending B; B's vector clock carries A's dependency.
    sendCausal(1, "B: P2 responds after A");
    sendCausal(2, "C: P3 sends an independent update");
  }

  function runTotalDemo() {
    resetState();
    broadcastTotal(0, "Update: temperature = 24");
    broadcastTotal(2, "Update: temperature = 25");
    broadcastTotal(1, "Update: temperature = 26");
  }

  function render() {
    for (let i = 0; i < N; i++) {
      $(`clock${i}`).textContent = `[${clocks[i].join(", ")}]`;
      const list = $(`causalLog${i}`);
      list.innerHTML = causalLogs[i].length
        ? causalLogs[i].map(item => `<li><strong>M${item.id}</strong> · ${cleanText(processName(item.sender))}: ${cleanText(item.text)}<br><code>[${item.vector.join(", ")}]</code><small>${cleanText(item.note)}</small></li>`).join("")
        : '<li class="empty">No messages delivered yet.</li>';
    }

    $("causalEvents").innerHTML = causalEvents.length
      ? causalEvents.slice(0, 14).map(event => `<div class="event"><strong>${cleanText(event.title)}</strong><small>${cleanText(event.detail)}</small></div>`).join("")
      : '<p class="empty-block">Causal events will appear here.</p>';

    $("totalLog").innerHTML = totalLog.length
      ? totalLog.map(msg => `<li><strong>#${msg.totalSeq}</strong> · ${cleanText(processName(msg.sender))}: ${cleanText(msg.text)}<br><small>Delivered in this same sequence at P1, P2 and P3.</small></li>`).join("")
      : '<li class="empty">No total-order broadcasts yet.</li>';

    $("messageCount").textContent = messages.length;
    $("causalCount").textContent = causalLogs.reduce((sum, log) => sum + log.length, 0);
    $("totalCount").textContent = totalLog.length * N;
  }

  $("sendCausal").addEventListener("click", () => {
    const sender = Number($("sender").value);
    sendCausal(sender, $("messageText").value);
  });
  $("sendTotal").addEventListener("click", () => {
    const sender = Number($("sender").value);
    broadcastTotal(sender, $("messageText").value);
  });
  $("demoCausal").addEventListener("click", runCausalDemo);
  $("demoTotal").addEventListener("click", runTotalDemo);
  $("reset").addEventListener("click", resetState);

  resetState();
})();
