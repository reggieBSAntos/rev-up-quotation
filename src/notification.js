let options = {};

export default (param) => {
  options = Object.assign(
    {},
    {
      container: "",
      array: [],
      buttonText: "OK",
      buttonClick: function () {},
      itemClick: function () {},
    },
    param
  );

  if (options.container.querySelector(".notification")) {
    close(
      options.container.querySelector(".overlay"),
      options.container.querySelector(".notification")
    );
    return;
  }

  const html = `
      <div class="overlay"></div>
      <div class="notification">
      ${options.array
        .map((r) => {
          return `<div class="notification__item"  data-type="${r.type}" data-service="${r.service}">${r.name}</div>`;
        })
        .join("")}
        <button class="notification__button">${options.buttonText}</button>
      </div>
      `;

  const template = document.createElement("template");
  template.innerHTML = html;

  // Elements
  const overlay = template.content.querySelector(".overlay");
  const notificationEl = template.content.querySelector(".notification");
  const btnClick = template.content.querySelector(".notification__button");
  const items = template.content.querySelectorAll(".notification__item");

  btnClick.addEventListener("click", () => {
    options.buttonClick();
    close(overlay, notificationEl);
  });

  overlay.addEventListener("click", () => {
    close(overlay, notificationEl);
  });

  Array.from(items).forEach((item) => {
    item.addEventListener("click", (e) => {
      options.itemClick(e.target.dataset.service);
      close(overlay, notificationEl);
    });
  });

  options.container.appendChild(template.content);
};

const close = (overlay, notification) => {
  notification.classList.add("notification--close");
  overlay.remove();

  notification.addEventListener("animationend", () => {
    options.container.removeChild(notification);
  });
};

if (document.head.querySelector("style") == null)
  document.head.append(document.createElement("style"));

document.head.querySelector("style").innerHTML += `
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  padding: 10px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.notification {
  position: absolute;
  max-width: 200px;
  top: calc(100% - 10px);
  right: 10px;

  border-radius: 2px;
  padding: 10px;
  background: #ffffff;

  text-align: center;
  box-shadow: var(--box-shadow);

  transform: translateY(-10%);
  animation-name: notification---open;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;

  z-index: 100;
}
.notification--close {
  animation-name: notification---close;
}

@keyframes notification---close {
  to {
    transform: translateY(-10%);
    opacity: 0;
  }
}

@keyframes notification---open {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notification__item {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5px;
  cursor: pointer;
  font-size: 0.9em;
}
.notification__item:not(:last-of-type) {
  border-bottom: 1px solid var(--gray);
}

.notification__item:first-of-type {
  padding-top: 0;
}
.notification__item:last-of-type {
  padding-bottom: 0;
  margin-bottom: 10px;
}
.notification__item:hover {
  background: #fcfbfa;
}
.notification__button {
  width: 100%;
  background: var(--secondary);

  padding: 6px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.88);

  box-sizing: border-box;
  box-shadow: var(--box-shadow);
  cursor: pointer;

  transition: background 0.2s, scale 0.2s;
}
.notification__button:hover {
  background: var(--secondary);
}
.notification__button:active {
  transform: scale(0.99, 0.99);
}`;
