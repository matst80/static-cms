export function saveSelection(): Range[] | undefined {
  const sel = window.getSelection();
  if (sel?.getRangeAt && sel.rangeCount) {
    const ranges: Range[] = [];
    for (let i = 0, len = sel.rangeCount; i < len; ++i) {
      ranges.push(sel.getRangeAt(i));
    }
    return ranges;
  }
  return undefined;
}

export function restoreSelection(savedSel: Range[] | undefined) {
  const sel = window.getSelection();

  if (savedSel && sel) {
    sel.removeAllRanges();
    for (let i = 0, len = savedSel.length; i < len; ++i) {
      sel.addRange(savedSel[i]);
    }
  }
}

export function surroundSelection(elm: Node, range: Range | undefined) {
  if (range) {
    range.surroundContents(elm);
  } else {
    const sel = window.getSelection();
    if (sel) {
      sel.getRangeAt(0).surroundContents(elm);
    }
  }
}
