'use babel';

import CheatshAtomView from './cheat.sh-atom-view';
import { CompositeDisposable } from 'atom';

export default {

  CheatshAtomView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.CheatshAtomView = new CheatshAtomView(state.CheatshAtomViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.CheatshAtomView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'cheat.sh-atom:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.CheatshAtomView.destroy();
  },

  serialize() {
    return {
      CheatshAtomViewState: this.CheatshAtomView.serialize()
    };
  },

  toggle() {
    let editor;

    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText();
      let language = editor.getGrammar().name;
      let query = `http://cht.sh/${language}/${selection}?T?Q`;

      fetch(query, {
        method: 'get',
      })
      .then(resp => resp.text())
      //this is because it is not possible to change the user-agent
      .then(resp => resp.match('<pre>(.|\n)*?<\/pre>')[0])
      .then(resp => resp.replace('<pre>', ''))
      .then(resp => resp.replace('\n$\n</pre>', ''))

      .then(resp => {
        editor.insertText(resp);
      })
    }

    /*
    console.log('Cheat.shAtom was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
    */
  }

};
