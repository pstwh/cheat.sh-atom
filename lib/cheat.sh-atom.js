'use babel';

import Cheat.shAtomView from './cheat.sh-atom-view';
import { CompositeDisposable } from 'atom';

export default {

  cheat.shAtomView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.cheat.shAtomView = new Cheat.shAtomView(state.cheat.shAtomViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.cheat.shAtomView.getElement(),
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
    this.cheat.shAtomView.destroy();
  },

  serialize() {
    return {
      cheat.shAtomViewState: this.cheat.shAtomView.serialize()
    };
  },

  toggle() {
    console.log('Cheat.shAtom was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
