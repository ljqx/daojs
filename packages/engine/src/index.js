import { Loader } from '@daojs/calculation-network';
import Registry from '@daojs/registry';
import register from './rpc-server';
import * as coreProcedures from './procedures';

const ProcedureRegistry = new Registry()
  .register(coreProcedures);

let contextNetwork = null;

function setup(story = {}) {
  contextNetwork = new Loader(ProcedureRegistry).load(story);
}

async function set(key, value) {
  return (await contextNetwork).set({ [key]: value });
}

async function get(key) {
  return (await contextNetwork).get(key);
}

function teardown() {
  contextNetwork = null;
}

register({
  get,
  set,
  setup,
  teardown,
});
