import core from '@nodejs-password-generator/core';
import { createResource, createSignal, Show, Suspense } from 'solid-js';
import { writeClipboard } from "@solid-primitives/clipboard";
import { FiCopy } from 'solid-icons/fi';
import { BsClipboardCheckFill } from 'solid-icons/bs';
import { OcMarkgithub2 } from 'solid-icons/oc';

export function GenPassword() {
  const [password] = createResource(async () => core.generatePassword(16));
  const [copied, setCopied] = createSignal(false);

  return (
    <div class='flex flex-col p-4'>
      <p class="text-2xl pb-2">Generated Password</p>
      <div class='flex pb-2'>
        <Suspense fallback="Generating...">
          <input type="text" readOnly value={password()} class='border mr-2' />
          <Show when={!copied()} fallback={<BsClipboardCheckFill class='self-center' title='クリップボードにコピーしました' />}>
            <FiCopy onClick={() => {
              const value = password();
              if (value) {
                writeClipboard(value); setCopied(true);
              }
            }} title="クリップボードにコピーする" class='self-center'/>
          </Show>
        </Suspense>
      </div>
      <div class='flex'>
        <a href="https://github.com/poad/nodejs-password-generator" class="underline" target="_blank" rel="noopener"><OcMarkgithub2 class='self-center inline mr-2' title='GitHub Repository' />Source Code</a>
      </div>
    </div>
  );
}
