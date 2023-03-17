let options = {};

export default (param) => {
  options = Object.assign(
    {},
    {
      container: "",
      object: {},
      buttonText: "OK",
      buttonClick: function () {},
      dateInpClick: function () {},
      inputInput: function () {},
      responseList: [],
      serviceList: [],
      questionList: [],
      questions: [],
      responses: [],
    },
    param
  );

  if (document.querySelector(".form")) {
    close(document.querySelector(".form"));
    return;
  }

  const html = `<div class="form">
        <span class="arrow-back"> </span>
        <p class="instructions">
          <strong>Instructions:</strong> Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Deserunt officiis illo dicta voluptates. Nobis
          corrupti laboriosam ad officiis alias soluta!
        </p>
        ${addFieldset()}
        <button class="form__button">Send request</button>
      </div>`;

  const template = document.createElement("template");
  template.innerHTML = html;

  const fieldsets = template.content.querySelectorAll(".contents");
  const radioInputs = template.content.querySelectorAll(".radio__input");

  addInputs(fieldsets);

  template.content
    .querySelector(".arrow-back")
    .addEventListener("click", () => {
      close();
    });

  template.content
    .querySelector("#dateInp")
    .addEventListener("click", ({ target }) => {
      options.dateInpClick(target.closest("label"));
    });

  // VALIDATE OTHER INPUT
  template.content.querySelectorAll("#nameInp, #emailInp").forEach((el) => {
    let actions = ["focus", "change"];

    actions.forEach((a) => {
      el.addEventListener(a, (e) => {
        if (e.type === "focus") {
          e.target.classList.remove("inp--error");
          return;
        }
        if (e.type === "change") {
          const str = e.target.value;

          const isValid =
            e.target.id === "nameInp"
              ? str.match(/^(\w{2,}\s)?((\w{2,}\s){1,})(\w{2,})/)
              : str.match(
                  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/gi
                );

          if (isValid) return;

          e.target.classList.add("inp--error");
          e.target.value = "";

          options.inputInput();
        }
      });
    });
  });

  template.content
    .querySelector(".form__button")
    .addEventListener("click", () => {
      options.buttonClick(validate());
    });

  Array.from(radioInputs).forEach((input) => {
    input.addEventListener("change", ({ target }) => {
      // EXPLICITLY CHECK IF 'S THE RIGHT PANEL INPUT
      if (!target.classList.contains("radio__input")) return;

      // GET THE CLOSEST 'li' AND 'fieldset' TAGS
      const li = target.closest(".content");
      const fieldset = target.closest(".contents");

      // REMOVE ALL ".content.followup" CLASS IN THE FIELDSET
      Array.from(fieldset.querySelectorAll(".content.followup")).forEach((r) =>
        r.remove()
      );

      // GET THE RESPONSE INDEX AND FIND INDEX IN THE RESPONSES
      // GET THE FOLLOW-UP QUESTIONS
      const followupQuestion =
        options.responses[parseInt(target.dataset.response)].followup;

      // IF FOLLOW LENGHT !== 0  CONTINUE
      // ADD NEW LI IN CLOSEST FIELDSET
      if (!followupQuestion.length) return;

      // i = INDEX OF THE TARGET FIELDSET
      const i = Array.from(fieldsets).findIndex((r) => r === fieldset);

      // j = INDEX OF THE TARGET LI
      const j = fieldset.querySelectorAll(".content").length;

      li.insertAdjacentHTML(
        "afterend",
        addLi(i, followupQuestion, j, "followup")
      );
    });
  });

  document.body.appendChild(template.content);
};

const padString = (str) => {
  return str.toString().padStart(2, "0");
};

const addInputs = (els) => {
  els[els.length - 1].querySelector("ol").insertAdjacentHTML(
    "beforeend",
    `<li class="content closing">
            <div class="question">
              How soon do you need the final copy of your documents?
            </div>
            <div class="notes">
            Regular - Three (3) network days days turnaround for the first drafts <br> Rush - 2 days turnaround for the first drafts <br> Sundays and National Holidays not included
            </div>
            <div class="response">
              <div>
                <label for="dateInp" class="dateInp">
                  <input
                    type="text"
                    id="dateInp"
                    class="dateInp__input"
                    data-inputtype="date"
                  />
                  <div class="dateInp__box">
                    <span class="dateInp__box__text">Day Mon dd yyyy</span>
                  </div>
                </label>
              </div>
            </div>
          </li>
          <li class="content closing">
            <div class="question">
              Please enter your Given and Family names?
            </div>
            <div class="response">
              <div>
                <label for="nameInp" class="nameInp">
                  <input
                    type="text"
                    id="nameInp"
                    class="nameInp__input"
                    placeholder="Fred Nerk"
                    data-inputtype="name"
                  />
                </label>
              </div>
            </div>
          </li>
          <li class="content closing">
            <div class="question">
              Please enter your email address?
            </div>
            <div class="response">
              <div>
                <label for="emailInp" class="emailInp">
                  <input
                    type="text"
                    id="emailInp"
                    class="emailInp__input"
                    placeholder="frednurk@gmail.com"
                    data-inputtype="email"
                  />
                </label>
              </div>
            </div>
          </li>`
  );
};

/**
 * label for responses
 */
const addLabel = (i, j, arr) => {
  return arr
    .map((a, k) => {
      return `<div>
            <label for="response-${padString(i)}-${padString(j)}-${padString(
        k
      )}" class="radio">
              <input
                type="radio"
                name="question-${padString(i)}-${padString(j)}"
                id="response-${padString(i)}-${padString(j)}-${padString(k)}"
                class="radio__input"
                data-response = "${a}"
              />
              <div class="radio__radio"></div>
              ${options.responseList[a]}
            </label>
          </div>
          `;
    })
    .join("");
};

/**
 * @params
 * li for questions
 * i = current loop/ used as key
 * arr = the object in current loop/ responses
 */
const addLi = (i, arr, j = 0, cl = "") => {
  return arr
    .map((b) => {
      j++;
      return `  <li class="content${
        cl === "" ? "" : " " + cl
      }" data-question="${b}">
            <div class="question">
            ${options.questionList[options.questions[b].question]}
            </div>
            <div class="notes">
              ${options.questions[b].notes}
            </div>
            <div class="response">
              ${addLabel(i, j, options.questions[b].responses)}
            </div>
          </li>`;
    })
    .join("");
};

/**
 * fieldset for service/ product
 */
const addFieldset = () => {
  return Object.keys(options.object)
    .map((a, i) => {
      return `<fieldset class="contents" data-service="${a}">
        <legend>${
          a === "generic" ? "" : options.serviceList[parseInt(a)]
        } Questions</legend>
        <ol>
          ${addLi(i, options.object[a])}
        </ol>
      </fieldset>`;
    })
    .join("");
};

/**
 * Get all "contents"/ class -> fieldset
 * Loop every contents true/ get each content
 * Get all "content"/ class -> li
 * Loop every content true/  get input from each
 * Loop some input true
 */
const validate = () => {
  let isChecked = false,
    isFilledout = false;

  isChecked = Array.from(document.querySelectorAll(".form fieldset")).every(
    (fieldset) => {
      return Array.from(fieldset.querySelectorAll("li:not(.closing)")).every(
        (content) => {
          return Array.from(content.querySelectorAll("input")).some((input) => {
            return input.checked === true;
          });
        }
      );
    }
  );

  isFilledout = Array.from(
    document.querySelectorAll("#dateInp, #nameInp, #emailInp")
  ).every((input) => input.value !== "");

  return [isChecked, isFilledout].every((r) => r === true);
};

const close = () => {
  const el = document.querySelector(".form");

  el.classList.add("form--close");
  el.addEventListener("animationend", () => {
    el.remove();
  });
};

if (document.head.querySelector("style") == null)
  document.head.append(document.createElement("style"));

document.head.querySelector("style").innerHTML += `
.form {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
  z-index: 102;
}
.form--close {
  animation-name: form---close;
}
.form .content > div:not(:last-of-type) {
  margin-bottom: 10px;
}
.form__button {
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
.form__button:hover {
  background: var(--secondary);
}
.form__button:active {
  transform: scale(0.99, 0.99);
}
.form__button {
  width: auto;
  padding: 10px 16px;
}

/* DATE */
.dateInp {
  position: relative;
  display: inline-flex;
  align-items: top;
  justify-content: center;
  width: 300px;
  cursor: pointer;
}
.dateInp__input {
  display: none;
}
.dateInp__box {
  position: relative;
  width: 100%;
  padding: 10px 16px;

  border: 1px solid rgba(0, 0, 0, 0.3);

  cursor: pointer;
  border-radius: 4px;
}
.dateInp__box__text {
  margin-left: 20px;
}
.dateInp__box::before {
  position: absolute;
  left: 10px;
  top: 0;
  transform: translateY(50%);
  font-family: "Material Icons";
  content: "\\e935";

  display: block;
  font-size: 1.15em;
  color: var(--primary);
  transition: color 0.25s;
}

/* DATE */
.nameInp,
.emailInp {
  position: relative;
  display: inline-flex;
  align-items: top;
  justify-content: center;
  width: 300px;
  cursor: pointer;
}
.nameInp__input,
.emailInp__input {
  width: 100%;
  padding: 10px 16px;
  padding-left: 2.25em;
  outline: none;
  border: 1px solid rgba(0, 0, 0, 0.3);

  cursor: pointer;
  border-radius: 4px;
}
.nameInp__box,
.emailInp__box {
  position: relative;
}
.nameInp__box__text,
.emailInp__box__text {
  margin-left: 20px;
}
.nameInp::before,
.emailInp::before {
  position: absolute;
  left: 10px;
  top: 0;
  transform: translateY(50%);
  font-family: "Material Icons";

  display: block;
  font-size: 1.25em;
  color: var(--primary);
  transition: color 0.25s;
}
.nameInp::before {
  content: '\\e7fd';
}
.emailInp::before {
  content: "\\e0be";
}
.inp--error {
  border-color: #d32f2f;
}`;
