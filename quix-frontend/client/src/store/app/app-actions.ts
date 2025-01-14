import {Runner} from '../../lib/runner';
import {INotebook, INote} from '../../../../shared';

export const setSearchText = (searchText: string, origin: 'user' | 'machine' = 'machine') => ({
  type: 'app.setSearchText',
  searchText,
  origin
});

export const setSearchPage = (searchPage: number, origin: 'user' | 'machine' = 'machine') => ({
  type: 'app.setSearchPage',
  searchPage,
  origin
});

export const addRunner = (id: string, runner: Runner, note: INote, notebook: INotebook, origin: 'user' | 'machine' = 'machine') => ({
  type: 'app.addRunner',
  id,
  origin,
  runner,
  note,
  notebook
})

export const removeRunner = (id: string, origin: 'user' | 'machine' = 'machine') => ({
  type: 'app.removeRunner',
  id,
  origin
});
