export const show = (container = document.body) => {
  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  container.insertAdjacentElement("beforeend", spinner);
};

export const remove = (container = document.body) => {
  const spinner = container.querySelector(".spinner");
  spinner.classList.add("spinner--hidden");

  spinner.addEventListener("transitionend", (e) => {
    spinner.remove();
  });
};

if (document.head.querySelector("style") == null)
  document.head.append(document.createElement("style"));

document.head.querySelector("style").innerHTML += `
.spinner{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  transition: opacity 0.75s, visibility 0.75s;
  z-index: 200;
}
.spinner--hidden {
  opacity: 0;
  visibility: hidden;
}
.spinner::after {
  content: "";
  width: 50px;
  height: 50px;
  border: 8px solid var(--gray);
  border-top-color: var(--primary-light);
  border-bottom-color: var(--primary-light);
  border-radius: 50%;
  animation: loading 0.75s ease infinite;
}
@keyframes loading {
    from {
        transform: rotate(0turn);
    }
    to {
        transform: rotate(1turn);
    }
}`;
