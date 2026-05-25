export function scrollFocusedFieldIntoView(event) {
  const target = event.target;

  if (!target?.matches?.('input, textarea')) {
    return;
  }

  const scrollToField = () => {
    target.scrollIntoView({
      block: 'center',
      inline: 'nearest',
      behavior: 'smooth',
    });
  };

  window.requestAnimationFrame(scrollToField);
  window.setTimeout(scrollToField, 120);
  window.setTimeout(scrollToField, 320);
}
