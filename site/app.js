(function () {
  "use strict";

  const config = window.JRBUG_CONFIG || {};
  const states = {
    offline: {
      label: "Off air",
      mode: "Standby",
      action: "Stand by for signal",
      message: "The room is quiet. The next signal will appear here."
    },
    programmed: {
      label: "On air",
      mode: "Programmed set",
      action: "Listen to the show",
      message: "A programmed transmission is moving through the queue."
    },
    live: {
      label: "Live now",
      mode: "Live mix",
      action: "Enter the live room",
      message: "The decks are live from the home studio."
    }
  };

  const status = Object.prototype.hasOwnProperty.call(states, config.status)
    ? config.status
    : "offline";
  const state = states[status];

  document.body.dataset.status = status;
  document.querySelectorAll("[data-status]").forEach((element) => {
    element.dataset.status = status;
  });
  setText("[data-status-label]", state.label);
  setText("[data-mode-label]", state.mode);
  setText("[data-listen-label]", state.action);
  setText("[data-status-message]", state.message);
  setText("[data-show-title]", config.showTitle || "Jr.Bug Radio");
  setText("[data-show-subtitle]", config.showSubtitle || "Awaiting the next broadcast");
  setText("[data-next-show]", config.nextShow || "Schedule coming soon.");
  setText("[data-next-show-note]", config.nextShowNote || "Broadcast details will be posted here.");
  setText("[data-year]", new Date().getFullYear());

  const audioPlayer = document.querySelector("[data-audio-player]");
  const listenAction = document.querySelector("[data-listen-action]");
  if (audioPlayer && config.audioStreamUrl) {
    audioPlayer.src = config.audioStreamUrl;
    audioPlayer.removeAttribute("aria-disabled");
    listenAction?.removeAttribute("aria-disabled");
  } else {
    audioPlayer?.setAttribute("aria-disabled", "true");
  }

  listenAction?.addEventListener("click", (event) => {
    if (!config.audioStreamUrl) {
      event.preventDefault();
      document.querySelector("#player")?.scrollIntoView({ behavior: "smooth" });
    }
  });

  setupVideo(config.videoStreamUrl);
  renderQueue(Array.isArray(config.playlist) ? config.playlist : []);

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  }

  function setupVideo(streamUrl) {
    const player = document.querySelector("[data-video-player]");
    const placeholder = document.querySelector("[data-video-placeholder]");
    const toggle = document.querySelector("[data-video-toggle]");

    if (!player || !toggle || !streamUrl) {
      return;
    }

    player.src = streamUrl;
    toggle.disabled = false;
    toggle.textContent = "Open camera feed";
    toggle.addEventListener("click", async () => {
      const isOpen = player.classList.toggle("is-visible");
      placeholder?.classList.toggle("is-hidden", isOpen);
      toggle.textContent = isOpen ? "Close camera feed" : "Open camera feed";

      if (isOpen) {
        try {
          await player.play();
        } catch (error) {
          // Browser autoplay rules may require the viewer to press play.
        }
      } else {
        player.pause();
      }
    });
  }

  function renderQueue(playlist) {
    const list = document.querySelector("[data-queue-list]");
    const count = document.querySelector("[data-queue-count]");
    if (!list || playlist.length === 0) {
      return;
    }

    list.replaceChildren();
    playlist.forEach((track, index) => {
      const item = document.createElement("li");
      const number = document.createElement("span");
      const title = document.createElement("span");
      const duration = document.createElement("span");

      number.textContent = String(index + 1).padStart(2, "0");
      title.textContent = track.title || "Untitled selection";
      duration.textContent = track.duration || "--:--";
      item.append(number, title, duration);
      list.append(item);
    });
    count.textContent = `${playlist.length} ${playlist.length === 1 ? "selection" : "selections"}`;
  }
})();
