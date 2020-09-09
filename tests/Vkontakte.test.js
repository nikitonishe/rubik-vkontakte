/* global describe test expect */
const path = require('path');
const lodashGet = require('lodash/get');
const { Kubiks: { Config } } = require('rubik-main');

const { createApp, createKubik } = require('rubik-main/tests/helpers/creators');

const Vkontakte = require('../classes/Vkontakte.js');

const CONFIG_VOLUMES = [
  path.join(__dirname, '../default/'),
  path.join(__dirname, '../config/')
];

const get = () => {
  const app = createApp();
  app.add(new Config(CONFIG_VOLUMES));

  const kubik = createKubik(Vkontakte, app);

  return { app, kubik };
}

const callbackServerOptions = {
  title: '__Test__',
  group_id: '178848737',
  url: 'https://test.ru',
  secret_key: '5e85b027b9861b050c69f5d8',
  api_version: 5.122,
  message_new: 1,
  message_allow: 1
}

async function createCallbackServer(kubik) {
  return kubik.groups.addCallbackServer(callbackServerOptions);
}

async function deleteCallbackServer(kubik) {
  const testServer = await getTestServer(kubik);
  if (!testServer) throw new Error('test server not found');
  return kubik.groups.deleteCallbackServer({
    group_id: callbackServerOptions.group_id,
    server_id: testServer.id
  });
}

async function getTestServer(kubik) {
  const response = await kubik.groups.getCallbackServers(callbackServerOptions);
  const items = lodashGet(response, 'response.items');
  if (!items) return;
  for (const item of items) {
    if (item.title !== callbackServerOptions.title) continue;
    return item;
  }
}

describe('Кубик для работы с Vkontakte', () => {
  test('Создается без проблем и добавляется в App', () => {
    const { app, kubik } = get();
    expect(app.vkontakte).toBe(kubik);
    expect(app.get('vkontakte')).toBe(kubik);
  });

  test('Создает и удаляет тестовый сервер', async () => {
    const { app, kubik } = get();
    await app.up();
    await createCallbackServer(kubik);
    await deleteCallbackServer(kubik);
    await app.down();
  });

  test('Создает сервер и меняет версию апи', async () => {
    const { app, kubik } = get();
    await app.up();
    await createCallbackServer(kubik);

    const testServer = await getTestServer(kubik);
    await kubik.groups.setCallbackSettings({
      server_id: testServer.id,
      ...callbackServerOptions
    });

    await deleteCallbackServer(kubik);
    await app.down();
  })

  test('Запрос с неверным токеном приводит к ошибке', async () => {
    const { app, kubik } = get();
    await app.up();

    await expect(kubik.groups.getCallbackServers(callbackServerOptions, { token: '123' })).rejects.toThrow();

    await app.down();
  })
});
