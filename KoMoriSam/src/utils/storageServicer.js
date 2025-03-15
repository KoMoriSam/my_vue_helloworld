class LocalStorageService {
  constructor(key) {
    this.key = key;
  }

  getItem() {
    const itemStr = localStorage.getItem(this.key);
    if (!itemStr) {
      return null;
    }
    return JSON.parse(itemStr);
  }

  setItem(value) {
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  updateItem(newValue) {
    const currentValue = this.getItem();
    if (!currentValue) {
      this.setItem([newValue]);
      return;
    }
    currentValue.push(newValue);
    this.setItem(currentValue);
  }
}

const SET_THEME = "SET_THEME";
const READ_CHAPTER = "READ_CHAPTER";
const CHAPTER_CONTENTS = "CHAPTER_CONTENTS";

const themeService = new LocalStorageService(SET_THEME);
const readChapterService = new LocalStorageService(READ_CHAPTER);
const chapterContentsService = new LocalStorageService(CHAPTER_CONTENTS);

export const getSelectedTheme = () => {
  const theme = themeService.getItem();
  return theme || "default";
};
export const setSelectedTheme = (newSelectedTheme) =>
  themeService.setItem(newSelectedTheme);

export const getReadChapters = () => readChapterService.getItem();
export const setReadChapters = (newReadChapter) =>
  readChapterService.updateItem(newReadChapter);

export const getChapterContents = () => chapterContentsService.getItem();
export const setChapterContents = (newContents) =>
  chapterContentsService.updateItem(newContents);
