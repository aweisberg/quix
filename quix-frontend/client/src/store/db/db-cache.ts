import {StoreCache} from '../../lib/store';
import {setDb, setError} from './db-actions';
import {db} from '../../services/resources';
import {convert} from '../../services/db';

export default store => new StoreCache<any>(store, 'db.db')
  .cacheWith(setDb)
  .catchWith(setError)
  .fetchWith(() => db().then(res => convert(res)));
