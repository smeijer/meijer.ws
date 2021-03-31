function navigateAway(cb: () => void): void {
  setTimeout(() => {
    window.onpageshow = (e) => {
      e.persisted && document.body.classList.remove('fade-out');
    };

    window.onblur = () => {
      setTimeout(() => {
        document.body.classList.remove('fade-out');
      }, 500);
    };

    document.body.classList.add('fade-out');

    setTimeout(async () => {
      try {
        await cb();
      } catch (e) {
        console.error(e);
        document.body.classList.remove('fade-out');
      }
    }, 300);
  }, 500);
}

export default navigateAway;
