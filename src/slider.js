let services,
  serviceType,
  serviceList,
  callbackService,
  callbackOther,
  curSlide = 0,
  maxSlide = 0,
  slidesFrag = document.createDocumentFragment(""),
  dotsFrag = document.createDocumentFragment(""),
  slides,
  dots;

/**
 * OBJECTS
 */
class Service {
  constructor(options) {
    this.options = Object.assign(
      {},
      {
        type: "",
        service: "",
        index: "",
        title: "",
        long: "",
        services: "",
        callbackService: () => {},
        callbackOther: () => {},
      },
      options
    );

    this.div = document.createElement("div");
    this.div.className = "slide";
    this.div.style.transform = `translateX(${maxSlide * 100}%)`;
    this.div.innerHTML = `
      <div class="slide-left-panel">
        
        <h1>
          ${this.options.service}
        </h1>
        <h4>
          ${this.options.long}
        </h4>

        <div>
          <label type="checkbox"
          for="service-${padNums(this.options.index)}" class="checkbox">
            <input
             type="checkbox"
             id="service-${padNums(this.options.index)}"
             class="checkbox__input"
             data-service="${this.options.index}"
             data-type="${this.options.type}"
           />
           <div
             class="checkbox__box checkbox__box--checked checkbox__box--unchecked"
           >
           </div>
           <span class="text--unchecked">Add to quotation</span>
           <span class="text--checked">Remove from quotation</span>

          </label>
        </div>
       
      </div>`;

    this.div
      .querySelector(".slide-left-panel input")
      .addEventListener("change", (e) => {
        this.options.callbackService(e.target);
      });
  }
}

class Our extends Service {
  constructor(options) {
    super(options);

    this.div.insertAdjacentHTML(
      "beforeend",
      `<div class="slide-right-panel">
     <fieldset class="slide-fieldset">
       <legend class="slide-fieldset__legend">
         <span>
           Please bookmark the
           <strong>Other Services</strong>
           you like to add in the package</span
         >
       </legend>

       ${this.options.services
         .map((r, i) => {
           return `<div>
         <label type="checkbox"
         for="${padNums(this.options.index)}-${padNums(i)}"
         class="checkbox">
           <input
             type="checkbox"
             name="service-${padNums(this.options.index)}"
             id="${padNums(this.options.index)}-${padNums(i)}"
             data-type="${services[r].serviceType}"
             data-service="${r}"
             class="checkbox__input"
             disabled
           />
           <div
             class="checkbox__box checkbox__box--checked checkbox__box--unchecked"
           ></div>
           <span>${serviceList[r]}</span>
         </label>
       </div>`;
         })
         .join("")}
     </fieldset>
   </div>
 `
    );

    this.div.querySelectorAll(".slide-right-panel input").forEach((input) => {
      input.addEventListener("change", (e) => {
        this.options.callbackOther(e.target);
      });
    });
  }
}

class Dot {
  constructor(options) {
    this.options = Object.assign(
      {},
      {
        index: "",
        callback: () => {},
      },
      options
    );

    this.div = document.createElement("a");
    this.div.className = "dots__dot";
    this.div.dataset.service = this.options.index;

    this.div.addEventListener("click", (e) => {
      activateDot(parseInt(e.target.dataset.service));
    });
  }
}

export const init = (params) => {
  ({ services, serviceType, serviceList, callbackOther, callbackService } =
    params);

  services.forEach((service, index) => {
    const type = serviceType[service.serviceType].toLowerCase();

    if (type === "addon") return;

    // ADD SLIDE
    const optionsSlide = {
      type: service.serviceType,
      service: serviceList[service.service],
      index: index,
      title: service.title,
      long: service.long,
      services: service.services,
      callbackService: callbackService,
      callbackOther: callbackOther,
    };

    let slide;

    if (type === "resume") slide = new Our(optionsSlide);
    else slide = new Service(optionsSlide);
    slidesFrag.append(slide.div);

    // ADD DOT
    const optionsDot = {
      index: index,
      //   callback: callbackDot,
    };

    const dot = new Dot(optionsDot);

    dotsFrag.append(dot.div);

    maxSlide++;
  });

  slider.append(slidesFrag);
  dot.append(dotsFrag);

  dots = dot.querySelectorAll(".dots__dot");
  slides = slider.querySelectorAll(".slide");

  activateDot(curSlide);
  activateSlider();

  return slides;
};

const slider = document.querySelector(".slider"),
  dot = document.querySelector(".dots > div");

const padNums = (num) => num.toString().padStart(2, "0");

const activateDot = (i) => {
  Array.from(dots).forEach((_, index) => {
    dots[index].classList.remove("dots__dot--active");
  });

  dots[i].classList.add("dots__dot--active");
  goToSlide(i);
  curSlide = i;
};

const activateSlider = () => {
  const [btnPrev, btnNext] = document.querySelectorAll(" .slider-button");

  btnNext.addEventListener("click", nextSlide);
  btnPrev.addEventListener("click", prevSlide);
};

export const nextSlide = () => {
  if (curSlide === maxSlide - 1) curSlide = 0;
  else curSlide++;

  goToSlide(curSlide);
  activateDot(curSlide);
};

export const prevSlide = () => {
  if (curSlide === 0) curSlide = maxSlide - 1;
  else curSlide--;

  goToSlide(curSlide);
  activateDot(curSlide);
};

export const linkClicked = (i) => {
  curSlide = parseInt(i);
  goToSlide(curSlide);
  activateDot(curSlide);
};

const goToSlide = (slide) => {
  Array.from(slides).forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
