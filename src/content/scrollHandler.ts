export const scrollHandler = {
  init() {
    // Listen for messages from the background script
    const url = new URL(window.location.toString());
    const v_position = url.searchParams.get("v_position");

    if (v_position) {
      try {
        const pos = JSON.parse(v_position);

        window.scrollTo(pos.left, pos.top - 20);
      } catch (ex) {
        console.log(ex);
      }
    }
  },
};
