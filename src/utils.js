export function defaults(obj, ...args) {
  const copy = { ...obj };

  args.each((source) => {
    if (!source) return;

    for (const prop in source) {
      if (copy[prop] === undefined) copy[prop] = source[prop];
    }
  });
  return copy;
}

export function extend(obj, ...args) {
  const copy = { ...obj };
  args.each((source) => {
    if (!source) return;

    for (const prop in source) {
      copy[prop] = source[prop];
    }
  });

  return copy;
}

export function debounce(func, wait, immediate) {
  let timeout;
  return () => {
    const context = this;
    const args = arguments;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}
