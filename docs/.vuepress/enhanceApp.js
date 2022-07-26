import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
function getElementPosition(el) {
  const docEl = document.documentElement;
  const docRect = docEl.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left,
    y: elRect.top - docRect.top,
  };
}
export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
}) => {
  // ...apply enhancements to the app
  try {
    Vue.use(BootstrapVue);
    Vue.use(IconsPlugin); //use bootstrap
    router.options.scrollBehavior = (to, from, savedPosition) => {
      if (savedPosition) {
        return window.scrollTo({
          top: savedPosition.y,
          behavior: "smooth",
        });
      } else if (to.hash) {
        if (Vue.$vuepress.$get("disableScrollBehavior")) {
          return false;
        }
        let targetElement;
        try {
          targetElement = document.querySelector(
            window.decodeURIComponent(to.hash)
          );
          if (!targetElement) throw "";
        } catch (e) {
          setTimeout(() => {
            const targetElement = document.querySelector(
              window.decodeURIComponent(to.hash)
            );
            window.scrollTo({
              top: getElementPosition(targetElement).y,
              behavior: "smooth",
            });
          }, 1000);
          return false;
        }
        if (targetElement) {
          return window.scrollTo({
            top: getElementPosition(targetElement).y,
            behavior: "smooth",
          });
        }
        return false;
      } else {
        return window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };
  } catch (e) {
    console.error(e.message);
  }
};
