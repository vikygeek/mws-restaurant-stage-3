document.addEventListener("DOMContentLoaded", function() {
  // console.log(document.querySelectorAll("img.lazy"));
  // let lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
  // let active = false;

  // const lazyLoad = function() {
  //   if (active === false) {
  //     active = true;
  //     setTimeout(function() {
  //       console.log(lazyImages);
  //       lazyImages.forEach(function(lazyImage) {
  //         if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
  //           lazyImage.src = lazyImage.dataset.src;
  //           lazyImage.srcset = lazyImage.dataset.srcset;
  //           lazyImage.classList.remove("lazy");

  //           lazyImages = lazyImages.filter(function(image) {
  //             return image !== lazyImage;
  //           });

  //           if (lazyImages.length === 0) {
  //             console.log("None");
  //             document.removeEventListener("scroll", lazyLoad);
  //             window.removeEventListener("resize", lazyLoad);
  //             window.removeEventListener("orientationchange", lazyLoad);
  //           }
  //         }
  //       });

  //       active = false;
  //     }, 200);
  //   }
  // };
  let lazyLoad = () => {
    var myLazyLoad = new LazyLoad({
      elements_selector: ".lazy"
  });
  }
  document.addEventListener("scroll", lazyLoad);
  window.addEventListener("resize", lazyLoad);
  window.addEventListener("orientationchange", lazyLoad);
});