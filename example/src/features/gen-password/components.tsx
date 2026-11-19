import core from '@nodejs-password-generator/core';
import { writeClipboard } from '@solid-primitives/clipboard';
import { createMemo, createStore, Loading, Show } from 'solid-js';

export function GenPassword() {
  const [store, setStore] = createStore<{
    length: number;
    upperCase: boolean;
    lowerCase: boolean;
    digits: boolean;
    symbols: boolean;
    copied: boolean;
    error?: string;
  }>({
    length: 16,
    upperCase: true,
    lowerCase: true,
    digits: true,
    symbols: true,
    copied: false,
    error: undefined,
  });

  const password = createMemo(async () => {
    return core.generatePasswordWithOptions({
      length: store.length,
      includeUpperCase: store.upperCase,
      includeLowerCase: store.lowerCase,
      includeSymbols: store.symbols,
      includeDigits: store.digits,
    });
  });

  return (
    <div class="flex flex-col p-4">
      <p class="text-2xl pb-2">Password Generator</p>
      <div class="flex pb-2">
        <Loading fallback="Generating...">
          <div class="flex flex-col p-4">
            <div class="flex pb-2">
              <input
                type="text"
                readonly
                value={password() ?? ''}
                class="border mr-2"
                size={password()?.length}
              />
              <Show
                when={!store.copied}
                fallback={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="self-center h-5 w-5"
                  >
                    <title>クリップボードにコピーしました</title>
                    <rect x="5" y="4" width="14" height="18" rx="2" />
                    <path d="M9 4.5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5" />
                    <path d="m8 14 3 3 5-6" />
                  </svg>
                }
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  onClick={() => {
                    const value = password();
                    if (value) {
                      writeClipboard(value);
                      setStore((draft) => {
                        draft.copied = true;
                      });
                    }
                  }}
                  class="self-center h-5 w-5 cursor-pointer"
                >
                  <title>クリップボードにコピーする</title>
                  <rect x="8" y="8" width="13" height="13" rx="2" />
                  <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
                </svg>
              </Show>
            </div>

            <div class="p-2 border-gray-400 rounded border">
              <div class="flex pb-2">
                <label for="length" class="self-center pr-2">
                  Length
                </label>
                <input
                  type="number"
                  id="length"
                  size={2}
                  value={store.length}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setStore((draft) => {
                      if (value >= 4) {
                        draft.length = value;
                        delete draft.error;
                      } else {
                        draft.error = 'Length must be greater than or equal to 4';
                      }
                    });
                  }}
                  min={4}
                  class="invalid:border-red-500 border"
                />
              </div>

              <div class="flex pb-2">
                <label for="upperCase" class="self-center pr-2">
                  Include Uppercase
                </label>
                <input
                  type="checkbox"
                  id="upperCase"
                  checked={store.upperCase}
                  onChange={() => {
                    setStore((draft) => {
                      draft.upperCase = !draft.upperCase;
                      delete draft.error;
                    });
                  }}
                  class="border self-center"
                />
              </div>

              <div class="flex pb-2">
                <label for="lowerCase" class="self-center pr-2">
                  Include Lowercase
                </label>
                <input
                  type="checkbox"
                  id="lowerCase"
                  checked={store.lowerCase}
                  onChange={() => {
                    setStore((draft) => {
                      draft.lowerCase = !draft.lowerCase;
                      delete draft.error;
                    });
                  }}
                  class="border self-center"
                />
              </div>

              <div class="flex pb-2">
                <label for="digits" class="self-center pr-2">
                  Include Digists
                </label>
                <input
                  type="checkbox"
                  id="digits"
                  checked={store.digits}
                  onChange={() => {
                    setStore((draft) => {
                      draft.digits = !draft.digits;
                      delete draft.error;
                    });
                  }}
                  class="border self-center"
                />
              </div>

              <div class="flex pb-2">
                <label for="symbols" class="self-center pr-2">
                  Include Symbol Characters
                </label>
                <input
                  type="checkbox"
                  id="symbols"
                  checked={store.symbols}
                  onChange={() => {
                    setStore((draft) => {
                      draft.symbols = !draft.symbols;
                      delete draft.error;
                    });
                  }}
                  class="border self-center"
                />
              </div>
            </div>
          </div>
          <Show when={!password()}>
            <div class="flex p-4">
              <p class="text-red-500">{'Failed to generate password'}</p>
            </div>
          </Show>
        </Loading>
        <Show when={store.error}>
          <div class="flex p-4">
            <p class="text-red-500">{store.error}</p>
          </div>
        </Show>
      </div>
      <div class="flex">
        <a
          href="https://github.com/poad/nodejs-password-generator"
          class="underline"
          target="_blank"
          rel="noopener"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="self-center inline h-5 w-5 mr-2"
            aria-hidden="true"
          >
            <title>GitHub Repository</title>
            <path d="M14 3h7v7M10 14 21 3" />
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </svg>
          Source Code
        </a>
      </div>
    </div>
  );
}
