export function ankiConnectVersion() {
  return ankiApiCall("version")
}

export function ankiConnectDeckNames() {
  return ankiApiCall("deckNames")
}

export function ankiConnectModelNames() {
  return ankiApiCall("modelNames")
}

export function ankiConnectAddNote(params) {
  return ankiApiCall("addNote", params)
}

export function ankiConnectModelFieldNames(modelName) {
  return ankiApiCall("modelFieldNames", {
    "modelName": modelName
  })
}

function ankiApiCall(action, params = {}) {
  return ankiConnectInvoke(action, 5, params)
}

function ankiConnectInvoke(action, version, params) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', () => reject('failed to connect to AnkiConnect'));
    xhr.addEventListener('load', () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.error) {
          reject(response.error);
        } else {
          if (response.hasOwnProperty('result')) {
            resolve(response.result);
          } else {
            reject('failed to get results from AnkiConnect');
          }
        }
      } catch (e) {
        reject(e);
      }
    });

    xhr.open('POST', 'http://127.0.0.1:8765', true);
    xhr.send(JSON.stringify({action, version, params}));
  });
}