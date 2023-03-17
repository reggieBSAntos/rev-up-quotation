let options = {};

export default (param) => {
  options = Object.assign(
    {},
    {
      title: "",
      message: "",
      okText: "OK",
      cancelText: "Cancel",
      onok: function () {},
      oncancel: function () {},
    },
    param
  );

  const html = `
    <div class="confirm">
        <div class="confirm__window">
            <div class="confirm__titlebar">
                <span class="confirm__title">${options.title}</span>
                <button class="confirm__close">&times;</button>
            </div>
            <div class="confirm__content">${options.message}</div>
            <div class="confirm__buttons">
                <button class="confirm__button confirm__button--ok confirm__button--fill">${options.okText}</button>
                <button class="confirm__button confirm__button--cancel">${options.cancelText}</button>
            </div>
        </div>
    </div>
`;

  const template = document.createElement("template");
  template.innerHTML = html;

  // Elements
  const confirmEl = template.content.querySelector(".confirm");
  const btnClose = template.content.querySelector(".confirm__close");
  const btnOk = template.content.querySelector(".confirm__button--ok");
  const btnCancel = template.content.querySelector(".confirm__button--cancel");

  confirmEl.addEventListener("click", (e) => {
    if (e.target === confirmEl) {
      close(confirmEl, options.oncancel);
    }
  });

  btnOk.addEventListener("click", (e) => {
    close(confirmEl, options.onok);
  });

  [btnClose, btnCancel].forEach((el) => {
    el.addEventListener("click", (e) => {
      close(confirmEl, options.oncancel);
    });
  });

  document.body.appendChild(template.content);
};

const close = (confirmEl, callBack) => {
  confirmEl.classList.add("confirm--close");

  confirmEl.addEventListener("animationend", () => {
    if (confirmEl) confirmEl.remove();
    callBack();
  });
};

if (document.head.querySelector("style") == null)
  document.head.append(document.createElement("style"));

document.head.querySelector("style").innerHTML += `
.confirm {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  padding: 10px;
  box-sizing: border-box;

  opacity: 0;
  animation-name: confirm---open;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 13;
}

.confirm--close {
  animation-name: confirm---close;
}
.confirm__window {
  width: 100%;
  max-width: 600px;
  background: var(--primary);
  font-size: 14px;
  font-family: sans-serif;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

  opacity: 0;
  transform: scale(0.75);
  animation-name: confirm__window---open;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
  animation-delay: 0.2s;
}
.confirm__titlebar,
.confirm__content,
.confirm__buttons {
  padding: 1.25em;
}
.confirm__titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.confirm__title {
  color: rgba(0, 0, 0, 0.49);
  font-weight: 500;
  font-size: 1.1em;
}
.confirm__close {
  background: none;
  outline: none;
  border: none;
  transform: scale(2);
  font-weight: 300;
  color: rgba(0, 0, 0, 0.49);
  transition: color 0.2s;
}
.confirm__close:hover {
  color: var(--red);
  cursor: pointer;
}
.confirm__content {
  background: #eeeeee;
  line-height: 1.8em;
}
.confirm__buttons {
  background: #ffffff;
  display: flex;
  justify-content: flex-end;
}
.confirm__button {
  padding: 0.4em 0.8em;
  border: 1px solid var(--secondary);
  border-radius: 5px;
  background: #ffffff;
  color: var(--secondary);
  font-weight: 500;
  font-size: 1.1em;
  font-family: sans-serif;
  margin-left: 0.6em;
  cursor: pointer;
  outline: none;
}
.confirm__button--fill {
  background: var(--secondary);
  color: #ffffff;
}
.confirm__button:hover {
  box-shadow: var(--box-shadow);
}
@keyframes confirm---open {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes confirm---close {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes confirm__window---open {
  to {
    opacity: 1;
    transform: scale(1);
  }
}`;
