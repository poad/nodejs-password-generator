import core from '@nodejs-password-generator/core';
import { createResource, createSignal, Show, Suspense } from 'solid-js';
import { writeClipboard } from "@solid-primitives/clipboard";
import { FiCopy } from 'solid-icons/fi';
import { BsClipboardCheckFill } from 'solid-icons/bs';
import { OcMarkgithub2 } from 'solid-icons/oc';
import { createStore } from 'solid-js/store';

export function GenPassword() {
  const [store, setStore] = createStore<{
    length: number;
    upperCase: boolean,
    lowerCase: boolean,
    digits: boolean,
    symbols: boolean,
    copied: boolean,
    error?: string,
  }>({
    length: 16,
    upperCase: true,
    lowerCase: true,
    digits: true,
    symbols: true,
    copied: false,
    error: undefined,
  });

  const [password, { refetch }] = createResource(async () => {
    return core.generatePasswordWithOptions({
      length: store.length,
      includeUpperCase: store.upperCase,
      includeLowerCase: store.lowerCase,
      includeSymbols: store.symbols,
      includeDigits: store.digits,
    });
  });

  return (
    <div class='flex flex-col p-4'>
      <p class="text-2xl pb-2">Generated Password</p>
      <div class='flex pb-2'>
        <Suspense fallback="Generating...">
          <div class='flex flex-col p-4'>
            <div class='flex pb-2'>
              <input type="text" readOnly value={password() ?? ''} class='border mr-2' size={password()?.length} />
              <Show when={!store.copied} fallback={<BsClipboardCheckFill class='self-center' title='クリップボードにコピーしました' />}>
                <FiCopy onClick={() => {
                  const value = password();
                  if (value) {
                    writeClipboard(value); setStore((prev) => ({ ...prev, copied: true }));
                  }
                }} title="クリップボードにコピーする" class='self-center' />
              </Show>
            </div>

            <div class='p-2 border-gray-400 rounded border'>
              <div class='flex pb-2'>
                <label for="length" class='self-center pr-2'>Length</label>
                <input
                  type="number"
                  id='length'
                  size={2}
                  value={store.length}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setStore((prev) => {
                      if (value >= 4) {
                        return { ...prev, length: value, error: undefined };
                      } else {
                        return { ...prev, error: 'Length must be greater than or equal to 4' };
                      }
                    });
                    if (!store.error) {
                      refetch();
                    }
                  }}
                  min={4}
                  class='invalid:border-red-500 border' />
              </div>

              <div class='flex pb-2'>
                <label for="upperCase" class='self-center pr-2'>Include Uppercase</label>
                <input type="checkbox"
                  id='upperCase'
                  checked={store.upperCase}
                  onChange={() => {
                    setStore((prev) => ({ ...prev, upperCase: !prev.upperCase, error: undefined }));
                    refetch();
                  }}
                  class='border self-center' />
              </div>

              <div class='flex pb-2'>
                <label for="lowerCase" class='self-center pr-2'>Include Lowercase</label>
                <input type="checkbox"
                  id='lowerCase'
                  checked={store.lowerCase}
                  onChange={() => {
                    setStore((prev) => ({ ...prev, lowerCase: !prev.lowerCase, error: undefined }));
                    refetch();
                  }}
                  class='border self-center' />
              </div>

              <div class='flex pb-2'>
                <label for="digits" class='self-center pr-2'>Include Digists</label>
                <input type="checkbox"
                  id='digits'
                  checked={store.digits}
                  onChange={() => {
                    setStore((prev) => ({ ...prev, digits: !prev.digits, error: undefined }));
                    refetch();
                  }}
                  class='border self-center' />
              </div>

              <div class='flex pb-2'>
                <label for="symbols" class='self-center pr-2'>Include Symbol Characters</label>
                <input type="checkbox"
                  id='symbols'
                  checked={store.symbols}
                  onChange={() => {
                    setStore((prev) => ({ ...prev, symbols: !prev.symbols, error: undefined }));
                    refetch();
                  }}
                  class='border self-center' />
              </div>

            </div>
          </div>
          <Show when={!password()}>
            <div class='flex p-4'>
              <p class='text-red-500'>{'Failed to generate password'}</p>
            </div>
          </Show>
        </Suspense>
        <Show when={store.error}>
          <div class='flex p-4'>
            <p class='text-red-500'>{store.error}</p>
          </div>
        </Show>
      </div>
      <div class='flex'>
        <a href="https://github.com/poad/nodejs-password-generator" class="underline" target="_blank" rel="noopener"><OcMarkgithub2 class='self-center inline mr-2' title='GitHub Repository' />Source Code</a>
      </div>
    </div>
  );
}
