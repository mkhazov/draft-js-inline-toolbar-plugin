import decorateComponentWithProps from 'decorate-component-with-props';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
} from 'draft-js-buttons'; // eslint-disable-line import/no-unresolved
import createStore from './utils/createStore';
import Toolbar from './components/Toolbar';
import Separator from './components/Separator';
import buttonStyles from './buttonStyles.css';
import toolbarStyles from './toolbarStyles.css';
import separatorStyles from './separatorStyles.css';

const createInlineToolbarPlugin = (config = {}) => {
  const defaultTheme = { buttonStyles, toolbarStyles, separatorStyles };

  const store = createStore({
    isVisible: false,
  });

  const {
    theme = defaultTheme,
    structure = [
      BoldButton,
      ItalicButton,
      UnderlineButton,
      CodeButton,
      // Separator,
      // HeadlineOneButton,
      // HeadlineTwoButton,
      // HeadlineThreeButton,
      // UnorderedListButton,
      // OrderedListButton,
      // BlockquoteButton,
      // CodeBlockButton,
    ]
  } = config;

  const toolbarProps = {
    store,
    structure,
    theme,
  };

  return {
    initialize: ({ getEditorState, setEditorState }) => {
      store.updateItem('getEditorState', getEditorState);
      store.updateItem('setEditorState', setEditorState);
    },
    // Re-Render the text-toolbar on selection change
    onChange: (editorState) => {
      const selection = editorState.getSelection();
      if (selection.getHasFocus() && !selection.isCollapsed()) {
        store.updateItem('isVisible', true);
      } else {
        store.updateItem('isVisible', false);
      }
      return editorState;
    },
    InlineToolbar: decorateComponentWithProps(Toolbar, toolbarProps),
  };
};

export default createInlineToolbarPlugin;

export {
  Separator,
};
