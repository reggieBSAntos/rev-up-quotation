import calendarShow from "./src/calendar.js";
import confirm from "./src/confirm.js";
import form from "./src/form.js";
import holidayList from "./src/holidays.js";
import notification from "./src/notification.js";
import {
  init as slider,
  nextSlide,
  prevSlide,
  linkClicked,
} from "./src/slider.js";
import { show as spinnerShow, remove as spinnerRemove } from "./src/spinner.js";
import swipe from "./src/swipe.js";
import toast from "./src/toast.js";

let questions,
  services,
  responses,
  serviceType,
  serviceList,
  questionType,
  questionList,
  responseList,
  responseType,
  quotations = [],
  holidays = null,
  obj = null;

const renderCalendar = (target) => {
  const calendarCallBack = (date) => {
    const [input, span] = target.querySelectorAll("input, span");
    input.value = new Date(date);
    span.innerText = new Date(date).toDateString();
  };

  calendarShow(calendarCallBack, holidays);
};

const adjustHeight = () => {
  let vh = window.innerHeight * 0.01;

  document.documentElement.style.setProperty("--vh", `${vh}px`);

  window.addEventListener("resize", () => {
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });
};

const init = () => {
  /**
   * CALLBACKS
   */
  const callbackService = (input) => {
    const confirmBook = (input) => {
      const index = findQuotation("type", 0);

      // IF BOOKMARKED, CHECK IF THERE ARE "OUR SERVICE" ALREADY BOOKMARKED
      if (index !== -1) {
        confirm({
          title: "Main Service found",
          message:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore sunt reprehenderit sapiente quo cumque at natus laboriosam cupiditate, sint provident doloremque molestiae, repudiandae itaque culpa commodi necessitatibus quae. Nesciunt, tempore.",
          onok: () => {
            const unbook = quotations.splice(index, 1);
            //FIND THE SLIDE OF THE CONNECTED "OUR SERVICES". INDEX IS ALSO THE SLIDE NUMBER
            toggleInputs(parseInt(input.dataset.service), !input.checked);
            // DISABLE OTHER INPUTS IN PREVIOUS SLIDE
            toggleInputs(unbook[0].service, true);
            unbookServices(unbook[0].service);
            addService(input);
          },
          oncancel: () => {
            input.checked = !input.checked;
          },
        });

        return;
      }

      // CHECK IF OTHER SERVICE IS CHECKED PRIOR TO CHECKING OF MAIN SERVICE
      const otherIndex = findQuotation("type", 1);

      if (otherIndex !== -1) {
        confirm({
          title: "Other found",
          message:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore sunt reprehenderit sapiente quo cumque at natus laboriosam cupiditate, sint provident doloremque molestiae, repudiandae itaque culpa commodi necessitatibus quae. Nesciunt, tempore.",
          onok: () => {
            toggleInputs(parseInt(input.dataset.service), !input.checked);
            addOthers(parseInt(input.dataset.service));
            addService(input);
          },
          oncancel: () => {
            input.checked = !input.checked;
          },
        });

        return;
      }

      toggleInputs(parseInt(input.dataset.service), !input.checked);

      addService(input);
    };

    const confirmOther = (input) => {
      const index = findQuotation("type", 0);
      // IF BOOKMARKED, CHECK IF THERE ARE "OUR SERVICE" ALREADY BOOKMARKED
      if (index !== -1) {
        confirm({
          title: "Add other to main",
          message:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore sunt reprehenderit sapiente quo cumque at natus laboriosam cupiditate, sint provident doloremque molestiae, repudiandae itaque culpa commodi necessitatibus quae. Nesciunt, tempore.",
          onok: () => {
            toggleOther(
              quotations[index].service,
              parseInt(input.dataset.service),
              input.checked
            );

            if (input.checked) {
              addService(input);
            } else {
              removeService("service", parseInt(input.dataset.service));
            }
          },
          oncancel: () => {
            input.checked = !input.checked;
          },
        });

        return;
      }

      if (input.checked) {
        addService(input);
      } else {
        removeService("service", parseInt(input.dataset.service));
      }
    };

    const unbookServices = (index) => {
      slides[index].querySelectorAll("input").forEach((input) => {
        // UNCHECK SERVICES IN MAIN TAB
        input.checked = false;

        // REMOVE FROM THE QUOTATIONS
        removeService("service", parseInt(input.dataset.service));

        // IF OTHER INPUT, UNCHECK CONNECTED SLIDE
        if (serviceType[parseInt(input.dataset.type)] === "Other")
          document.querySelectorAll(".slide-left-panel input")[
            parseInt(input.dataset.service)
          ].checked = false;
      });
    };

    // GETL ALL BOOKMARKED (OTHERS SERVICES ONLY) THAT WERE BOOKMARKED PRIOR TO MAIN. UPDATE OTHER SERVICES INPUT IN  MAIN SERVICE (CURRENT) SLIDE
    const addOthers = (num) => {
      const others = quotations
        .filter((r) => r.type === 1)
        .map((r) => r.service);

      Array.from(
        slides[num].querySelectorAll(".slide-right-panel input")
      ).forEach((r) => {
        if (others.indexOf(parseInt(r.dataset.service)) !== -1)
          r.checked = true;
      });
    };

    //ACTIVATES/ DEACTIVATES ALL INPUTS IN THE RIGHT PANEL OF SLIDE
    const toggleInputs = (service, isDisabled = false) => {
      slides[service]
        .querySelectorAll(".slide-right-panel input")
        .forEach((input) => {
          input.disabled = isDisabled;
        });
    };

    //CHECK/ UNCHECK THE INPUT IN LEFT PANEL OF (OTHER SERVICE ONLY) SLIDE THAT ARE CONNECTED TO THE RIGHT PANEL INPUT (CURRENT AND MAIN SERVICE ONLY) SLIDE
    const toggleOther = (service, other, isChecked = false) => {
      const input = Array.from(
        slides[service].querySelectorAll(".slide-right-panel input")
      ).find((r) => parseInt(r.dataset.service) === other);

      input.checked = isChecked;
    };

    // CHECK IF TYPE IS 'ADD-ON (2)'
    if (parseInt(input.dataset.type) === 2) return;

    // CHECK IF TYPE IS 'MAIN (0)'
    if (parseInt(input.dataset.type) === 0) {
      // CHECK IF THE IT'S BOOKMARKED
      switch (input.checked) {
        case true:
          confirmBook(input);
          break;
        default:
          unbookServices(parseInt(input.dataset.service));
          toggleInputs(parseInt(input.dataset.service), !input.checked);

          toggleBadge();
          break;
      }

      return;
    }

    // NO NEED TO CHECK IF TYPE 1, REMAINING OPTION IS ALREADY TYPE 1
    confirmOther(input);
  };

  const callbackOther = (input) => {
    // ONLY TYPE 1 IS NEEDED, INPUTS ARE TYPE 1 AND 2 ONLY
    if (parseInt(input.dataset.type) === 2) return;

    slides[parseInt(input.dataset.service)].querySelector(
      ".slide-left-panel input"
    ).checked = input.checked;

    if (input.checked) addService(input);
    else removeService("service", parseInt(input.dataset.service));
  };

  const callbackItem = (returnValue) => {
    linkClicked(parseInt(returnValue));
  };

  const callbackBadge = () => {
    // LOOP IN EACH BOOKMARKED SERVICES
    // REMOVE DUPLICATES
    const quotationQuestions = {};

    // KEY FOR THE GENERIC QUESTIONS BASED ON THE RESUME SERVICE,
    // ONLY 1 RESUME SERVICE
    // CHECK IF THERE IS A RESUME SERVICE IN THE QUOTATION
    // ADD ALL GENERIC QUESTIONS TO RESUME SERVICE
    // IF NO RESUME SERVICE, GENERIC QUESTION KEY = "GENERIC"
    const key = quotations.find((a) => serviceType[a.type] === "Resume");

    quotationQuestions[key ? key.service : "generic"] = [
      ...new Set(
        quotations
          .map((a) => {
            // GET THE QUESTIONS IN EACH SERVICE AND FILTER THE GENERAL QUESTIONS
            return services[a.service].questions.filter((b) => {
              return questionType[questions[b].questionType] === "Generic";
            });
          })
          .flatMap((a) => a)
      ),
    ].sort((a, b) => a - b);

    // LOOP IN EACH BOOKMARKED SERVICES
    quotations.forEach((a) => {
      // GET THE QUESTIONS IN EACH SERVICE AND FILTER THE GENERAL QUESTIONS
      if (serviceType[a.type] === "Resume") return;

      quotationQuestions[a.service] = services[a.service].questions.filter(
        (b) => {
          return questionType[questions[b].questionType] === "Specific";
        }
      );
    });

    form({
      object: quotationQuestions,
      dateInpClick: renderCalendar,
      buttonClick: callbackForm,
      inputInput: callbackInput,
      responseList: responseList,
      serviceList: serviceList,
      questionList: questionList,
      questions: questions,
      responses: responses,
    });
  };

  const callbackInput = () => {
    toast("Please fill-out the field properly", "error");
  };

  const callbackForm = async (returnValue) => {
    if (!returnValue) {
      toast("Please answer all questions", "error");
      return;
    }

    try {
      spinnerShow();

      let data = {
        quotations: [],
        answers: {},
        info: {},
      };

      data.quotations = [
        ...new Set(
          Array.from(document.querySelectorAll(".slide input"))
            .filter((input) => input.checked)
            .map((input) => parseInt(input.dataset.service))
        ),
      ];

      Array.from(document.querySelectorAll(".form .contents")).forEach(
        (fieldset) => {
          // Get the service
          data.answers[fieldset.dataset.service] = Array.from(
            fieldset.querySelectorAll(".content:not(.closing)")
          ).map((li) => {
            let objB = {
              // Get questions
              question: li.dataset.question,
              // Get response
              response: Array.from(li.querySelectorAll(".radio__input")).find(
                (input) => input.checked === true
              ).dataset.response,
            };

            return objB;
          });
        }
      );

      Array.from(document.querySelectorAll(".content.closing input")).forEach(
        (input) => (data.info[input.dataset.inputtype] = input.value)
      );

      /* CREATE A DEEP COPY OF serviceList, questionList and responseList, and append to the data that will be send to the backend so back end script doesn't need to recall the questions API */
      data.serviceList = JSON.parse(JSON.stringify(serviceList));
      data.questionList = JSON.parse(JSON.stringify(questionList));
      data.responseList = JSON.parse(JSON.stringify(responseList));

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      // console.log(data);
      const urlEndPoint = `https://script.google.com/macros/s/AKfycbxlb5gHEj7IMeYYaF3cYfOAoOLkwmUOi--E6DB3GMWaHanGAsPYgKLuIDInXBLUIPU/exec`;

      const response = await fetch(urlEndPoint, {
        method: "POST",
        body: formData,
      });

      const content = await response.json();

      if (content.result !== "succes")
        throw new Error("Something went wrong. Please try again later");

      window.alert(
        "We have received your request. Please give us time to assess your requirements"
      );

      const el = document.querySelector(".form");

      el.classList.add("form--close");
      el.addEventListener("animationend", () => {
        el.remove();
      });
    } catch (err) {
      toast(err.message, "error");
    } finally {
      spinnerRemove();
    }
  };

  const findQuotation = (key, num) =>
    quotations.findIndex((r) => r[key] === num);

  const toggleBadge = () => {
    // SHOW BADGE IF THERE ARE BOOKMARKED
    badge.textContent = quotations.length;
    if (quotations.length === 0) badge.classList.add("badge--hidden");
    else badge.classList.remove("badge--hidden");
  };

  const addService = (input) => {
    quotations.push({
      type: parseInt(input.dataset.type),
      service: parseInt(input.dataset.service),
      name: serviceList[parseInt(input.dataset.service)],
    });

    toggleBadge();
  };

  const removeService = (type, num) => {
    const index = findQuotation(type, num);
    quotations.splice(index, 1);

    toggleBadge();
  };

  // renderView();
  const slides = slider({
    services,
    responses,
    serviceType,
    serviceList,
    callbackOther,
    callbackService,
  });

  if (holidays) holidayList(holidays, document.querySelector(".left-panel"));

  const badge = document.querySelector(".badge");

  badge.addEventListener("click", (e) => {
    if (quotations.length === 0) return;

    notification({
      container: document.querySelector(".top-panel"),
      array: quotations,
      buttonText: "Continue",
      buttonClick: callbackBadge,
      itemClick: callbackItem,
    });
  });

  /* SWIPE EVENT */
  slides.forEach((slide) => {
    swipe(slide, (swipedir) => {
      //     swipedir contains either "none", "left", "right", "top", or "down"
      if (swipedir == "left") nextSlide();
      if (swipedir == "right") prevSlide();
    });
  });

  /* ADJUST HEIGHT */
  adjustHeight();
};

document.addEventListener("DOMContentLoaded", async () => {
  // GET DATA
  try {
    spinnerShow();

    const calendarUrl =
      "https://script.google.com/macros/s/AKfycbzXpGROoIlji0ArD-iob6hSRCzIRnxQDGDYIEniaxsgoJTPLf_pqWLZcpTW58I-ZG0A3w/exec";

    const calendarResponse = await fetch(calendarUrl);
    holidays = await calendarResponse.json();

    const questionsUrl =
      "https://script.google.com/macros/s/AKfycbyUmYqnLpxTlhn2Pmz776SIa3yEWOYnuzSVUTyHzPBY6-LaSXZmtb5hKn2-iCNdlwRwyg/exec";

    const questionResponse = await fetch(questionsUrl);
    const obj = await questionResponse.json();

    ({ questions, services, responses } = obj);
    ({
      serviceType,
      serviceList,
      questionType,
      questionList,
      responseList,
      responseType,
    } = obj.indices);

    init();
  } catch (err) {
    toast(err.message, "error");
  } finally {
    spinnerRemove();
  }
});
