import {takeWhile} from 'lodash';
import {utils} from '../../lib/core';
import {Store} from '../../lib/store';
import {toast} from '../../lib/ui';
import {Instance} from '../../lib/app';
import {INote, NotebookActions, IFile, NoteActions, INotebook, IFilePathItem, createNote} from '../../../../shared';
import {FileType} from '../../../../shared/entities/file';
import {IScope} from './notebook-types';
import {setNotebook, setNote, queueNote, toggleMark, unmarkAll} from '../../store/notebook/notebook-actions';
import {saveQueuedNotes, deleteNotebook, copyNotebook, goToFile, goToRoot, prompt, copyNote} from '../../services';
import {removeRunner, addRunner} from '../../store/app/app-actions';

export const onBreadcrumbClick = (scope: IScope, store: Store, app: Instance) => (file: IFilePathItem) => {
  const {notebook: {owner, path}} = scope.vm.state.value();

  goToFile(app, {...file, owner, type: FileType.folder, path: takeWhile(path, item => item.id !== file.id)});
};

export const onGoToRootClick = (scope: IScope, store: Store, app: Instance) => () => {
  goToRoot(app);
};

export const onNameChange = (scope: IScope, store: Store, app: Instance) => (file: IFile) => {
  const {id, name} = file;

  store.dispatchAndLog(NotebookActions.updateName(id, name));
}

export const onDelete = (scope: IScope, store: Store, app: Instance) => (notebook: INotebook) => {
  deleteNotebook(store, app, notebook)
    .then(() => toast.showToast({
      text: `Deleted notebook "${notebook.name}"`,
      type: 'success'
    }, 3000));
}

export const onClone = (scope: IScope, store: Store, app: Instance) => (notebook: INotebook) => {
  prompt({
    title: 'Clone notebook',
    subTitle: 'Choose destintation folder',
    yes: 'clone',
    content: `<quix-destination-picker ng-model="model.folder" context="folder" required></quix-destination-picker>`,
    onConfirm: ({model: {folder}}) => copyNotebook(store, app, folder, {
      ...notebook,
      notes: scope.vm.state.value().notes
    })
  }, scope, {model: {folder: null}})
  .then(res => toast.showToast({
    text: `Cloned notebook as "${res.name}"`,
    type: 'success'
  }, 3000));
}

export const onShare = (scope: IScope, store: Store, app: Instance) => (notebook: INotebook) => {
  utils.copyToClipboard(app.getNavigator().getUrl(null, {id: notebook.id}));

  toast.showToast({
    text: 'Copied notebook url to clipboard',
    type: 'success'
  }, 3000);
}

export const onLikeToggle = (scope: IScope, store: Store, app: Instance) => (notebook: INotebook) => {
  const {id, isLiked} = notebook;

  store.dispatchAndLog(NotebookActions.toggleIsLiked(id, !isLiked))
    .then((action) => toast.showToast({
      text: action.isLiked ? 'Added notebook to favorites' : 'Removed notebook from favorites',
      type: 'success'
    }, 3000));
}

export const onSave = (scope: IScope, store: Store, app: Instance) => () => {
  saveQueuedNotes(store);
}

export const onRun = (scope: IScope, store: Store, app: Instance) => () => {
  saveQueuedNotes(store);
}

export const onNoteSave = (scope: IScope, store: Store, app: Instance) => () => {
  saveQueuedNotes(store);
}

export const onNoteRun = (scope: IScope, store: Store, app: Instance) => () => {
  saveQueuedNotes(store);
}

export const onNoteAdd = (scope: IScope, store: Store, app: Instance) => () => {
  const {notebook} = scope.vm.state.value();
  const {id} = notebook;
  const note = createNote(id);
  
  store.dispatchAndLog(NoteActions.addNote(note.id, note));
  store.dispatch(setNote(note));
  
  const vm = scope.vm.notes.get(note);
  vm.focusName = true;
}

export const onNoteClone = (scope: IScope, store: Store, app: Instance) => (note: INote) => {
  prompt({
    title: 'Clone note',
    subTitle: 'Choose destintation notebook',
    yes: 'clone',
    content: `<quix-destination-picker ng-model="model.notebook" context="notebook" required></quix-destination-picker>`,
    onConfirm: ({model: {notebook}}) => copyNote(store, app, notebook, note)
  }, scope, {model: {notebook: null}})
  .then((res) => toast.showToast({
    text: `Cloned note as "${res.name}"`,
    type: 'success'
  }, 3000));
}

export const onNoteShare = (scope: IScope, store: Store, app: Instance) => (note: INote) => {
  const {notebook} = scope.vm.state.value();

  utils.copyToClipboard(app.getNavigator().getUrl(null, {id: notebook.id, note: note.id}));

  toast.showToast({
    text: 'Copied note url to clipboard',
    type: 'success'
  }, 3000);
}

export const onNoteDelete = (scope: IScope, store: Store, app: Instance) => (note: INote) => {
  store.dispatchAndLog(NoteActions.deleteNote(note.id))
    .then(() => toast.showToast({
      text: `Deleted note "${note.name}"`,
      type: 'success'
    }, 3000));
}

export const onNoteContentChange = (scope: IScope, store: Store, app: Instance) => (note: INote) => {
  store.dispatch(queueNote(note));
}

export const onNoteNameChange = (scope: IScope, store: Store, app: Instance) => (note: INote) => {
  store.dispatchAndLog(NoteActions.updateName(note.id, note.name));
}

export const onNoteReorder = (scope: IScope, store: Store, app: Instance) => (e: any, {item}: any) => {
  const {model: note, dropindex: index} = item.sortable;

  if (typeof index !== 'undefined') {
    store.dispatchAndLog(NoteActions.reorderNote(note.id, index));
  }
}

export const onMarkToggle = (scope: IScope, store: Store, app: Instance) => (note: INote) => {
  store.dispatch(toggleMark(note));
};


export const onMarkedNotesDelete = (scope: IScope, store: Store, app: Instance) => (notes: INote[]) => {
  store.dispatchAndLog(notes.map(note => NoteActions.deleteNote(note.id)))
    .then(() => toast.showToast({
      text: `Deleted ${notes.length} notes`,
      type: 'success'
    }, 3000));
}

export const onUnmarkAll = (scope: IScope, store: Store, app: Instance) => () => {
  store.dispatch(unmarkAll());
};

export const onRunnerCreated = (scope: IScope, store: Store) => (note, runner) => {
  store.dispatch(addRunner(note.id, runner, note, scope.vm.state.value().notebook));
};

export const onRunnerDestroyed = (scope: IScope, store: Store) => (note) => {
  store.dispatch(removeRunner(note.id));
};

export const $onDestroy = (scope: IScope, store: Store, app: Instance) => () => {
  saveQueuedNotes(store);
  store.dispatch(setNotebook(null));
}
